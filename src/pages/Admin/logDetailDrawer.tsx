// import React, { useState } from "react";
// import { Dialog, DialogPanel } from "@headlessui/react";
// import { toast } from "react-toastify";
// import { RequestDrawerProps } from "../../Types/types";
// import { assignRequest, rejectRequest } from "../../api/auth";
// import {
//   Listbox,
//   ListboxButton,
//   ListboxOption,
//   ListboxOptions,
// } from "@headlessui/react";

// interface AuditLog {
//   auditId: string;
//   timestamp: string;
//   userId: number;
//   userRole: "ADMIN" | "WORKER" | "CITIZEN";
//   action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";
//   status: "SUCCESS" | "FAILED";
//   targetType: string;
//   targetId: string | null;
//   oldValue: unknown;
//   newValue: unknown;
//   ipAddress: string | null;
//   userAgent: string | null;
//   requestId: string | null;
//   metadata: unknown;
//   createdAt: string;
// }

// export default function LogDetailDrawer({
//   isOpen,
//   onClose,
//   log,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   log: AuditLog;
// }) {
//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       <div
//         className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
//         aria-hidden="true"
//       />

//       <div className="fixed inset-0 flex justify-end">
//         <DialogPanel
//           transition
//           className="
//                   w-[420px] max-w-full bg-[#f6f9f7] h-full shadow-2xl flex flex-col
//                   transform transition duration-300 ease-out
//                   data-closed:translate-x-full
//                 "
//         >
//           <div className="fixed inset-0 bg-slate-900/30 z-50 flex justify-end backdrop-blur-sm">
//             <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right">
//               {/* Header */}
//               <div className="px-8 py-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
//                 <div>
//                   <h3 className="text-2xl font-bold text-slate-900">
//                     Event Details
//                   </h3>
//                   <p className="text-sm text-slate-500 font-mono mt-2 tracking-wide">
//                     req_id: 8f92a-4b1c-9002-e77a1b
//                   </p>
//                 </div>
//                 <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors hover:text-slate-900">
//                   <span className="material-symbols-outlined text-2xl">
//                     close
//                   </span>
//                 </button>
//               </div>

//               {/* Content */}
//               <div className="flex-1 overflow-y-auto p-8 space-y-8">
//                 {/* Meta Info Grid */}
//                 <div className="grid grid-cols-2 gap-6 text-sm">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
//                       Actor ID
//                     </p>
//                     <p className="text-base font-bold text-slate-900">
//                       usr_2210_wk
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
//                       IP Address
//                     </p>
//                     <p className="font-mono text-slate-900 text-sm font-medium">
//                       192.168.1.104
//                     </p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
//                       User Agent
//                     </p>
//                     <p className="text-sm text-slate-600 font-medium">
//                       Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...
//                     </p>
//                   </div>
//                 </div>

//                 <hr className="border-slate-200" />

//                 {/* State Views */}
//                 <div className="space-y-6">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
//                       <span className="material-symbols-outlined text-[18px]">
//                         history
//                       </span>{" "}
//                       Previous State
//                     </p>
//                     <div className="bg-slate-50 rounded-lg p-5 font-mono text-sm overflow-x-auto text-slate-700 border border-slate-200 shadow-inner">
//                       <pre className="leading-loose">
//                         {`{
//   "status": "pending",
//   "assigned_to": null,
//   "scheduled_date": "2023-10-25"
// }`}
//                       </pre>
//                     </div>
//                   </div>

//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
//                       <span className="material-symbols-outlined text-[18px]">
//                         update
//                       </span>{" "}
//                       New State
//                     </p>
//                     <div className="bg-slate-50 rounded-lg p-5 font-mono text-sm overflow-x-auto text-slate-700 border border-slate-200 relative shadow-inner">
//                       <div className="absolute top-3 right-3 flex gap-1">
//                         <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
//                       </div>
//                       <pre className="leading-loose">
//                         {`{
//   "status": "active",
//   "assigned_to": "usr_2210_wk",
//   "scheduled_date": "2023-10-25"
// }`}
//                       </pre>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { Dialog, DialogPanel } from "@headlessui/react";

// /* ─────────────────────────────────────────────
//    TYPE
// ───────────────────────────────────────────── */
// interface AuditLog {
//   auditId: string;
//   timestamp: string;
//   userId: number;
//   userRole: "ADMIN" | "WORKER" | "CITIZEN";
//   action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";
//   status: "SUCCESS" | "FAILED";
//   targetType: string;
//   targetId: string | null;
//   oldValue: unknown;
//   newValue: unknown;
//   ipAddress: string | null;
//   userAgent: string | null;
//   requestId: string | null;
//   metadata: unknown;
//   createdAt: string;
// }

// /* ─────────────────────────────────────────────
//    CONSTANTS / HELPERS
// ───────────────────────────────────────────── */
// const ACTION_CONFIG: Record<
//   AuditLog["action"],
//   { label: string; icon: string; color: string; bg: string; border: string }
// > = {
//   LOGIN:  { label: "Login",  icon: "login",        color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
//   LOGOUT: { label: "Logout", icon: "logout",       color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
//   CREATE: { label: "Create", icon: "add_circle",   color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
//   UPDATE: { label: "Update", icon: "edit",         color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
//   DELETE: { label: "Delete", icon: "delete",       color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
// };

// const ROLE_CONFIG: Record<
//   AuditLog["userRole"],
//   { label: string; color: string; bg: string }
// > = {
//   ADMIN:   { label: "Admin",   color: "#7c3aed", bg: "#f5f3ff" },
//   WORKER:  { label: "Worker",  color: "#059669", bg: "#ecfdf5" },
//   CITIZEN: { label: "Citizen", color: "#2563eb", bg: "#eff6ff" },
// };

// function formatTimestamp(ts: string) {
//   try {
//     const d = new Date(ts);
//     return {
//       date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//       time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
//     };
//   } catch {
//     return { date: "—", time: "—" };
//   }
// }

// function JsonViewer({ value, label, icon, accentColor }: {
//   value: unknown;
//   label: string;
//   icon: string;
//   accentColor: string;
// }) {
//   const [copied, setCopied] = useState(false);
//   const json = value != null ? JSON.stringify(value, null, 2) : null;

//   function handleCopy() {
//     if (!json) return;
//     navigator.clipboard.writeText(json).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   }

