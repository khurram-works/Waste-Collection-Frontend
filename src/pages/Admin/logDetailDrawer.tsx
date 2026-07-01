import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";


interface AuditLog {
  auditId: string;
  timestamp: string;
  userId: number;
  userRole: "ADMIN" | "WORKER" | "CITIZEN";
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";
  status: "SUCCESS" | "FAILED";
  targetType: string;
  targetId: string | null;
  oldValue: unknown;
  newValue: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  metadata: unknown;
  createdAt: string;
}

type Tab = "overview" | "changes" | "network";


const ACTION_CFG = {
  LOGIN:  { label: "Login",  icon: "login",      pillBg: "#eff6ff", pillText: "#1d4ed8", pillBorder: "#bfdbfe", dotBg: "#60a5fa",  gradFrom: "#3b82f6", gradTo: "#2563eb" },
  LOGOUT: { label: "Logout", icon: "logout",     pillBg: "#f8fafc", pillText: "#475569", pillBorder: "#e2e8f0", dotBg: "#94a3b8",  gradFrom: "#64748b", gradTo: "#475569" },
  CREATE: { label: "Create", icon: "add_circle", pillBg: "#ecfdf5", pillText: "#065f46", pillBorder: "#a7f3d0", dotBg: "#10b981",  gradFrom: "#059669", gradTo: "#047857" },
  UPDATE: { label: "Update", icon: "edit",       pillBg: "#fffbeb", pillText: "#92400e", pillBorder: "#fde68a", dotBg: "#f59e0b",  gradFrom: "#f59e0b", gradTo: "#d97706" },
  DELETE: { label: "Delete", icon: "delete",     pillBg: "#fef2f2", pillText: "#991b1b", pillBorder: "#fecaca", dotBg: "#f87171",  gradFrom: "#ef4444", gradTo: "#dc2626" },
} as const;

const ROLE_CFG = {
  ADMIN:   { label: "Admin",   pillBg: "#f5f3ff", pillText: "#5b21b6", pillBorder: "#ddd6fe", avatarFrom: "#8b5cf6", avatarTo: "#7c3aed" },
  WORKER:  { label: "Worker",  pillBg: "#f0fdf4", pillText: "#065f46", pillBorder: "#a7f3d0", avatarFrom: "#34d399", avatarTo: "#059669" },
  CITIZEN: { label: "Citizen", pillBg: "#eff6ff", pillText: "#1e40af", pillBorder: "#bfdbfe", avatarFrom: "#60a5fa", avatarTo: "#3b82f6" },
} as const;


function fmt(ts: string | null | undefined) {
  if (!ts) return { date: "—", time: "—", relative: "—" };
  const d = new Date(ts);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const relative =
    mins < 1  ? "just now"
    : mins < 60 ? `${mins}m ago`
    : hrs  < 24 ? `${hrs}h ago`
    : `${days}d ago`;
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    relative,
  };
}

function stringify(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") {
    try { return JSON.stringify(JSON.parse(v), null, 2); } catch { return v; }
  }
  return JSON.stringify(v, null, 2);
}


function JsonHighlight({ text }: { text: string }) {
  const parts = text.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/"[^"]*"\s*:/.test(p)) {
          const key = p.replace(/\s*:$/, "");
          return <span key={i}><span style={{ color: "#0369a1" }}>{key}</span><span style={{ color: "#94a3b8" }}>:</span></span>;
        }
        if (/^"/.test(p))             return <span key={i} style={{ color: "#059669" }}>{p}</span>;
        if (/^(true|false)$/.test(p)) return <span key={i} style={{ color: "#7c3aed" }}>{p}</span>;
        if (/^null$/.test(p))         return <span key={i} style={{ color: "#ea580c" }}>{p}</span>;
        if (/^-?\d/.test(p))          return <span key={i} style={{ color: "#d97706" }}>{p}</span>;
        return <span key={i} style={{ color: "#64748b" }}>{p}</span>;
      })}
    </>
  );
}


