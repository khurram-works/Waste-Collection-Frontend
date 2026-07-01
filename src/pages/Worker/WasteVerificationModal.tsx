import React, { useState, Fragment, useMemo } from "react";
import {
  Dialog,
  Transition,
  RadioGroup,
  DialogTitle,
  Label,
  Description,
  DialogPanel,
  TransitionChild,
  Radio,
} from "@headlessui/react";
import { verifiedTask } from "../../api/auth";
import { toast } from "react-toastify";
import { VerifiedTaskData } from "@/Types/types";
 
const CONDITION_CONFIG = [
  {
    id: "PROPER",
    name: "Properly Separated",
    shortDesc: "Clean, dry, sorted",
    icon: "check_circle",
    accentColor: "#10b981",
    accentBg: "#ecfdf5",
    accentRing: "#a7f3d0",
    iconBg: "#10b981",
    iconColor: "#fff",
    badge: "BEST RATE",
    badgeColor: "#059669",
    badgeBg: "#d1fae5",
  },
  {
    id: "MIXED",
    name: "Mixed but Clean",
    shortDesc: "Materials blended together",
    icon: "warning",
    accentColor: "#f59e0b",
    accentBg: "#fffbeb",
    accentRing: "#fde68a",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    badge: "LOWER RATE",
    badgeColor: "#b45309",
    badgeBg: "#fef3c7",
  },
  {
    id: "CONTAMINATED",
    name: "Contaminated",
    shortDesc: "Wet or dirty — no earnings",
    icon: "cancel",
    accentColor: "#ef4444",
    accentBg: "#fef2f2",
    accentRing: "#fecaca",
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    badge: "NO EARNINGS",
    badgeColor: "#dc2626",
    badgeBg: "#fee2e2",
  },
];


 
export default function VerifyWasteModal({ isOpen, onClose, task, rates = [] }) {
  const presentationOptions = useMemo(() => {
    const proper       = rates.find((r) => r.wasteType === task.wasteType && r.condition === "PROPER");
    const mixed        = rates.find((r) => r.wasteType === task.wasteType && r.condition === "MIXED");
    const contaminated = rates.find((r) => r.condition === "CONTAMINATED");
    return CONDITION_CONFIG.map((c) => ({
      ...c,
      rate:
        c.id === "PROPER"
          ? Number(proper?.ratePerKg || 0)
          : c.id === "MIXED"
          ? Number(mixed?.ratePerKg || 0)
          : Number(contaminated?.ratePerKg || 0),
    }));
  }, [rates, task]);
 
  const [selectedId, setSelectedId]   = useState("PROPER");
  const [weight,     setWeight]       = useState<number>(task?.estimatedWeight || 0);
  const [notes,      setNotes]        = useState("");
  const [submitting, setSubmitting]   = useState(false);
 
  const activeOption   = presentationOptions.find((o) => o.id === selectedId)!;
  const totalEarnings  = (weight * activeOption.rate).toFixed(2);
  const adjWeight      = (delta: number) =>
    setWeight((w) => Math.max(0, Number((w + delta).toFixed(1))));
 
  const handleSubmit = async () => {
    setSubmitting(true);
    const payload: VerifiedTaskData = {
      weight,
      condition:     activeOption.id,
      appliedRate:   activeOption.rate,
      notes,
      totalEarnings: Number(totalEarnings),
      requestId:     task.requestId,
      workerId:      task.workerId,
      citizenId:     task.citizenId,
    };
    try {
      const res = await verifiedTask(Number(task.requestId), payload);
      if (res.success) { toast.success(res.message); onClose(); }
      else             toast.error(res.message);
    } catch {
      toast.error("Failed to submit task");
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        .vwm-root  { font-family: 'DM Sans', sans-serif; }
        .vwm-mono  { font-family: 'JetBrains Mono', monospace; }
 
        /* ── Option cards ── */
        .vwm-option {
          border: 2px solid #e4ede8;
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
          background: #fff;
          outline: none;
        }
        .vwm-option:hover { border-color: #a7f3d0; background: #fafffe; }
 
        .vwm-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .vwm-option[data-selected="true"] .vwm-icon-wrap {
          transform: scale(1.08);
        }
 
        /* ── Weight stepper ── */
        .vwm-stepper {
          display: flex;
          align-items: center;
          background: #f7f9f8;
          border: 2px solid #e4ede8;
          border-radius: 14px;
          overflow: hidden;
          width: fit-content;
          transition: border-color 0.15s ease;
        }
        .vwm-stepper:focus-within { border-color: #10b981; }
        .vwm-step-btn {
          width: 48px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          background: none;
          border: none;
          color: #10b981;
          cursor: pointer;
          font-size: 20px;
          transition: background 0.12s ease;
        }
        .vwm-step-btn:hover { background: #ecfdf5; }
        .vwm-step-input {
          width: 90px;
          text-align: center;
          border: none;
          background: transparent;
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: #0f1e18;
          outline: none;
          padding: 0;
        }
 
        /* ── Earnings panel ── */
        .vwm-earnings {
          background: linear-gradient(135deg, #0f1e18 0%, #1a3428 100%);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 0;
        }
        .vwm-earn-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .vwm-earn-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a7f3d0;
        }
        .vwm-earn-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }
        .vwm-earn-divider {
          width: 1px; height: 40px;
          background: rgba(255,255,255,0.1);
          margin: 0 18px;
        }
        .vwm-total-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 30px;
          font-weight: 700;
          color: #34d399;
          line-height: 1;
        }
 
        /* ── Buttons ── */
        .vwm-btn-cancel {
          padding: 12px 24px;
          border: 2px solid #e4ede8;
          background: #fff;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #6a8174;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .vwm-btn-cancel:hover { border-color: #a7f3d0; color: #0f1e18; background: #f7f9f8; }
 
        .vwm-btn-submit {
          flex: 1;
          height: 52px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.15s ease;
          box-shadow: 0 4px 16px rgba(16,185,129,0.3);
        }
        .vwm-btn-submit:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(16,185,129,0.45);
          transform: translateY(-1px);
        }
        .vwm-btn-submit:disabled {
          opacity: 0.7; cursor: not-allowed; transform: none;
        }
 
        /* ── Header badge ── */
        .vwm-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ecfdf5;
          color: #059669;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1px solid #a7f3d0;
        }
 
        .vwm-field-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6a8174;
          margin-bottom: 8px;
          display: block;
        }
 
        .vwm-textarea {
          width: 100%;
          border: 2px solid #e4ede8;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #0f1e18;
          padding: 12px 14px;
          resize: vertical;
          outline: none;
          transition: border-color 0.15s ease;
          box-sizing: border-box;
        }
        .vwm-textarea::placeholder { color: #b0c4b8; }
        .vwm-textarea:focus { border-color: #10b981; }
 
        @keyframes vwm-spin { to { transform: rotate(360deg); } }
        .vwm-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: vwm-spin 0.8s linear infinite;
        }
      `}</style>
 
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="vwm-root relative z-200" onClose={onClose}>
 

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-250"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", zIndex: 10 }} />
          </TransitionChild>
 
          <div style={{ position: "fixed", inset: 0, overflowY: "auto", zIndex: 20 }}>
            <div style={{ minHeight: "98vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
 
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <DialogPanel style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
 
 
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f4f2", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span className="vwm-header-badge">
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "vwm-pulse 1.4s ease-in-out infinite" }} />
                        Verification In Progress
                      </span>
                      <DialogTitle style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 18, color: "#0f1e18", margin: 0, lineHeight: 1.3 }}>
                        Complete Task <span className="vwm-mono" style={{ color: "#10b981" }}>#{task?.requestId}</span>
                      </DialogTitle>
                      <p style={{ fontSize: 12, color: "#6a8174", margin: 0 }}>{task?.address}</p>
                    </div>
                    <button
                      onClick={onClose}
                      style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #e4ede8", background: "#f7f9f8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6a8174", flexShrink: 0 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
 

                  <div style={{ padding: "12px 24px", background: "#f7f9f8", borderBottom: "1px solid #f0f4f2", display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{ width: 52, height: 52, borderRadius: 10, backgroundImage: `url(${task?.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center", border: "2px solid #e4ede8", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#0f1e18", margin: 0 }}>
                        {task?.wasteType}
                      </p>
                      <p style={{ fontSize: 12, color: "#6a8174", margin: "2px 0 0" }}>
                        Est. {task?.estimatedWeight} kg
                      </p>
                    </div>
                  </div>
 
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 22, maxHeight: "60vh", overflowY: "auto" }}>
                    <div>
                      <label className="vwm-field-label">Verified Weight (kg)</label>
                      <div className="vwm-stepper">
                        <button type="button" className="vwm-step-btn" onClick={() => adjWeight(-0.1)}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>remove</span>
                        </button>
                        <input
                          type="number"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                          className="vwm-step-input"
                        />
                        <button type="button" className="vwm-step-btn" onClick={() => adjWeight(0.1)}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="vwm-field-label">Waste Condition</label>
                      <RadioGroup value={selectedId} onChange={setSelectedId} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {presentationOptions.map((opt) => {
                          const selected = selectedId === opt.id;
                          return (
                            <Radio
                              key={opt.id}
                              value={opt.id}
                              className="vwm-option"
                              data-selected={selected}
                              style={selected
                                ? { borderColor: opt.accentRing, background: opt.accentBg, boxShadow: `0 0 0 3px ${opt.accentRing}40` }
                                : {}
                              }
                            >
                              <div
                                className="vwm-icon-wrap"
                                style={{ background: selected ? opt.iconBg : opt.accentBg }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 22, color: selected ? opt.iconColor : opt.accentColor }}
                                >
                                  {opt.icon}
                                </span>
                              </div>
 

                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  <Label style={{ fontWeight: 700, fontSize: 13, color: "#0f1e18", cursor: "pointer" }}>
                                    {opt.name}
                                  </Label>
                                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: 99, background: opt.badgeBg, color: opt.badgeColor }}>
                                    {opt.badge}
                                  </span>
                                </div>
                                <Description style={{ fontSize: 11, color: "#6a8174", marginTop: 2 }}>
                                  {opt.shortDesc} — <strong style={{ color: opt.accentColor }}>Rs {opt.rate}/kg</strong>
                                </Description>
                              </div>
 

                              <div
                                style={{
                                  width: 22, height: 22,
                                  borderRadius: "50%",
                                  border: selected ? "none" : "2px solid #d1d5db",
                                  background: selected ? opt.accentColor : "transparent",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  flexShrink: 0,
                                  transition: "all 0.15s ease",
                                }}
                              >
                                {selected && (
                                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#fff", fontVariationSettings: "'FILL' 1" }}>check</span>
                                )}
                              </div>
                            </Radio>
                          );
                        })}
                      </RadioGroup>
                    </div>
 

                    <div className="vwm-earnings">
                      <div className="vwm-earn-col">
                        <span className="vwm-earn-label">Weight</span>
                        <span className="vwm-earn-val">{weight} kg</span>
                      </div>
                      <div className="vwm-earn-divider" />
                      <div className="vwm-earn-col">
                        <span className="vwm-earn-label">Rate</span>
                        <span className="vwm-earn-val">Rs {activeOption.rate}/kg</span>
                      </div>
                      <div className="vwm-earn-divider" />
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <span className="vwm-earn-label" style={{ textAlign: "right" }}>Citizen Earns</span>
                        <span className="vwm-total-val">Rs {totalEarnings}</span>
                      </div>
                    </div>
 
                    <div>
                      <label className="vwm-field-label" htmlFor="wvm-notes">
                        Worker Notes <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                      </label>
                      <textarea
                        id="wvm-notes"
                        className="vwm-textarea"
                        rows={2}
                        placeholder="Any anomalies, issues, or observations…"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
 
                  <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f4f2", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <button className="vwm-btn-cancel" onClick={onClose}>
                      Cancel
                    </button>
                    <button
                      className="vwm-btn-submit"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <><div className="vwm-spinner" /> Submitting…</>
                      ) : (
                        <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>verified_user</span> Confirm & Complete Task</>
                      )}
                    </button>
                  </div>
 
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}