//   return (
//     <div style={{ marginBottom: 0 }}>
//       <div style={{
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         marginBottom: 10,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           <div style={{
//             width: 28, height: 28, borderRadius: 8, background: accentColor + "18",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <span className="material-symbols-outlined" style={{ fontSize: 15, color: accentColor }}>
//               {icon}
//             </span>
//           </div>
//           <span style={{
//             fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 11,
//             color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase",
//           }}>
//             {label}
//           </span>
//         </div>
//         {json && (
//           <button
//             onClick={handleCopy}
//             style={{
//               display: "flex", alignItems: "center", gap: 4,
//               background: copied ? "#ecfdf5" : "#f9fafb",
//               border: `1px solid ${copied ? "#6ee7b7" : "#e5e7eb"}`,
//               borderRadius: 6, padding: "4px 10px", cursor: "pointer",
//               fontFamily: "'DM Sans', sans-serif", fontSize: 11,
//               color: copied ? "#059669" : "#6b7280",
//               fontWeight: 600, transition: "all 0.2s",
//             }}
//           >
//             <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
//               {copied ? "check" : "content_copy"}
//             </span>
//             {copied ? "Copied" : "Copy"}
//           </button>
//         )}
//       </div>

//       <div style={{
//         background: "#0f172a",
//         borderRadius: 12,
//         padding: json ? "16px 18px" : "20px 18px",
//         border: `1px solid #1e293b`,
//         position: "relative",
//         overflow: "hidden",
//       }}>
//         {/* top accent bar */}
//         <div style={{
//           position: "absolute", top: 0, left: 0, right: 0, height: 2,
//           background: `linear-gradient(90deg, ${accentColor}, transparent)`,
//         }} />

//         {json ? (
//           <pre style={{
//             margin: 0,
//             fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//             fontSize: 12.5,
//             lineHeight: 1.8,
//             color: "#e2e8f0",
//             overflowX: "auto",
//             whiteSpace: "pre-wrap",
//             wordBreak: "break-word",
//           }}>
//             <JsonHighlight json={json} />
//           </pre>
//         ) : (
//           <div style={{
//             display: "flex", flexDirection: "column", alignItems: "center",
//             gap: 6, padding: "8px 0",
//           }}>
//             <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#475569" }}>
//               code_off
//             </span>
//             <span style={{
//               fontFamily: "'DM Sans', sans-serif", fontSize: 12,
//               color: "#475569", fontWeight: 500,
//             }}>
//               No state recorded
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function JsonHighlight({ json }: { json: string }) {
//   const tokens = json.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g);
//   return (
//     <>
//       {tokens.map((token, i) => {
//         if (/"[^"]*"\s*:/.test(token)) {
//           const key = token.replace(/\s*:$/, "");
//           return <span key={i}><span style={{ color: "#93c5fd" }}>{key}</span><span style={{ color: "#94a3b8" }}>:</span></span>;
//         } else if (/^"/.test(token)) {
//           return <span key={i} style={{ color: "#86efac" }}>{token}</span>;
//         } else if (/^(true|false)$/.test(token)) {
//           return <span key={i} style={{ color: "#f9a8d4" }}>{token}</span>;
//         } else if (/^null$/.test(token)) {
//           return <span key={i} style={{ color: "#fb923c" }}>{token}</span>;
//         } else if (/^-?\d/.test(token)) {
//           return <span key={i} style={{ color: "#fde68a" }}>{token}</span>;
//         }
//         return <span key={i} style={{ color: "#94a3b8" }}>{token}</span>;
//       })}
//     </>
//   );
// }

// function MetaField({
//   label, value, mono = false, full = false,
// }: {
//   label: string; value: React.ReactNode; mono?: boolean; full?: boolean;
// }) {
//   return (
//     <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
//       <p style={{
//         fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
//         color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase",
//         marginBottom: 5, margin: "0 0 5px",
//       }}>
//         {label}
//       </p>
//       <p style={{
//         fontFamily: mono ? "'JetBrains Mono', 'Fira Code', monospace" : "'DM Sans', sans-serif",
//         fontSize: mono ? 12 : 13.5, fontWeight: mono ? 500 : 600,
//         color: "#111827", margin: 0,
//         wordBreak: "break-all",
//         lineHeight: 1.5,
//       }}>
//         {value ?? <span style={{ color: "#d1d5db", fontStyle: "italic", fontWeight: 400 }}>—</span>}
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────── */
// export default function LogDetailDrawer({
//   isOpen,
//   onClose,
//   log,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   log: AuditLog;
// }) {
//   const action = ACTION_CONFIG[log.action] ?? ACTION_CONFIG.UPDATE;
//   const role   = ROLE_CONFIG[log.userRole]  ?? ROLE_CONFIG.CITIZEN;
//   const ts     = formatTimestamp(log.timestamp ?? log.createdAt);

//   /* Prevent body scroll while open */
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "";
//     return () => { document.body.style.overflow = ""; };
//   }, [isOpen]);

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       {/* Backdrop */}
//       <div
//         aria-hidden="true"
//         style={{
//           position: "fixed", inset: 0,
//           background: "rgba(15, 23, 42, 0.45)",
//           backdropFilter: "blur(4px)",
//           WebkitBackdropFilter: "blur(4px)",
//         }}
//         onClick={onClose}
//       />

//       {/* Drawer container */}
//       <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
//         <DialogPanel
//           transition
//           style={{ pointerEvents: "auto", width: "100%", maxWidth: 480 }}
//           className="
//             h-full bg-white flex flex-col shadow-2xl
//             border-l border-slate-100
//             data-closed:translate-x-full
//             transition-transform duration-300 ease-out
//           "
//         >
//           {/* ── HEADER ── */}
//           <div style={{
//             background: "#111827",
//             padding: "0 28px",
//             flexShrink: 0,
//             position: "relative",
//             overflow: "hidden",
//           }}>
//             {/* Decorative green stripe */}
//             <div style={{
//               position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
//               background: "linear-gradient(180deg, #059669, #34d399)",
//             }} />

//             {/* Subtle grid pattern */}
//             <div style={{
//               position: "absolute", inset: 0, opacity: 0.04,
//               backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
//               backgroundSize: "20px 20px",
//             }} />

//             <div style={{ position: "relative", paddingTop: 24, paddingBottom: 20 }}>
//               {/* Brand + close row */}
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: 8,
//                     background: "linear-gradient(135deg, #059669, #34d399)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     boxShadow: "0 0 12px rgba(5,150,105,0.4)",
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#fff" }}>recycling</span>
//                   </div>
//                   <div>
//                     <div style={{
//                       fontFamily: "'Outfit', sans-serif", fontWeight: 700,
//                       fontSize: 13, color: "#f9fafb", lineHeight: 1.1,
//                     }}>
//                       Smart<span style={{ color: "#34d399" }}>Waste</span>
//                     </div>
//                     <div style={{
//                       fontFamily: "'DM Sans', sans-serif", fontSize: 8,
//                       fontWeight: 600, color: "#6b7280",
//                       letterSpacing: "0.12em", textTransform: "uppercase",
//                     }}>
//                       Audit Trail
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={onClose}
//                   style={{
//                     width: 34, height: 34, borderRadius: 10,
//                     border: "1px solid rgba(255,255,255,0.1)",
//                     background: "rgba(255,255,255,0.06)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     cursor: "pointer", transition: "all 0.2s",
//                     color: "#9ca3af",
//                   }}
//                   onMouseEnter={e => {
//                     (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
//                     (e.currentTarget as HTMLButtonElement).style.color = "#f9fafb";
//                   }}
//                   onMouseLeave={e => {
//                     (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
//                     (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
//                   }}
//                 >
//                   <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
//                 </button>
//               </div>

//               {/* Event title row */}
//               <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
//                 <div style={{
//                   width: 44, height: 44, borderRadius: 12, flexShrink: 0,
//                   background: action.color + "22",
//                   border: `1px solid ${action.color}44`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <span className="material-symbols-outlined" style={{ fontSize: 22, color: action.color }}>
//                     {action.icon}
//                   </span>
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
//                     <span style={{
//                       fontFamily: "'Outfit', sans-serif", fontWeight: 700,
//                       fontSize: 22, color: "#f9fafb", lineHeight: 1,
//                     }}>
//                       {action.label} Event
//                     </span>
//                     {/* Status pill */}
//                     <span style={{
//                       display: "inline-flex", alignItems: "center", gap: 4,
//                       background: log.status === "SUCCESS" ? "rgba(5,150,105,0.18)" : "rgba(220,38,38,0.18)",
//                       border: `1px solid ${log.status === "SUCCESS" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
//                       borderRadius: 20, padding: "3px 10px",
//                     }}>
//                       <span style={{
//                         width: 6, height: 6, borderRadius: "50%",
//                         background: log.status === "SUCCESS" ? "#34d399" : "#f87171",
//                         display: "inline-block",
//                         boxShadow: `0 0 6px ${log.status === "SUCCESS" ? "#34d399" : "#f87171"}`,
//                       }} />
//                       <span style={{
//                         fontFamily: "'DM Sans', sans-serif", fontSize: 11,
//                         fontWeight: 700, color: log.status === "SUCCESS" ? "#34d399" : "#f87171",
//                         letterSpacing: "0.06em",
//                       }}>
//                         {log.status}
//                       </span>
//                     </span>
//                   </div>
//                   <p style={{
//                     fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                     fontSize: 11, color: "#6b7280", margin: 0,
//                     letterSpacing: "0.04em",
//                   }}>
//                     #{log.auditId?.slice(0, 16) ?? "—"}
//                   </p>
//                 </div>
//               </div>

//               {/* Timestamp bar */}
//               <div style={{
//                 marginTop: 18,
//                 background: "rgba(255,255,255,0.05)",
//                 borderRadius: 10,
//                 padding: "10px 14px",
//                 display: "flex", alignItems: "center", gap: 8,
//                 border: "1px solid rgba(255,255,255,0.07)",
//               }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#4b5563" }}>schedule</span>
//                 <span style={{
//                   fontFamily: "'DM Sans', sans-serif", fontSize: 12,
//                   color: "#9ca3af", fontWeight: 500,
//                 }}>
//                   {ts.date}
//                 </span>
//                 <span style={{ color: "#374151", fontSize: 10 }}>·</span>
//                 <span style={{
//                   fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
//                   color: "#d1d5db", fontWeight: 600,
//                 }}>
//                   {ts.time}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ── SCROLLABLE BODY ── */}
//           <div style={{
//             flex: 1, overflowY: "auto", padding: "24px 28px 32px",
//             display: "flex", flexDirection: "column", gap: 24,
//             background: "#f8fafc",
//           }}>

//             {/* ── Section: Actor & Context ── */}
//             <Section title="Actor & Context" icon="person_pin">
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
//                 <MetaField
//                   label="User ID"
//                   value={
//                     <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#9ca3af", verticalAlign: "middle" }}>badge</span>
//                       {log.userId ?? "—"}
//                     </span>
//                   }
//                 />
//                 <MetaField
//                   label="Role"
//                   value={
//                     <span style={{
//                       display: "inline-flex", alignItems: "center",
//                       background: role.bg,
//                       color: role.color,
//                       fontFamily: "'DM Sans', sans-serif",
//                       fontSize: 12, fontWeight: 700,
//                       borderRadius: 6, padding: "3px 10px",
//                       letterSpacing: "0.04em",
//                     }}>
//                       {role.label}
//                     </span>
//                   }
//                 />
//                 <MetaField
//                   label="Action"
//                   value={
//                     <span style={{
//                       display: "inline-flex", alignItems: "center", gap: 5,
//                       background: action.bg, color: action.color,
//                       border: `1px solid ${action.border}`,
//                       fontFamily: "'DM Sans', sans-serif",
//                       fontSize: 12, fontWeight: 700,
//                       borderRadius: 6, padding: "3px 10px",
//                     }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{action.icon}</span>
//                       {action.label}
//                     </span>
//                   }
//                 />
//                 <MetaField
//                   label="Target Type"
//                   value={log.targetType ?? null}
//                 />
//                 <MetaField
//                   label="Target ID"
//                   value={log.targetId}
//                   mono
//                   full={false}
//                 />
//                 <MetaField
//                   label="Request ID"
//                   value={log.requestId}
//                   mono
//                   full={false}
//                 />
//               </div>
//             </Section>

//             {/* ── Section: Network ── */}
//             <Section title="Network Info" icon="wifi">
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
//                 <MetaField label="IP Address" value={log.ipAddress} mono />
//                 <div /> {/* spacer */}
//                 <MetaField
//                   label="User Agent"
//                   value={log.userAgent}
//                   full
//                 />
//               </div>
//             </Section>

//             {/* ── Section: State Changes ── */}
//             {(log.oldValue != null || log.newValue != null) && (
//               <Section title="State Changes" icon="compare_arrows">
//                 <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                   <JsonViewer
//                     value={log.oldValue}
//                     label="Previous State"
//                     icon="history"
//                     accentColor="#d97706"
//                   />
//                   <div style={{
//                     display: "flex", alignItems: "center", gap: 10,
//                     padding: "0 4px",
//                   }}>
//                     <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #e5e7eb)" }} />
//                     <div style={{
//                       width: 28, height: 28, borderRadius: "50%",
//                       background: "#ecfdf5", border: "1px solid #6ee7b7",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       flexShrink: 0,
//                     }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#059669" }}>
//                         arrow_downward
//                       </span>
//                     </div>
//                     <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #e5e7eb, transparent)" }} />
//                   </div>
//                   <JsonViewer
//                     value={log.newValue}
//                     label="New State"
//                     icon="update"
//                     accentColor="#059669"
//                   />
//                 </div>
//               </Section>
//             )}

//             {/* ── Section: Metadata ── */}
//             {log.metadata != null && (
//               <Section title="Metadata" icon="data_object">
//                 <JsonViewer
//                   value={log.metadata}
//                   label="Raw Metadata"
//                   icon="code"
//                   accentColor="#7c3aed"
//                 />
//               </Section>
//             )}
//           </div>

//           {/* ── FOOTER ── */}
//           <div style={{
//             flexShrink: 0,
//             padding: "14px 28px",
//             borderTop: "1px solid #e5e7eb",
//             background: "#fff",
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//           }}>
//             <span style={{
//               fontFamily: "'DM Sans', sans-serif", fontSize: 11,
//               color: "#d1d5db", fontWeight: 500,
//             }}>
//               Created {formatTimestamp(log.createdAt).date}
//             </span>
//             <button
//               onClick={onClose}
//               style={{
//                 display: "flex", alignItems: "center", gap: 6,
//                 background: "#111827", color: "#f9fafb",
//                 border: "none", borderRadius: 10,
//                 padding: "9px 20px", cursor: "pointer",
//                 fontFamily: "'Outfit', sans-serif",
//                 fontSize: 13, fontWeight: 600,
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={e => (e.currentTarget.style.background = "#1f2937")}
//               onMouseLeave={e => (e.currentTarget.style.background = "#111827")}
//             >
//               <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
//               Close
//             </button>
//           </div>
//         </DialogPanel>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

//         [data-headlessui-state~="open"] [data-headlessui-state~="open"] {
//           animation: slideInRight 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
//         }
//         @keyframes slideInRight {
//           from { transform: translateX(100%); opacity: 0.5; }
//           to   { transform: translateX(0);    opacity: 1; }
//         }
//       `}</style>
//     </Dialog>
//   );
// }

// /* ─────────────────────────────────────────────
//    SECTION WRAPPER
// ───────────────────────────────────────────── */
// function Section({
//   title, icon, children,
// }: {
//   title: string; icon: string; children: React.ReactNode;
// }) {
//   return (
//     <div style={{
//       background: "#fff",
//       borderRadius: 16,
//       border: "1px solid #e5e7eb",
//       overflow: "hidden",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//     }}>
//       {/* Section header */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 8,
//         padding: "13px 18px",
//         borderBottom: "1px solid #f3f4f6",
//         background: "#fafafa",
//       }}>
//         <div style={{
//           width: 26, height: 26, borderRadius: 7,
//           background: "#ecfdf5",
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>
//             {icon}
//           </span>
//         </div>
//         <span style={{
//           fontFamily: "'Outfit', sans-serif", fontWeight: 700,
//           fontSize: 12, color: "#374151",
//           letterSpacing: "0.06em", textTransform: "uppercase",
//         }}>
//           {title}
//         </span>
//       </div>

//       {/* Section body */}
//       <div style={{ padding: "18px 18px" }}>
//         {children}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { Dialog, DialogPanel } from "@headlessui/react";

// /* ═══════════════════════════════════════════════
//    TYPES
// ═══════════════════════════════════════════════ */
// interface AuditLog {
//   auditId: string;
//   timestamp: string;
//   userId: number;
//   userRole: "ADMIN" | "WORKER" | "CITIZEN";
//   action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";
//   status: "SUCCESS" | "FAILED";
//   targetType: string;
//   targetId: string | null;
//   oldValue: unknown;
//   newValue: unknown;
//   ipAddress: string | null;
//   userAgent: string | null;
//   requestId: string | null;
//   metadata: unknown;
//   createdAt: string;
// }

// type Tab = "overview" | "changes" | "network";

// /* ═══════════════════════════════════════════════
//    CONFIG MAPS
// ═══════════════════════════════════════════════ */
// const ACTION_CFG = {
//   LOGIN:  { label: "Login",   icon: "login",       hex: "#3b82f6", glow: "rgba(59,130,246,0.25)"  },
//   LOGOUT: { label: "Logout",  icon: "logout",      hex: "#8b5cf6", glow: "rgba(139,92,246,0.25)"  },
//   CREATE: { label: "Create",  icon: "add_circle",  hex: "#059669", glow: "rgba(5,150,105,0.25)"   },
//   UPDATE: { label: "Update",  icon: "edit",        hex: "#f59e0b", glow: "rgba(245,158,11,0.25)"  },
//   DELETE: { label: "Delete",  icon: "delete",      hex: "#ef4444", glow: "rgba(239,68,68,0.25)"   },
// } as const;

// const ROLE_CFG = {
//   ADMIN:   { label: "Admin",   hex: "#8b5cf6", bg: "rgba(139,92,246,0.12)"  },
//   WORKER:  { label: "Worker",  hex: "#059669", bg: "rgba(5,150,105,0.12)"   },
//   CITIZEN: { label: "Citizen", hex: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
// } as const;

// /* ═══════════════════════════════════════════════
//    HELPERS
// ═══════════════════════════════════════════════ */
// function fmt(ts: string | null | undefined) {
//   if (!ts) return { date: "—", time: "—", relative: "—" };
//   const d = new Date(ts);
//   const diff = Date.now() - d.getTime();
//   const mins = Math.floor(diff / 60000);
//   const hrs  = Math.floor(diff / 3600000);
//   const days = Math.floor(diff / 86400000);
//   const relative =
//     mins < 1  ? "just now"
//     : mins < 60 ? `${mins}m ago`
//     : hrs  < 24 ? `${hrs}h ago`
//     : `${days}d ago`;
//   return {
//     date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//     time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
//     relative,
//   };
// }

// function stringify(v: unknown): string | null {
//   if (v === null || v === undefined) return null;
//   if (typeof v === "string") {
//     try { return JSON.stringify(JSON.parse(v), null, 2); } catch { return v; }
//   }
//   return JSON.stringify(v, null, 2);
// }

// /* ═══════════════════════════════════════════════
//    JSON SYNTAX HIGHLIGHTER
// ═══════════════════════════════════════════════ */
// function JsonHighlight({ text }: { text: string }) {
//   const parts = text.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g);
//   return (
//     <>
//       {parts.map((p, i) => {
//         if (/"[^"]*"\s*:/.test(p)) {
//           const key = p.replace(/\s*:$/, "");
//           return <span key={i}><span style={{ color: "#7dd3fc" }}>{key}</span><span style={{ color: "#64748b" }}>:</span></span>;
//         }
//         if (/^"/.test(p))             return <span key={i} style={{ color: "#86efac" }}>{p}</span>;
//         if (/^(true|false)$/.test(p)) return <span key={i} style={{ color: "#f9a8d4" }}>{p}</span>;
//         if (/^null$/.test(p))         return <span key={i} style={{ color: "#fb923c" }}>{p}</span>;
//         if (/^-?\d/.test(p))          return <span key={i} style={{ color: "#fde68a" }}>{p}</span>;
//         return <span key={i} style={{ color: "#475569" }}>{p}</span>;
//       })}
//     </>
//   );
// }

// /* ═══════════════════════════════════════════════
//    JSON PANEL  — always visible, null-safe
// ═══════════════════════════════════════════════ */
// function JsonPanel({ value, label, accentHex }: { value: unknown; label: string; accentHex: string }) {
//   const [copied, setCopied] = useState(false);
//   const text = stringify(value);

//   function copy() {
//     if (!text) return;
//     navigator.clipboard.writeText(text).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   }

//   return (
//     <div>
//       {/* Label row */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
//         <span style={{
//           fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700,
//           color: accentHex, letterSpacing: "0.12em", textTransform: "uppercase",
//           display: "flex", alignItems: "center", gap: 5,
//         }}>
//           <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentHex, display: "inline-block" }} />
//           {label}
//         </span>
//         {text && (
//           <button onClick={copy} style={{
//             display: "flex", alignItems: "center", gap: 4,
//             background: copied ? "rgba(5,150,105,0.15)" : "rgba(255,255,255,0.06)",
//             border: `1px solid ${copied ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
//             borderRadius: 6, padding: "3px 9px", cursor: "pointer",
//             fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
//             color: copied ? "#34d399" : "#64748b", transition: "all 0.2s",
//           }}>
//             <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
//               {copied ? "check" : "content_copy"}
//             </span>
//             {copied ? "Copied!" : "Copy"}
//           </button>
//         )}
//       </div>

//       {/* Code block */}
//       <div style={{
//         background: "#070d18",
//         borderRadius: 12,
//         border: "1px solid rgba(255,255,255,0.07)",
//         overflow: "hidden",
//         position: "relative",
//       }}>
//         <div style={{ height: 2, background: `linear-gradient(90deg, ${accentHex}, transparent 70%)` }} />

//         {/* Traffic lights */}
//         <div style={{ display: "flex", gap: 5, padding: "8px 14px 0", alignItems: "center" }}>
//           {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
//             <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.55 }} />
//           ))}
//         </div>

//         <div style={{ padding: "10px 16px 16px" }}>
//           {text ? (
//             <pre style={{
//               margin: 0,
//               fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//               fontSize: 12, lineHeight: 1.85,
//               color: "#94a3b8",
//               overflowX: "auto",
//               whiteSpace: "pre-wrap", wordBreak: "break-word",
//               maxHeight: 220, overflowY: "auto",
//             }}>
//               <JsonHighlight text={text} />
//             </pre>
//           ) : (
//             <div style={{
//               display: "flex", flexDirection: "column", alignItems: "center",
//               justifyContent: "center", gap: 8, padding: "22px 0",
//             }}>
//               <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#1e293b" }}>data_object</span>
//               <span style={{
//                 fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
//                 color: "#334155", fontWeight: 500,
//               }}>No state recorded</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    FIELD ROW
// ═══════════════════════════════════════════════ */
// function FieldRow({ icon, label, children, last = false }: {
//   icon: string; label: string; children: React.ReactNode; last?: boolean;
// }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start", gap: 14,
//       padding: "14px 0",
//       borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.045)",
//     }}>
//       <div style={{
//         width: 32, height: 32, borderRadius: 9, flexShrink: 0, marginTop: 2,
//         background: "rgba(5,150,105,0.1)",
//         border: "1px solid rgba(5,150,105,0.18)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}>
//         <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#34d399" }}>{icon}</span>
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{
//           margin: "0 0 5px",
//           fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
//           color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase",
//         }}>{label}</p>
//         <div style={{
//           fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
//           color: "#e2e8f0", lineHeight: 1.5, wordBreak: "break-all",
//         }}>{children}</div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    TAB BUTTON
// ═══════════════════════════════════════════════ */
// function TabBtn({ label, icon, active, onClick }: {
//   label: string; icon: string; active: boolean; onClick: () => void;
// }) {
//   return (
//     <button onClick={onClick} style={{
//       flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//       gap: 4, padding: "11px 4px 10px",
//       background: active ? "rgba(5,150,105,0.1)" : "transparent",
//       border: "none",
//       borderBottom: active ? "2px solid #059669" : "2px solid transparent",
//       cursor: "pointer", transition: "all 0.2s",
//     }}>
//       <span className="material-symbols-outlined" style={{
//         fontSize: 18,
//         color: active ? "#34d399" : "#475569",
//         transition: "color 0.2s",
//       }}>{icon}</span>
//       <span style={{
//         fontFamily: "'Outfit', sans-serif", fontSize: 10.5, fontWeight: 700,
//         color: active ? "#d1fae5" : "#475569",
//         letterSpacing: "0.06em", textTransform: "uppercase",
//         transition: "color 0.2s",
//       }}>{label}</span>
//     </button>
//   );
// }

// /* ═══════════════════════════════════════════════
//    SECTION LABEL
// ═══════════════════════════════════════════════ */
// function SectionLabel({ icon, label }: { icon: string; label: string }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
//       <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>{icon}</span>
//       <span style={{
//         fontFamily: "'Outfit', sans-serif", fontWeight: 700,
//         fontSize: 11, color: "#475569",
//         letterSpacing: "0.1em", textTransform: "uppercase",
//       }}>{label}</span>
//       <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)", marginLeft: 4 }} />
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    CARD WRAPPER
// ═══════════════════════════════════════════════ */
// function Card({ children }: { children: React.ReactNode }) {
//   return (
//     <div style={{
//       background: "rgba(255,255,255,0.03)",
//       border: "1px solid rgba(255,255,255,0.07)",
//       borderRadius: 14, padding: "0 16px",
//       overflow: "hidden",
//     }}>
//       {children}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    MAIN DRAWER
// ═══════════════════════════════════════════════ */
// export default function LogDetailDrawer({
//   isOpen, onClose, log,
// }: { isOpen: boolean; onClose: () => void; log: AuditLog }) {
//   const [tab, setTab] = useState<Tab>("overview");

//   const action = ACTION_CFG[log?.action]   ?? ACTION_CFG.UPDATE;
//   const role   = ROLE_CFG[log?.userRole]   ?? ROLE_CFG.CITIZEN;
//   const ts      = fmt(log?.timestamp ?? log?.createdAt);
//   const created = fmt(log?.createdAt);

//   useEffect(() => {
//     if (isOpen) { document.body.style.overflow = "hidden"; setTab("overview"); }
//     else          document.body.style.overflow = "";
//     return ()  => { document.body.style.overflow = ""; };
//   }, [isOpen]);

//   // if (!isOpen && !log) return null;

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">

//       {/* ── Backdrop ── */}
//       <div
//         aria-hidden="true"
//         onClick={onClose}
//         style={{
//           position: "fixed", inset: 0,
//           background: "rgba(2,6,23,0.72)",
//           backdropFilter: "blur(6px)",
//           WebkitBackdropFilter: "blur(6px)",
//         }}
//       />

//       {/* ── Slide panel ── */}
//       <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
//         <DialogPanel
//           transition
//           style={{ pointerEvents: "auto", width: "100%", maxWidth: 500 }}
//           className="h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out data-closed:translate-x-full"
//         >
//           <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0c1322" }}>

//             {/* ══════════ HEADER ══════════ */}
//             <div style={{ flexShrink: 0, position: "relative", overflow: "hidden" }}>
//               {/* Mesh gradient */}
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: `
//                   radial-gradient(ellipse 60% 80% at 80% -20%, ${action.glow}, transparent),
//                   radial-gradient(ellipse 40% 60% at -10% 110%, rgba(5,150,105,0.15), transparent),
//                   #0c1322
//                 `,
//               }} />
//               {/* Grid texture */}
//               <div style={{
//                 position: "absolute", inset: 0, opacity: 0.025,
//                 backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
//                                   linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
//                 backgroundSize: "28px 28px",
//               }} />

//               <div style={{ position: "relative", padding: "22px 24px 20px" }}>

//                 {/* Top bar: brand + close */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//                     <div style={{
//                       width: 32, height: 32, borderRadius: 9,
//                       background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       boxShadow: "0 0 16px rgba(5,150,105,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
//                     }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#fff" }}>recycling</span>
//                     </div>
//                     <div>
//                       <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 14, color: "#f1f5f9", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
//                         Smart<span style={{ color: "#34d399" }}>Waste</span>
//                       </div>
//                       <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase" }}>
//                         Audit Trail
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={onClose}
//                     style={{
//                       width: 36, height: 36, borderRadius: 10,
//                       border: "1px solid rgba(255,255,255,0.08)",
//                       background: "rgba(255,255,255,0.04)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       cursor: "pointer", color: "#475569", transition: "all 0.2s",
//                     }}
//                     onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#e2e8f0"; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#475569"; }}
//                   >
//                     <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
//                   </button>
//                 </div>

//                 {/* Event hero */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
//                   <div style={{
//                     width: 58, height: 58, borderRadius: 16, flexShrink: 0,
//                     background: `radial-gradient(circle at 30% 30%, ${action.hex}33, ${action.hex}11)`,
//                     border: `1.5px solid ${action.hex}44`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     boxShadow: `0 0 28px ${action.glow}`,
//                     position: "relative",
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: 28, color: action.hex }}>{action.icon}</span>
//                     {log.status === "SUCCESS" && (
//                       <span style={{
//                         position: "absolute", top: -4, right: -4,
//                         width: 13, height: 13, borderRadius: "50%",
//                         background: "#059669",
//                         boxShadow: "0 0 0 3px #0c1322, 0 0 10px #059669",
//                       }} />
//                     )}
//                   </div>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
//                       <h2 style={{
//                         margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800,
//                         fontSize: 24, color: "#f8fafc", letterSpacing: "-0.02em", lineHeight: 1,
//                       }}>
//                         {action.label}
//                       </h2>
//                       <span style={{
//                         display: "inline-flex", alignItems: "center", gap: 5,
//                         padding: "4px 10px", borderRadius: 20,
//                         background: log.status === "SUCCESS" ? "rgba(5,150,105,0.15)" : "rgba(239,68,68,0.15)",
//                         border: `1px solid ${log.status === "SUCCESS" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
//                       }}>
//                         <span style={{
//                           width: 6, height: 6, borderRadius: "50%",
//                           background: log.status === "SUCCESS" ? "#34d399" : "#f87171",
//                           display: "inline-block",
//                         }} />
//                         <span style={{
//                           fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
//                           color: log.status === "SUCCESS" ? "#34d399" : "#f87171",
//                           letterSpacing: "0.08em",
//                         }}>{log.status}</span>
//                       </span>
//                     </div>

//                     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//                       <span style={{
//                         display: "inline-flex", alignItems: "center", gap: 5,
//                         padding: "3px 9px", borderRadius: 6,
//                         background: role.bg, border: `1px solid ${role.hex}30`,
//                         fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
//                         color: role.hex,
//                       }}>
//                         <span className="material-symbols-outlined" style={{ fontSize: 11 }}>shield</span>
//                         {role.label}
//                       </span>
//                       {log.targetType && (
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 4,
//                           padding: "3px 9px", borderRadius: 6,
//                           background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#64748b",
//                         }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 11 }}>database</span>
//                           {log.targetType}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Timestamp + ID strip */}
//                 <div style={{
//                   background: "rgba(0,0,0,0.3)", borderRadius: 10,
//                   border: "1px solid rgba(255,255,255,0.06)",
//                   padding: "10px 14px",
//                   display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
//                 }}>
//                   <div>
//                     <p style={{ margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Timestamp</p>
//                     <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#94a3b8", fontWeight: 500 }}>
//                       {ts.date} · {ts.time}
//                     </p>
//                   </div>
//                   <div>
//                     <p style={{ margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Audit ID</p>
//                     <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#94a3b8", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                       #{log.auditId?.slice(0, 20) ?? "—"}
//                     </p>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* ══════════ TABS ══════════ */}
//             <div style={{
//               flexShrink: 0, display: "flex",
//               background: "#0a1020",
//               borderBottom: "1px solid rgba(255,255,255,0.06)",
//             }}>
//               {([
//                 { id: "overview" as Tab, label: "Overview", icon: "info"            },
//                 { id: "changes"  as Tab, label: "Changes",  icon: "compare_arrows"  },
//                 { id: "network"  as Tab, label: "Network",  icon: "router"          },
//               ]).map(t => (
//                 <TabBtn key={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={() => setTab(t.id)} />
//               ))}
//             </div>

//             {/* ══════════ SCROLLABLE BODY ══════════ */}
//             <div style={{ flex: 1, overflowY: "auto", padding: "22px 22px 36px", background: "#0c1322" }}>

//               {/* ── TAB: OVERVIEW ── */}
//               {tab === "overview" && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

//                   <div>
//                     <SectionLabel icon="person" label="Actor" />
//                     <Card>
//                       <FieldRow icon="badge" label="User ID">
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
//                           {log.userId ?? "—"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="shield" label="Role">
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 5,
//                           padding: "3px 10px", borderRadius: 6,
//                           background: role.bg, border: `1px solid ${role.hex}30`,
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: role.hex,
//                         }}>{role.label}</span>
//                       </FieldRow>
//                       <FieldRow icon="bolt" label="Action">
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 6,
//                           padding: "3px 10px", borderRadius: 6,
//                           background: `${action.hex}18`, border: `1px solid ${action.hex}33`,
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: action.hex,
//                         }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{action.icon}</span>
//                           {action.label}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="fact_check" label="Status" last>
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 6,
//                           padding: "3px 10px", borderRadius: 6,
//                           background: log.status === "SUCCESS" ? "rgba(5,150,105,0.15)" : "rgba(239,68,68,0.15)",
//                           border: `1px solid ${log.status === "SUCCESS" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
//                           color: log.status === "SUCCESS" ? "#34d399" : "#f87171",
//                         }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
//                             {log.status === "SUCCESS" ? "check_circle" : "cancel"}
//                           </span>
//                           {log.status}
//                         </span>
//                       </FieldRow>
//                     </Card>
//                   </div>

//                   <div>
//                     <SectionLabel icon="my_location" label="Target" />
//                     <Card>
//                       <FieldRow icon="database" label="Target Type">
//                         <span style={{ color: log.targetType ? "#e2e8f0" : "#334155", fontStyle: log.targetType ? "normal" : "italic", fontSize: 13 }}>
//                           {log.targetType || "Not specified"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="tag" label="Target ID">
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: log.targetId ? "#94a3b8" : "#334155", fontStyle: log.targetId ? "normal" : "italic" }}>
//                           {log.targetId || "None"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="confirmation_number" label="Request ID" last>
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: log.requestId ? "#94a3b8" : "#334155", fontStyle: log.requestId ? "normal" : "italic", wordBreak: "break-all" }}>
//                           {log.requestId || "None"}
//                         </span>
//                       </FieldRow>
//                     </Card>
//                   </div>