function JsonPanel({ value, label, accentColor }: { value: unknown; label: string; accentColor: string }) {
  const [copied, setCopied] = useState(false);
  const text = stringify(value);

  function copy() {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700,
          color: accentColor, letterSpacing: "0.12em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, display: "inline-block" }} />
          {label}
        </span>
        {text && (
          <button onClick={copy} style={{
            display: "flex", alignItems: "center", gap: 4,
            background: copied ? "#ecfdf5" : "#f8fafc",
            border: `1px solid ${copied ? "#a7f3d0" : "#e2e8f0"}`,
            borderRadius: 6, padding: "3px 9px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
            color: copied ? "#059669" : "#64748b", transition: "all 0.2s",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      <div style={{
        background: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${accentColor}, transparent 70%)` }} />
        <div style={{ padding: "12px 16px 16px" }}>
          {text ? (
            <pre style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 12, lineHeight: 1.85,
              color: "#475569",
              overflowX: "auto",
              whiteSpace: "pre-wrap", wordBreak: "break-word",
              maxHeight: 220, overflowY: "auto",
            }}>
              <JsonHighlight text={text} />
            </pre>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 8, padding: "22px 0",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#cbd5e1" }}>data_object</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
                color: "#94a3b8", fontWeight: 500,
              }}>No state recorded</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function FieldRow({ icon, label, children, last = false }: {
  icon: string; label: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "13px 0",
      borderBottom: last ? "none" : "1px solid #f1f5f9",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0, marginTop: 1,
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: "0 0 4px",
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
          color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>{label}</p>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
          color: "#1e293b", lineHeight: 1.5, wordBreak: "break-all",
        }}>{children}</div>
      </div>
    </div>
  );
}


function TabBtn({ label, icon, active, onClick }: {
  label: string; icon: string; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 3, padding: "11px 4px 10px",
      background: active ? "#ecfdf5" : "transparent",
      border: "none",
      borderBottom: active ? "2px solid #059669" : "2px solid transparent",
      cursor: "pointer", transition: "all 0.2s",
    }}>
      <span className="material-symbols-outlined" style={{
        fontSize: 18,
        color: active ? "#059669" : "#94a3b8",
        transition: "color 0.2s",
      }}>{icon}</span>
      <span style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 10.5, fontWeight: 700,
        color: active ? "#065f46" : "#94a3b8",
        letterSpacing: "0.06em", textTransform: "uppercase",
        transition: "color 0.2s",
      }}>{label}</span>
    </button>
  );
}


function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>{icon}</span>
      <span style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 700,
        fontSize: 11, color: "#64748b",
        letterSpacing: "0.1em", textTransform: "uppercase",
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#f1f5f9", marginLeft: 4 }} />
    </div>
  );
}


function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #f1f5f9",
      borderRadius: 14, padding: "0 16px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {children}
    </div>
  );
}


export default function LogDetailDrawer({
  isOpen,
  onClose,
  log,
}: {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}) {
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab("overview");
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const action  = ACTION_CFG[log?.action as keyof typeof ACTION_CFG]   ?? ACTION_CFG.UPDATE;
  const role    = ROLE_CFG[log?.userRole as keyof typeof ROLE_CFG]     ?? ROLE_CFG.CITIZEN;
  const ts      = fmt(log?.timestamp ?? log?.createdAt);
  const created = fmt(log?.createdAt);

  const isSuccess = log?.status === "SUCCESS";

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">


      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.35)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
        <DialogPanel
          transition
          style={{ pointerEvents: "auto", width: "100%", maxWidth: 500 }}
          className="h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out data-closed:translate-x-full"
        >
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc" }}>


            <div style={{
              flexShrink: 0,
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
            }}>

              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: `radial-gradient(circle, ${action.gradFrom}18, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative", padding: "18px 20px 20px" }}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#fff", fontVariationSettings: "'FILL' 1" }}>recycling</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 14.5, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                        Smart<span style={{ color: "#059669" }}>Waste</span>
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                        Audit Trail
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    style={{
                      width: 34, height: 34, borderRadius: 9,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#94a3b8", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#dc2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>close</span>
                  </button>
                </div>


                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>

                  <div style={{
                    width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                    background: `linear-gradient(135deg, ${action.gradFrom}, ${action.gradTo})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 14px ${action.gradFrom}40`,
                    position: "relative",
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26, color: "#fff", fontVariationSettings: "'FILL' 1" }}>{action.icon}</span>
                    {isSuccess && (
                      <span style={{
                        position: "absolute", top: -4, right: -4,
                        width: 14, height: 14, borderRadius: "50%",
                        background: "#059669",
                        border: "2.5px solid #ffffff",
                        boxShadow: "0 0 8px rgba(5,150,105,0.5)",
                      }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <h2 style={{
                        margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                        fontSize: 22, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1,
                      }}>
                        {action.label}
                      </h2>

                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 20,
                        background: isSuccess ? "#ecfdf5" : "#fef2f2",
                        border: `1px solid ${isSuccess ? "#a7f3d0" : "#fecaca"}`,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: isSuccess ? "#10b981" : "#f87171",
                          display: "inline-block",
                        }} />
                        <span style={{
                          fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
                          color: isSuccess ? "#065f46" : "#991b1b",
                          letterSpacing: "0.06em",
                        }}>{log?.status ?? "—"}</span>
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>

                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 9px", borderRadius: 6,
                        background: role.pillBg, border: `1px solid ${role.pillBorder}`,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                        color: role.pillText,
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 11 }}>shield</span>
                        {role.label}
                      </span>
                      {log?.targetType && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 9px", borderRadius: 6,
                          background: "#f1f5f9", border: "1px solid #e2e8f0",
                          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#64748b",
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 11 }}>database</span>
                          {log.targetType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                
                <div style={{
                  background: "#f8fafc", borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  padding: "10px 14px",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                }}>
                  <div>
                    <p style={{ margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Timestamp</p>
                    <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#475569", fontWeight: 500 }}>
                      {ts.date} · {ts.time}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Audit ID</p>
                    <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#475569", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      #{log?.auditId?.slice(0, 20) ?? "—"}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div style={{
              flexShrink: 0, display: "flex",
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
            }}>
              {([
                { id: "overview" as Tab, label: "Overview", icon: "info"           },
                { id: "changes"  as Tab, label: "Changes",  icon: "compare_arrows" },
                { id: "network"  as Tab, label: "Network",  icon: "router"         },
              ]).map(t => (
                <TabBtn key={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={() => setTab(t.id)} />
              ))}
            </div>


            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px", background: "#f8fafc" }}>

              {tab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  <div>
                    <SectionLabel icon="person" label="Actor" />
                    <Card>
                      <FieldRow icon="badge" label="User ID">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#334155" }}>
                          UID‑{log?.userId ?? "—"}
                        </span>
                      </FieldRow>
                      <FieldRow icon="shield" label="Role">
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "3px 10px", borderRadius: 6,
                          background: role.pillBg, border: `1px solid ${role.pillBorder}`,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: role.pillText,
                        }}>{role.label}</span>
                      </FieldRow>
                      <FieldRow icon="bolt" label="Action">
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "3px 10px", borderRadius: 6,
                          background: action.pillBg, border: `1px solid ${action.pillBorder}`,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: action.pillText,
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>{action.icon}</span>
                          {action.label}
                        </span>
                      </FieldRow>
                      <FieldRow icon="fact_check" label="Status" last>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "3px 10px", borderRadius: 6,
                          background: isSuccess ? "#ecfdf5" : "#fef2f2",
                          border: `1px solid ${isSuccess ? "#a7f3d0" : "#fecaca"}`,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                          color: isSuccess ? "#065f46" : "#991b1b",
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>
                            {isSuccess ? "check_circle" : "cancel"}
                          </span>
                          {log?.status ?? "—"}
                        </span>
                      </FieldRow>
                    </Card>
                  </div>

                  <div>
                    <SectionLabel icon="my_location" label="Target" />
                    <Card>
                      <FieldRow icon="database" label="Target Type">
                        <span style={{ color: log?.targetType ? "#334155" : "#94a3b8", fontStyle: log?.targetType ? "normal" : "italic", fontSize: 13 }}>
                          {log?.targetType || "Not specified"}
                        </span>
                      </FieldRow>
                      <FieldRow icon="tag" label="Target ID">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: log?.targetId ? "#475569" : "#94a3b8", fontStyle: log?.targetId ? "normal" : "italic" }}>
                          {log?.targetId || "None"}
                        </span>
                      </FieldRow>
                      <FieldRow icon="confirmation_number" label="Request ID" last>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: log?.requestId ? "#475569" : "#94a3b8", fontStyle: log?.requestId ? "normal" : "italic", wordBreak: "break-all" }}>
                          {log?.requestId || "None"}
                        </span>
                      </FieldRow>
                    </Card>
                  </div>

                  <div>
                    <SectionLabel icon="data_object" label="Metadata" />
                    <JsonPanel value={log?.metadata} label="Raw Metadata" accentColor="#7c3aed" />
                  </div>

                </div>
              )}

              {tab === "changes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  <div style={{
                    background: "#fffbeb", border: "1px solid #fde68a",
                    borderRadius: 10, padding: "11px 14px",
                    display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#d97706", flexShrink: 0, marginTop: 1 }}>info</span>
                    <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#92400e", fontWeight: 500, lineHeight: 1.6 }}>
                      State snapshot captured at the moment of the{" "}
                      <strong style={{ color: "#b45309" }}>{action.label}</strong> event.
                    </p>
                  </div>

                  <JsonPanel value={log?.oldValue} label="Previous State" accentColor="#d97706" />

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                    <div style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "5px 12px", borderRadius: 20,
                      background: "#ecfdf5", border: "1px solid #a7f3d0",
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#059669" }}>south</span>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700,
                        color: "#059669", letterSpacing: "0.06em", textTransform: "uppercase",
                      }}>Transformed To</span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                  </div>

                  <JsonPanel value={log?.newValue} label="New State" accentColor="#059669" />

                </div>
              )}

              {tab === "network" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  <div>
                    <SectionLabel icon="router" label="Connection" />
                    <Card>
                      <FieldRow icon="language" label="IP Address">
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                          color: log?.ipAddress ? "#0369a1" : "#94a3b8",
                          fontStyle: log?.ipAddress ? "normal" : "italic",
                        }}>
                          {log?.ipAddress || "Not captured"}
                        </span>
                      </FieldRow>
                      <FieldRow icon="schedule" label="Occurred" last>
                        <div>
                          <div style={{ color: "#1e293b", fontSize: 13 }}>{ts.date}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#64748b", marginTop: 3 }}>
                            {ts.time} ·{" "}
                            <span style={{ color: "#059669", fontWeight: 700 }}>{ts.relative}</span>
                          </div>
                        </div>
                      </FieldRow>
                    </Card>
                  </div>

                  <div>
                    <SectionLabel icon="devices" label="Client" />
                    <div style={{
                      background: "#ffffff",
                      border: "1px solid #f1f5f9",
                      borderRadius: 14, padding: "16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                      {log?.userAgent ? (
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
                          color: "#64748b", lineHeight: 1.8, wordBreak: "break-all",
                        }}>
                          {log.userAgent}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 0" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#cbd5e1" }}>devices_other</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#94a3b8", fontWeight: 500 }}>
                            No user agent recorded
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

            <div style={{
              flexShrink: 0, padding: "11px 20px",
              borderTop: "1px solid #e2e8f0",
              background: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#94a3b8" }}>history</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                  Logged {created.relative}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 10,
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  fontSize: 12.5, fontWeight: 700, color: "#64748b", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                Dismiss
              </button>
            </div>

          </div>
        </DialogPanel>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </Dialog>
  );
}