import React, { useState } from "react";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import { getTasks } from "../../api/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { TaskData, RateData } from "../../Types/types";
 
const recycleableWasteTypes = ["PET", "CARDBOARD", "PAPER", "METAL"];
const isRecyclable = (wasteType: string) =>
  recycleableWasteTypes.includes(wasteType.toUpperCase());
 
const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  PENDING:     { label: "Pending",    dot: "bg-slate-400",   bg: "bg-slate-100",   text: "text-slate-600" },
  ASSIGNED:    { label: "Assigned",   dot: "bg-blue-400",    bg: "bg-blue-50",     text: "text-blue-700" },
  COLLECTED:   { label: "Collected",  dot: "bg-emerald-400", bg: "bg-emerald-50",  text: "text-emerald-700" },
  VERIFIED:    { label: "Verified",   dot: "bg-emerald-400", bg: "bg-emerald-50",  text: "text-emerald-700" },
  PAID:        { label: "Paid",       dot: "bg-green-400",   bg: "bg-green-50",    text: "text-green-700" },
  CANCELLED:   { label: "Cancelled",  dot: "bg-red-400",     bg: "bg-red-50",      text: "text-red-700" },
};
 
const PRIORITY_CONFIG: Record<string, { color: string; ring: string; label: string }> = {
  HIGH:   { color: "text-red-500",    ring: "bg-red-500",    label: "HIGH" },
  MEDIUM: { color: "text-amber-500",  ring: "bg-amber-500",  label: "MED" },
  LOW:    { color: "text-emerald-500",ring: "bg-emerald-500",label: "LOW" },
};
 
const TaskListView = () => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false);
  const [tasks, setTasks]                 = useState<TaskData[]>([]);
  const [loading, setLoading]             = useState(true);
  const [allTasks, setAllTasks]           = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [Rates, setRates]                 = useState<RateData[]>([]);
 
  const openDrawer = (task: TaskData) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };
 
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTask(null);
  };
 
  useEffect(() => {
    (async () => {
      try {
        const result = await getTasks();
        if (result?.success === false) throw new Error(result.message || "Failed");
        setTasks(result?.data || []);
        setAllTasks(result?.totalTasks[0]._count.assignedPickups || 0);
        setCompletedTasks(result?.completedTasks[0]._count.completedPickups || 0);
        setRates(result.rates);
      } catch {
        toast.error("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f7f9f8]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
          </div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">
            Loading Tasks
          </p>
        </div>
      </div>
    );
  }
 
  const progress = allTasks > 0 ? Math.round((completedTasks / allTasks) * 100) : 0;
 
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        .tlv-root { font-family: 'DM Sans', sans-serif; }
        .tlv-mono  { font-family: 'JetBrains Mono', monospace; }
        .row-hover { transition: background 0.15s ease; }
        .row-hover:hover { background: #f0faf5; }
        .row-active { background: #edfaf3; border-left: 3px solid #10b981; }
        .btn-action {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.05em;
          padding: 5px 14px;
          border-radius: 8px;
          border: 1.5px solid #10b981;
          color: #059669;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-action:hover {
          background: #10b981;
          color: #fff;
        }
        .stat-card {
          background: #fff;
          border: 1px solid #e4ede8;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 4px rgba(16,185,129,0.06);
        }
        .progress-bar-track {
          height: 6px;
          background: #e4ede8;
          border-radius: 99px;
          overflow: hidden;
          flex: 1;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 99px;
          transition: width 0.6s cubic-bezier(.4,0,.2,1);
        }
        .table-container {
          border-radius: 14px;
          border: 1px solid #e4ede8;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(16,185,129,0.06);
        }
        thead th {
          background: #f7f9f8;
          padding: 12px 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6a8174;
          border-bottom: 1px solid #e4ede8;
          white-space: nowrap;
        }
        tbody td { padding: 14px 20px; border-bottom: 1px solid #f0f4f2; vertical-align: middle; }
        tbody tr:last-child td { border-bottom: none; }
        .waste-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .waste-badge.recyclable   { background: #ecfdf5; color: #059669; }
        .waste-badge.landfill     { background: #fef3c7; color: #b45309; }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .priority-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .pulse-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .empty-state {
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
      `}</style>
 
      <main className="tlv-root flex-1 overflow-y-auto bg-[#f7f9f8] p-5 md:p-7 flex flex-col gap-6">
 
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 22, color: "#0f1e18", letterSpacing: "-0.02em" }}>
              Today's Pickup Tasks
            </h1>
            <p style={{ fontSize: 13, color: "#6a8174", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
 
          {/* Stat cards */}
          <div className="flex gap-3 flex-wrap">
            <div className="stat-card">
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#10b981" }}>assignment</span>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6a8174" }}>Total</p>
                <p className="tlv-mono" style={{ fontSize: 22, fontWeight: 700, color: "#0f1e18", lineHeight: 1 }}>{allTasks}</p>
              </div>
            </div>
 
            <div className="stat-card">
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#10b981" }}>check_circle</span>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6a8174" }}>Done</p>
                <p className="tlv-mono" style={{ fontSize: 22, fontWeight: 700, color: "#10b981", lineHeight: 1 }}>{completedTasks}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>{progress}%</span>
                <div className="progress-bar-track" style={{ width: 80 }}>
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* ── Table ── */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="table-container">
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>Task ID</th>
                      <th>Address</th>
                      <th>Waste</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="empty-state">
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#c8d8d0" }}>inventory_2</span>
                            <p style={{ fontSize: 14, color: "#9ab0a6", fontWeight: 600 }}>No tasks assigned for today</p>
                          </div>
                        </td>
                      </tr>
                    ) : tasks.map((task) => {
                      const recyclable = isRecyclable(task.wasteType);
                      const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
                      const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.LOW;
                      const isActive = selectedTask?.requestId === task.requestId;
                      return (
                        <tr
                          key={task.requestId}
                          className={`row-hover ${isActive ? "row-active" : ""}`}
                        >
                          <td>
                            <span className="tlv-mono" style={{ fontSize: 12, fontWeight: 700, color: "#0f1e18", letterSpacing: "0.04em" }}>
                              #{task.requestId}
                            </span>
                          </td>
                          <td style={{ maxWidth: 220 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "#1a2e24", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
                              {task.address}
                            </p>
                          </td>
                          <td>
                            <span className={`waste-badge ${recyclable ? "recyclable" : "landfill"}`}>
                              {recyclable ? "♻️" : "🗑️"} {recyclable ? "RECYCLING" : "LANDFILL"}
                            </span>
                          </td>
                          <td>
                            <div className={`priority-chip ${priority.color}`}>
                              <span className={`pulse-dot ${priority.ring}`} />
                              {priority.label}
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${status.bg} ${status.text}`}>
                              <span className={`pulse-dot ${status.dot}`} />
                              {status.label}
                            </span>
                          </td>
                          <td>
                            <button className="btn-action" onClick={() => openDrawer(task)}>
                              {task.status === "COLLECTED" ? "Verify →" : "Open →"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
 
          <TaskDetailsDrawer
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            task={selectedTask}
            rates={Rates}
          />
        </div>
      </main>
    </>
  );
};
 
export default TaskListView;