//                   {/* Metadata — always shown */}
//                   <div>
//                     <SectionLabel icon="data_object" label="Metadata" />
//                     <JsonPanel value={log.metadata} label="Raw Metadata" accentHex="#8b5cf6" />
//                   </div>

//                 </div>
//               )}

//               {/* ── TAB: CHANGES ── */}
//               {tab === "changes" && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//                   <div style={{
//                     background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)",
//                     borderRadius: 10, padding: "12px 14px",
//                     display: "flex", alignItems: "flex-start", gap: 10,
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#f59e0b", flexShrink: 0, marginTop: 1 }}>info</span>
//                     <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#92400e", fontWeight: 500, lineHeight: 1.6 }}>
//                       State snapshot captured at the moment of the{" "}
//                       <strong style={{ color: "#f59e0b" }}>{action.label}</strong> event.
//                     </p>
//                   </div>

//                   {/* Previous state — always shown */}
//                   <JsonPanel value={log.oldValue} label="Previous State" accentHex="#f59e0b" />

//                   {/* Arrow divider */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06))" }} />
//                     <div style={{
//                       display: "flex", alignItems: "center", gap: 6,
//                       padding: "5px 14px", borderRadius: 20,
//                       background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.22)",
//                     }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>south</span>
//                       <span style={{
//                         fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700,
//                         color: "#059669", letterSpacing: "0.06em", textTransform: "uppercase",
//                       }}>Transformed To</span>
//                     </div>
//                     <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
//                   </div>

