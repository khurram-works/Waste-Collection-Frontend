import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { RateData, TaskData } from "../../Types/types";
import WorkerMapView from "./WorkerMapView";
 
const recycleableWasteTypes = ["PET", "CARDBOARD", "PAPER", "METAL"];
const isRecyclable = (wasteType: string) =>
  recycleableWasteTypes.includes(wasteType.toUpperCase());
 
const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  HIGH:   { color: "#ef4444", bg: "#fef2f2", label: "HIGH PRIORITY" },
  MEDIUM: { color: "#f59e0b", bg: "#fffbeb", label: "MEDIUM PRIORITY" },
  LOW:    { color: "#10b981", bg: "#ecfdf5", label: "LOW PRIORITY" },
};
 
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pending",   color: "#64748b", bg: "#f1f5f9" },
  ASSIGNED:  { label: "Assigned",  color: "#3b82f6", bg: "#eff6ff" },
  COLLECTED: { label: "Collected", color: "#059669", bg: "#ecfdf5" },
  VERIFIED:  { label: "Verified",  color: "#059669", bg: "#ecfdf5" },
  PAID:      { label: "Paid",      color: "#16a34a", bg: "#f0fdf4" },
  CANCELLED: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2" },
};
 
const TaskDetailsDrawer = ({
  isOpen,
  onClose,
  task,
  rates,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: TaskData | null;
  rates: RateData[];
}) => {
  const [showMap, setShowMap] = useState(false);
  const mapViewRef = useRef<{ invalidateSize: () => void } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
 
  useEffect((): (() => void) | void => {
    if (!showMap) return;
    const panel = panelRef.current;
    if (!panel) return;
    const onEnd = () => mapViewRef.current?.invalidateSize();
    panel.addEventListener("transitionend", onEnd);
    const t = setTimeout(onEnd, 400);
    return () => { panel.removeEventListener("transitionend", onEnd); clearTimeout(t); };
  }, [showMap]);
 
  if (!task) return null;
 
  const handleClose = () => { setShowMap(false); onClose(); };
  const recyclable = isRecyclable(task.wasteType);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.LOW;
  const status   = STATUS_CONFIG[task.status]   || STATUS_CONFIG.PENDING;
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        .tdd-root { font-family: 'DM Sans', sans-serif; }
        .tdd-mono  { font-family: 'JetBrains Mono', monospace; }
 
        .tdd-panel-details { width: 380px; }
        .tdd-panel-map     { width: 70vw; }
        @media (max-width: 768px) {
          .tdd-panel-details,
          .tdd-panel-map { width: 100vw; }
        }
 
        .tdd-field-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6a8174;
          margin-bottom: 4px;
        }
        .tdd-field-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f1e18;
          line-height: 1.4;
        }
 
        .tdd-section {
          padding: 16px 0;
          border-bottom: 1px solid #f0f4f2;
        }
        .tdd-section:last-child { border-bottom: none; }
 
        .tdd-waste-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .tdd-waste-tag.rec  { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .tdd-waste-tag.land { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
 
        .tdd-priority-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
        }
 
        .tdd-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
 
        .tdd-note-box {
          background: #f7f9f8;
          border-left: 3px solid #10b981;
          border-radius: 0 8px 8px 0;
          padding: 12px 14px;
        }
 
        .tdd-photo {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #e4ede8;
        }
 
        .tdd-map-btn {
          width: 100%;
          background: #10b981;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 16px rgba(16,185,129,0.25);
        }
        .tdd-map-btn:hover {
          background: #059669;
          box-shadow: 0 6px 20px rgba(16,185,129,0.35);
          transform: translateY(-1px);
        }
        .tdd-map-btn:active { transform: translateY(0); }
 
        .tdd-close-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid #e4ede8;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #6a8174;
          transition: all 0.15s ease;
        }
        .tdd-close-btn:hover { background: #f0faf5; color: #10b981; border-color: #a7f3d0; }
 
        .tdd-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #6a8174;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .tdd-back-btn:hover { background: #f0faf5; color: #10b981; }
 
        .tdd-info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: #f7f9f8;
        }
        .tdd-info-row .icon {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: #e8f5ef;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .tdd-info-row .icon span {
          font-size: 18px;
          color: #10b981;
        }
      `}</style>
 
      <Dialog open={isOpen} onClose={handleClose} className="tdd-root relative z-50">
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 40 }}
        />
        <div style={{ position: "fixed", inset: 0, display: "flex", justifyContent: "flex-end", zIndex: 50 }}>
          <DialogPanel
            ref={panelRef}
            transition
            className={`${showMap ? "tdd-panel-map" : "tdd-panel-details"} bg-white h-full shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out data-closed:translate-x-full`}
          >
            {showMap ? (
              /* ── MAP VIEW ── */
              <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
                <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e4ede8", background: "#fff", zIndex: 10 }}>
                  <button className="tdd-back-btn" onClick={() => setShowMap(false)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                    Back
                  </button>
                  <div style={{ width: 1, height: 22, background: "#e4ede8" }} />
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f1e18" }}>Live Map Navigation</h3>
                  <span
                    className="tdd-status-pill"
                    style={{ marginLeft: "auto", background: "#ecfdf5", color: "#059669" }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    LIVE
                  </span>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <WorkerMapView rates={rates} task={task} onClose={handleClose} ref={mapViewRef} />
                </div>
              </div>
            ) : (
              /* ── DETAIL VIEW ── */
              <>
                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e4ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p className="tdd-field-label" style={{ marginBottom: 2 }}>Task Details</p>
                    <p className="tdd-mono" style={{ fontSize: 14, fontWeight: 700, color: "#0f1e18" }}>
                      #{task.requestId}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      className="tdd-status-pill"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                    <button className="tdd-close-btn" onClick={handleClose}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
                </div>
 
                {/* Scrollable body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
 
                  {/* Address */}
                  <div className="tdd-section">
                    <p className="tdd-field-label">Pickup Address</p>
                    <div className="tdd-info-row">
                      <div className="icon">
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <p className="tdd-field-value" style={{ fontSize: 13 }}>{task.address}</p>
                    </div>
                  </div>
 
                  {/* Waste + Priority */}
                  <div className="tdd-section">
                    <p className="tdd-field-label">Waste Specs</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <span className={`tdd-waste-tag ${recyclable ? "rec" : "land"}`}>
                        {recyclable ? "♻️" : "🗑️"} {recyclable ? "RECYCLING" : "LANDFILL"} &nbsp;·&nbsp; {task.wasteType}
                      </span>
                      <span
                        className="tdd-priority-chip"
                        style={{ background: priority.bg, color: priority.color }}
                      >
                        {task.priority === "HIGH" && "🔴"}
                        {task.priority === "MEDIUM" && "🟡"}
                        {task.priority === "LOW" && "🟢"}
                        {" "}{priority.label}
                      </span>
                    </div>
                  </div>
 
                  {/* Stats row */}
                  <div className="tdd-section">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: "#f7f9f8", borderRadius: 10, padding: "12px 14px" }}>
                        <p className="tdd-field-label">Est. Weight</p>
                        <p className="tdd-mono tdd-field-value" style={{ fontSize: 18 }}>
                          {task.estimatedWeight} <span style={{ fontSize: 12, fontWeight: 500, color: "#6a8174" }}>kg</span>
                        </p>
                      </div>
                      <div style={{ background: "#f7f9f8", borderRadius: 10, padding: "12px 14px" }}>
                        <p className="tdd-field-label">Route</p>
                        <p className="tdd-field-value" style={{ fontSize: 13 }}>{task.route?.name || "—"}</p>
                      </div>
                    </div>
                  </div>
 
                  {/* Photo */}
                  <div className="tdd-section">
                    <p className="tdd-field-label">Waste Photo</p>
                    <img src={task.photoUrl} alt="Waste" className="tdd-photo" />
                  </div>
 
                  {/* Notes */}
                  <div className="tdd-section">
                    <p className="tdd-field-label">Citizen Notes</p>
                    <div className="tdd-note-box">
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#10b981", flexShrink: 0, marginTop: 1 }}>
                          sticky_note_2
                        </span>
                        <p style={{ fontSize: 13, color: "#374151", fontStyle: "italic", lineHeight: 1.6 }}>
                          "{task.notes}"
                        </p>
                      </div>
                    </div>
                  </div>
 
                </div>
 
                {/* Footer CTA */}
                <div style={{ padding: "16px 20px", borderTop: "1px solid #e4ede8", background: "#fff" }}>
                  <button className="tdd-map-btn" onClick={() => setShowMap(true)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>navigation</span>
                    Navigate to Pickup
                  </button>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
 
export default TaskDetailsDrawer;