//                   {/* New state — always shown */}
//                   <JsonPanel value={log.newValue} label="New State" accentHex="#059669" />

//                 </div>
//               )}

//               {/* ── TAB: NETWORK ── */}
//               {tab === "network" && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

//                   <div>
//                     <SectionLabel icon="router" label="Connection" />
//                     <Card>
//                       <FieldRow icon="language" label="IP Address">
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: log.ipAddress ? "#7dd3fc" : "#334155", fontStyle: log.ipAddress ? "normal" : "italic" }}>
//                           {log.ipAddress || "Not captured"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="schedule" label="Occurred" last>
//                         <div>
//                           <div style={{ color: "#e2e8f0", fontSize: 13 }}>{ts.date}</div>
//                           <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#64748b", marginTop: 3 }}>
//                             {ts.time} · <span style={{ color: "#34d399" }}>{ts.relative}</span>
//                           </div>
//                         </div>
//                       </FieldRow>
//                     </Card>
//                   </div>

//                   <div>
//                     <SectionLabel icon="devices" label="Client" />
//                     <div style={{
//                       background: "rgba(255,255,255,0.03)",
//                       border: "1px solid rgba(255,255,255,0.07)",
//                       borderRadius: 14, padding: "16px",
//                     }}>
//                       {log.userAgent ? (
//                         <div style={{
//                           fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
//                           color: "#64748b", lineHeight: 1.8, wordBreak: "break-all",
//                         }}>
//                           {log.userAgent}
//                         </div>
//                       ) : (
//                         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 0" }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#1e293b" }}>devices_other</span>
//                           <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#334155", fontWeight: 500 }}>
//                             No user agent recorded
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                 </div>
//               )}

//             </div>

//             {/* ══════════ FOOTER ══════════ */}
//             <div style={{
//               flexShrink: 0, padding: "12px 22px",
//               borderTop: "1px solid rgba(255,255,255,0.06)",
//               background: "#080e1a",
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#334155" }}>history</span>
//                 <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#334155", fontWeight: 500 }}>
//                   Logged {created.relative}
//                 </span>
//               </div>
//               <button
//                 onClick={onClose}
//                 style={{
//                   display: "inline-flex", alignItems: "center", gap: 6,
//                   padding: "8px 18px", borderRadius: 10,
//                   background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
//                   cursor: "pointer", fontFamily: "'Outfit', sans-serif",
//                   fontSize: 12.5, fontWeight: 700, color: "#94a3b8", transition: "all 0.2s",
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f1f5f9"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
//               >
//                 <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
//                 Dismiss
//               </button>
//             </div>

//           </div>
//         </DialogPanel>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
//         [data-headlessui-state~="open"] { animation: swDrawer 0.32s cubic-bezier(0.22,1,0.36,1) both; }
//         @keyframes swDrawer { from { transform:translateX(100%); opacity:0.6; } to { transform:translateX(0); opacity:1; } }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
//         ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
//       `}</style>
//     </Dialog>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { Dialog, DialogPanel } from "@headlessui/react";

// /* ═══════════════════════════════════════════════
//    TYPES
// ═══════════════════════════════════════════════ */
// interface AuditLog {
//   auditId: string;
//   timestamp: string;
//   userId: number;
//   userRole: "ADMIN" | "WORKER" | "CITIZEN";
//   action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";
//   status: "SUCCESS" | "FAILED";
//   targetType: string;
//   targetId: string | null;
//   oldValue: unknown;
//   newValue: unknown;
//   ipAddress: string | null;
//   userAgent: string | null;
//   requestId: string | null;
//   metadata: unknown;
//   createdAt: string;
// }

// type Tab = "overview" | "changes" | "network";

// /* ═══════════════════════════════════════════════
//    CONFIG MAPS
// ═══════════════════════════════════════════════ */
// const ACTION_CFG = {
//   LOGIN:  { label: "Login",   icon: "login",       hex: "#3b82f6", glow: "rgba(59,130,246,0.25)"  },
//   LOGOUT: { label: "Logout",  icon: "logout",      hex: "#8b5cf6", glow: "rgba(139,92,246,0.25)"  },
//   CREATE: { label: "Create",  icon: "add_circle",  hex: "#059669", glow: "rgba(5,150,105,0.25)"   },
//   UPDATE: { label: "Update",  icon: "edit",        hex: "#f59e0b", glow: "rgba(245,158,11,0.25)"  },
//   DELETE: { label: "Delete",  icon: "delete",      hex: "#ef4444", glow: "rgba(239,68,68,0.25)"   },
// } as const;

// const ROLE_CFG = {
//   ADMIN:   { label: "Admin",   hex: "#8b5cf6", bg: "rgba(139,92,246,0.12)"  },
//   WORKER:  { label: "Worker",  hex: "#059669", bg: "rgba(5,150,105,0.12)"   },
//   CITIZEN: { label: "Citizen", hex: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
// } as const;

// /* ═══════════════════════════════════════════════
//    HELPERS
// ═══════════════════════════════════════════════ */
// function fmt(ts: string | null | undefined) {
//   if (!ts) return { date: "—", time: "—", relative: "—" };
//   const d = new Date(ts);
//   const diff = Date.now() - d.getTime();
//   const mins = Math.floor(diff / 60000);
//   const hrs  = Math.floor(diff / 3600000);
//   const days = Math.floor(diff / 86400000);
//   const relative =
//     mins < 1  ? "just now"
//     : mins < 60 ? `${mins}m ago`
//     : hrs  < 24 ? `${hrs}h ago`
//     : `${days}d ago`;
//   return {
//     date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//     time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
//     relative,
//   };
// }

// function stringify(v: unknown): string | null {
//   if (v === null || v === undefined) return null;
//   if (typeof v === "string") {
//     try { return JSON.stringify(JSON.parse(v), null, 2); } catch { return v; }
//   }
//   return JSON.stringify(v, null, 2);
// }

// /* ═══════════════════════════════════════════════
//    JSON SYNTAX HIGHLIGHTER
// ═══════════════════════════════════════════════ */
// function JsonHighlight({ text }: { text: string }) {
//   const parts = text.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g);
//   return (
//     <>
//       {parts.map((p, i) => {
//         if (/"[^"]*"\s*:/.test(p)) {
//           const key = p.replace(/\s*:$/, "");
//           return <span key={i}><span style={{ color: "#7dd3fc" }}>{key}</span><span style={{ color: "#64748b" }}>:</span></span>;
//         }
//         if (/^"/.test(p))             return <span key={i} style={{ color: "#86efac" }}>{p}</span>;
//         if (/^(true|false)$/.test(p)) return <span key={i} style={{ color: "#f9a8d4" }}>{p}</span>;
//         if (/^null$/.test(p))         return <span key={i} style={{ color: "#fb923c" }}>{p}</span>;
//         if (/^-?\d/.test(p))          return <span key={i} style={{ color: "#fde68a" }}>{p}</span>;
//         return <span key={i} style={{ color: "#475569" }}>{p}</span>;
//       })}
//     </>
//   );
// }

// /* ═══════════════════════════════════════════════
//    JSON PANEL
// ═══════════════════════════════════════════════ */
// function JsonPanel({ value, label, accentHex }: { value: unknown; label: string; accentHex: string }) {
//   const [copied, setCopied] = useState(false);
//   const text = stringify(value);

//   function copy() {
//     if (!text) return;
//     navigator.clipboard.writeText(text).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   }

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
//         <span style={{
//           fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700,
//           color: accentHex, letterSpacing: "0.12em", textTransform: "uppercase",
//           display: "flex", alignItems: "center", gap: 5,
//         }}>
//           <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentHex, display: "inline-block" }} />
//           {label}
//         </span>
//         {text && (
//           <button onClick={copy} style={{
//             display: "flex", alignItems: "center", gap: 4,
//             background: copied ? "rgba(5,150,105,0.15)" : "rgba(255,255,255,0.06)",
//             border: `1px solid ${copied ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
//             borderRadius: 6, padding: "3px 9px", cursor: "pointer",
//             fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
//             color: copied ? "#34d399" : "#64748b", transition: "all 0.2s",
//           }}>
//             <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
//               {copied ? "check" : "content_copy"}
//             </span>
//             {copied ? "Copied!" : "Copy"}
//           </button>
//         )}
//       </div>

//       <div style={{
//         background: "#070d18",
//         borderRadius: 12,
//         border: "1px solid rgba(255,255,255,0.07)",
//         overflow: "hidden",
//         position: "relative",
//       }}>
//         <div style={{ height: 2, background: `linear-gradient(90deg, ${accentHex}, transparent 70%)` }} />
//         <div style={{ display: "flex", gap: 5, padding: "8px 14px 0", alignItems: "center" }}>
//           {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
//             <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.55 }} />
//           ))}
//         </div>
//         <div style={{ padding: "10px 16px 16px" }}>
//           {text ? (
//             <pre style={{
//               margin: 0,
//               fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//               fontSize: 12, lineHeight: 1.85,
//               color: "#94a3b8",
//               overflowX: "auto",
//               whiteSpace: "pre-wrap", wordBreak: "break-word",
//               maxHeight: 220, overflowY: "auto",
//             }}>
//               <JsonHighlight text={text} />
//             </pre>
//           ) : (
//             <div style={{
//               display: "flex", flexDirection: "column", alignItems: "center",
//               justifyContent: "center", gap: 8, padding: "22px 0",
//             }}>
//               <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#1e293b" }}>data_object</span>
//               <span style={{
//                 fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
//                 color: "#334155", fontWeight: 500,
//               }}>No state recorded</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    FIELD ROW
// ═══════════════════════════════════════════════ */
// function FieldRow({ icon, label, children, last = false }: {
//   icon: string; label: string; children: React.ReactNode; last?: boolean;
// }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start", gap: 14,
//       padding: "14px 0",
//       borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.045)",
//     }}>
//       <div style={{
//         width: 32, height: 32, borderRadius: 9, flexShrink: 0, marginTop: 2,
//         background: "rgba(5,150,105,0.1)",
//         border: "1px solid rgba(5,150,105,0.18)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}>
//         <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#34d399" }}>{icon}</span>
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{
//           margin: "0 0 5px",
//           fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
//           color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase",
//         }}>{label}</p>
//         <div style={{
//           fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
//           color: "#e2e8f0", lineHeight: 1.5, wordBreak: "break-all",
//         }}>{children}</div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    TAB BUTTON
// ═══════════════════════════════════════════════ */
// function TabBtn({ label, icon, active, onClick }: {
//   label: string; icon: string; active: boolean; onClick: () => void;
// }) {
//   return (
//     <button onClick={onClick} style={{
//       flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//       gap: 4, padding: "11px 4px 10px",
//       background: active ? "rgba(5,150,105,0.1)" : "transparent",
//       border: "none",
//       borderBottom: active ? "2px solid #059669" : "2px solid transparent",
//       cursor: "pointer", transition: "all 0.2s",
//     }}>
//       <span className="material-symbols-outlined" style={{
//         fontSize: 18,
//         color: active ? "#34d399" : "#475569",
//         transition: "color 0.2s",
//       }}>{icon}</span>
//       <span style={{
//         fontFamily: "'Outfit', sans-serif", fontSize: 10.5, fontWeight: 700,
//         color: active ? "#d1fae5" : "#475569",
//         letterSpacing: "0.06em", textTransform: "uppercase",
//         transition: "color 0.2s",
//       }}>{label}</span>
//     </button>
//   );
// }

// /* ═══════════════════════════════════════════════
//    SECTION LABEL
// ═══════════════════════════════════════════════ */
// function SectionLabel({ icon, label }: { icon: string; label: string }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
//       <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>{icon}</span>
//       <span style={{
//         fontFamily: "'Outfit', sans-serif", fontWeight: 700,
//         fontSize: 11, color: "#475569",
//         letterSpacing: "0.1em", textTransform: "uppercase",
//       }}>{label}</span>
//       <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)", marginLeft: 4 }} />
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    CARD WRAPPER
// ═══════════════════════════════════════════════ */
// function Card({ children }: { children: React.ReactNode }) {
//   return (
//     <div style={{
//       background: "rgba(255,255,255,0.03)",
//       border: "1px solid rgba(255,255,255,0.07)",
//       borderRadius: 14, padding: "0 16px",
//       overflow: "hidden",
//     }}>
//       {children}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    MAIN DRAWER
// ═══════════════════════════════════════════════ */
// export default function LogDetailDrawer({
//   isOpen,
//   onClose,
//   log,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   log: AuditLog | null;
// }) {
//   const [tab, setTab] = useState<Tab>("overview");

//   useEffect(() => {
//     if (isOpen) {
//       const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
//       document.body.style.paddingRight = `${scrollbarWidth}px`;
//       document.body.style.overflow = "hidden";
//       setTab("overview");
//     } else {
//       document.body.style.paddingRight = "";
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.paddingRight = "";
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   // Guard: if no log is selected yet, render nothing visible.
//   // The Dialog itself stays mounted so HeadlessUI can manage its own
//   // open/close state and run the exit animation cleanly.
//   const action = ACTION_CFG[log?.action as keyof typeof ACTION_CFG] ?? ACTION_CFG.UPDATE;
//   const role   = ROLE_CFG[log?.userRole as keyof typeof ROLE_CFG]   ?? ROLE_CFG.CITIZEN;
//   const ts      = fmt(log?.timestamp ?? log?.createdAt);
//   const created = fmt(log?.createdAt);

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">

//       {/* ── Backdrop ── */}
//       <div
//         aria-hidden="true"
//         onClick={onClose}
//         style={{
//           position: "fixed", inset: 0,
//           background: "rgba(2,6,23,0.72)",
//           backdropFilter: "blur(6px)",
//           WebkitBackdropFilter: "blur(6px)",
//         }}
//       />
//       <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
//         <DialogPanel
//           transition
//           style={{ pointerEvents: "auto", width: "100%", maxWidth: 500 }}
//           className="h-full  flex flex-col shadow-2xl transition-transform duration-300 ease-out data-[closed]:translate-x-full"
//         >
//           <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0c1322" }}>


//             <div style={{ flexShrink: 0, position: "relative", overflow: "hidden" }}>
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: `
//                   radial-gradient(ellipse 60% 80% at 80% -20%, ${action.glow}, transparent),
//                   radial-gradient(ellipse 40% 60% at -10% 110%, rgba(5,150,105,0.15), transparent),
//                   #0c1322
//                 `,
//               }} />
//               {/* Grid texture */}
//               <div style={{
//                 position: "absolute", inset: 0, opacity: 0.025,
//                 backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
//                                   linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
//                 backgroundSize: "28px 28px",
//               }} />

//               <div style={{ position: "relative", padding: "22px 24px 20px" }}>

//                 {/* Top bar: brand + close */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//                     <div style={{
//                       width: 32, height: 32, borderRadius: 9,
//                       background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       boxShadow: "0 0 16px rgba(5,150,105,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
//                     }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#fff" }}>recycling</span>
//                     </div>
//                     <div>
//                       <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 14, color: "#f1f5f9", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
//                         Smart<span style={{ color: "#34d399" }}>Waste</span>
//                       </div>
//                       <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase" }}>
//                         Audit Trail
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={onClose}
//                     style={{
//                       width: 36, height: 36, borderRadius: 10,
//                       border: "1px solid rgba(255,255,255,0.08)",
//                       background: "rgba(255,255,255,0.04)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       cursor: "pointer", color: "#475569", transition: "all 0.2s",
//                     }}
//                     onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#e2e8f0"; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#475569"; }}
//                   >
//                     <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
//                   </button>
//                 </div>

//                 {/* Event hero */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
//                   <div style={{
//                     width: 58, height: 58, borderRadius: 16, flexShrink: 0,
//                     background: `radial-gradient(circle at 30% 30%, ${action.hex}33, ${action.hex}11)`,
//                     border: `1.5px solid ${action.hex}44`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     boxShadow: `0 0 28px ${action.glow}`,
//                     position: "relative",
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: 28, color: action.hex }}>{action.icon}</span>
//                     {log?.status === "SUCCESS" && (
//                       <span style={{
//                         position: "absolute", top: -4, right: -4,
//                         width: 13, height: 13, borderRadius: "50%",
//                         background: "#059669",
//                         boxShadow: "0 0 0 3px #0c1322, 0 0 10px #059669",
//                       }} />
//                     )}
//                   </div>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
//                       <h2 style={{
//                         margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800,
//                         fontSize: 24, color: "#f8fafc", letterSpacing: "-0.02em", lineHeight: 1,
//                       }}>
//                         {action.label}
//                       </h2>
//                       <span style={{
//                         display: "inline-flex", alignItems: "center", gap: 5,
//                         padding: "4px 10px", borderRadius: 20,
//                         background: log?.status === "SUCCESS" ? "rgba(5,150,105,0.15)" : "rgba(239,68,68,0.15)",
//                         border: `1px solid ${log?.status === "SUCCESS" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
//                       }}>
//                         <span style={{
//                           width: 6, height: 6, borderRadius: "50%",
//                           background: log?.status === "SUCCESS" ? "#34d399" : "#f87171",
//                           display: "inline-block",
//                         }} />
//                         <span style={{
//                           fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
//                           color: log?.status === "SUCCESS" ? "#34d399" : "#f87171",
//                           letterSpacing: "0.08em",
//                         }}>{log?.status ?? "—"}</span>
//                       </span>
//                     </div>

//                     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//                       <span style={{
//                         display: "inline-flex", alignItems: "center", gap: 5,
//                         padding: "3px 9px", borderRadius: 6,
//                         background: role.bg, border: `1px solid ${role.hex}30`,
//                         fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
//                         color: role.hex,
//                       }}>
//                         <span className="material-symbols-outlined" style={{ fontSize: 11 }}>shield</span>
//                         {role.label}
//                       </span>
//                       {log?.targetType && (
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 4,
//                           padding: "3px 9px", borderRadius: 6,
//                           background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#64748b",
//                         }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 11 }}>database</span>
//                           {log.targetType}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Timestamp + ID strip */}
//                 <div style={{
//                   background: "rgba(0,0,0,0.3)", borderRadius: 10,
//                   border: "1px solid rgba(255,255,255,0.06)",
//                   padding: "10px 14px",
//                   display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
//                 }}>
//                   <div>
//                     <p style={{ margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Timestamp</p>
//                     <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#94a3b8", fontWeight: 500 }}>
//                       {ts.date} · {ts.time}
//                     </p>
//                   </div>
//                   <div>
//                     <p style={{ margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Audit ID</p>
//                     <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#94a3b8", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                       #{log?.auditId?.slice(0, 20) ?? "—"}
//                     </p>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* ══════════ TABS ══════════ */}
//             <div style={{
//               flexShrink: 0, display: "flex",
//               background: "#0a1020",
//               borderBottom: "1px solid rgba(255,255,255,0.06)",
//             }}>
//               {([
//                 { id: "overview" as Tab, label: "Overview", icon: "info"           },
//                 { id: "changes"  as Tab, label: "Changes",  icon: "compare_arrows" },
//                 { id: "network"  as Tab, label: "Network",  icon: "router"         },
//               ]).map(t => (
//                 <TabBtn key={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={() => setTab(t.id)} />
//               ))}
//             </div>

//             {/* ══════════ SCROLLABLE BODY ══════════ */}
//             <div style={{ flex: 1, overflowY: "auto", padding: "22px 22px 36px", background: "#0c1322" }}>

//               {/* ── TAB: OVERVIEW ── */}
//               {tab === "overview" && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

//                   <div>
//                     <SectionLabel icon="person" label="Actor" />
//                     <Card>
//                       <FieldRow icon="badge" label="User ID">
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
//                           {log?.userId ?? "—"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="shield" label="Role">
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 5,
//                           padding: "3px 10px", borderRadius: 6,
//                           background: role.bg, border: `1px solid ${role.hex}30`,
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: role.hex,
//                         }}>{role.label}</span>
//                       </FieldRow>
//                       <FieldRow icon="bolt" label="Action">
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 6,
//                           padding: "3px 10px", borderRadius: 6,
//                           background: `${action.hex}18`, border: `1px solid ${action.hex}33`,
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: action.hex,
//                         }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{action.icon}</span>
//                           {action.label}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="fact_check" label="Status" last>
//                         <span style={{
//                           display: "inline-flex", alignItems: "center", gap: 6,
//                           padding: "3px 10px", borderRadius: 6,
//                           background: log?.status === "SUCCESS" ? "rgba(5,150,105,0.15)" : "rgba(239,68,68,0.15)",
//                           border: `1px solid ${log?.status === "SUCCESS" ? "rgba(52,211,153,0.3)" : "rgba(252,165,165,0.3)"}`,
//                           fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
//                           color: log?.status === "SUCCESS" ? "#34d399" : "#f87171",
//                         }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
//                             {log?.status === "SUCCESS" ? "check_circle" : "cancel"}
//                           </span>
//                           {log?.status ?? "—"}
//                         </span>
//                       </FieldRow>
//                     </Card>
//                   </div>

//                   <div>
//                     <SectionLabel icon="my_location" label="Target" />
//                     <Card>
//                       <FieldRow icon="database" label="Target Type">
//                         <span style={{ color: log?.targetType ? "#e2e8f0" : "#334155", fontStyle: log?.targetType ? "normal" : "italic", fontSize: 13 }}>
//                           {log?.targetType || "Not specified"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="tag" label="Target ID">
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: log?.targetId ? "#94a3b8" : "#334155", fontStyle: log?.targetId ? "normal" : "italic" }}>
//                           {log?.targetId || "None"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="confirmation_number" label="Request ID" last>
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: log?.requestId ? "#94a3b8" : "#334155", fontStyle: log?.requestId ? "normal" : "italic", wordBreak: "break-all" }}>
//                           {log?.requestId || "None"}
//                         </span>
//                       </FieldRow>
//                     </Card>
//                   </div>

//                   <div>
//                     <SectionLabel icon="data_object" label="Metadata" />
//                     <JsonPanel value={log?.metadata} label="Raw Metadata" accentHex="#8b5cf6" />
//                   </div>

//                 </div>
//               )}

//               {/* ── TAB: CHANGES ── */}
//               {tab === "changes" && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//                   <div style={{
//                     background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)",
//                     borderRadius: 10, padding: "12px 14px",
//                     display: "flex", alignItems: "flex-start", gap: 10,
//                   }}>
//                     <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#f59e0b", flexShrink: 0, marginTop: 1 }}>info</span>
//                     <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#92400e", fontWeight: 500, lineHeight: 1.6 }}>
//                       State snapshot captured at the moment of the{" "}
//                       <strong style={{ color: "#f59e0b" }}>{action.label}</strong> event.
//                     </p>
//                   </div>

//                   <JsonPanel value={log?.oldValue} label="Previous State" accentHex="#f59e0b" />

//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06))" }} />
//                     <div style={{
//                       display: "flex", alignItems: "center", gap: 6,
//                       padding: "5px 14px", borderRadius: 20,
//                       background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.22)",
//                     }}>
//                       <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#059669" }}>south</span>
//                       <span style={{
//                         fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 700,
//                         color: "#059669", letterSpacing: "0.06em", textTransform: "uppercase",
//                       }}>Transformed To</span>
//                     </div>
//                     <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
//                   </div>

//                   <JsonPanel value={log?.newValue} label="New State" accentHex="#059669" />

//                 </div>
//               )}

//               {/* ── TAB: NETWORK ── */}
//               {tab === "network" && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

//                   <div>
//                     <SectionLabel icon="router" label="Connection" />
//                     <Card>
//                       <FieldRow icon="language" label="IP Address">
//                         <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: log?.ipAddress ? "#7dd3fc" : "#334155", fontStyle: log?.ipAddress ? "normal" : "italic" }}>
//                           {log?.ipAddress || "Not captured"}
//                         </span>
//                       </FieldRow>
//                       <FieldRow icon="schedule" label="Occurred" last>
//                         <div>
//                           <div style={{ color: "#e2e8f0", fontSize: 13 }}>{ts.date}</div>
//                           <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#64748b", marginTop: 3 }}>
//                             {ts.time} · <span style={{ color: "#34d399" }}>{ts.relative}</span>
//                           </div>
//                         </div>
//                       </FieldRow>
//                     </Card>
//                   </div>

//                   <div>
//                     <SectionLabel icon="devices" label="Client" />
//                     <div style={{
//                       background: "rgba(255,255,255,0.03)",
//                       border: "1px solid rgba(255,255,255,0.07)",
//                       borderRadius: 14, padding: "16px",
//                     }}>
//                       {log?.userAgent ? (
//                         <div style={{
//                           fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
//                           color: "#64748b", lineHeight: 1.8, wordBreak: "break-all",
//                         }}>
//                           {log.userAgent}
//                         </div>
//                       ) : (
//                         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "20px 0" }}>
//                           <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#1e293b" }}>devices_other</span>
//                           <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#334155", fontWeight: 500 }}>
//                             No user agent recorded
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                 </div>
//               )}

//             </div>

//             {/* ══════════ FOOTER ══════════ */}
//             <div style={{
//               flexShrink: 0, padding: "12px 22px",
//               borderTop: "1px solid rgba(255,255,255,0.06)",
//               background: "#080e1a",
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#334155" }}>history</span>
//                 <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#334155", fontWeight: 500 }}>
//                   Logged {created.relative}
//                 </span>
//               </div>
//               <button
//                 onClick={onClose}
//                 style={{
//                   display: "inline-flex", alignItems: "center", gap: 6,
//                   padding: "8px 18px", borderRadius: 10,
//                   background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
//                   cursor: "pointer", fontFamily: "'Outfit', sans-serif",
//                   fontSize: 12.5, fontWeight: 700, color: "#94a3b8", transition: "all 0.2s",
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f1f5f9"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
//               >
//                 <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
//                 Dismiss
//               </button>
//             </div>

//           </div>
//         </DialogPanel>
//       </div>

//       {/*
//         FIX: Removed @keyframes swDrawer and the [data-headlessui-state~="open"] rule.
//         They were conflicting with the Tailwind transition-transform + data-[closed]:
//         approach on DialogPanel. HeadlessUI's `transition` prop combined with
//         data-[closed]:translate-x-full handles the slide animation entirely.
//         Only font imports and custom scrollbar styles are kept below.
//       */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
//         ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
//       `}</style>
//     </Dialog>
//   );
// }

import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   CONFIG MAPS — mirrors AuditLogs page palette
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   JSON SYNTAX HIGHLIGHTER — light mode colours
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   JSON PANEL — light card
═══════════════════════════════════════════════ */
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
        {/* Top accent line */}
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

/* ═══════════════════════════════════════════════
   FIELD ROW
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   TAB BUTTON
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   CARD WRAPPER
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   MAIN DRAWER
═══════════════════════════════════════════════ */
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

      {/* ── Backdrop ── */}
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
          className="h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out data-[closed]:translate-x-full"
        >
          <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc" }}>

            {/* ══════════ HEADER ══════════ */}
            <div style={{
              flexShrink: 0,
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Subtle emerald glow top-right */}
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: `radial-gradient(circle, ${action.gradFrom}18, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative", padding: "18px 20px 20px" }}>

                {/* Top bar: brand + close */}
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

                {/* Event hero */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  {/* Action icon */}
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
                      {/* Status badge */}
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
                      {/* Role badge */}
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

                {/* Timestamp + Audit ID strip */}
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

            {/* ══════════ TABS ══════════ */}
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

            {/* ══════════ SCROLLABLE BODY ══════════ */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 36px", background: "#f8fafc" }}>

              {/* ── TAB: OVERVIEW ── */}
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

              {/* ── TAB: CHANGES ── */}
              {tab === "changes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Info banner */}
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

                  {/* Divider */}
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

              {/* ── TAB: NETWORK ── */}
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

            {/* ══════════ FOOTER ══════════ */}
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