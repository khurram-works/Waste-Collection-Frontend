import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { adminDashboardData } from "../../api/auth";
import { useNavigate } from "react-router-dom";

interface PickupRequestItem {
  requestId: number;
  citizenId?: number;
  wasteType: string;
  requestDate: string;
  scheduledDate: string;
  assignedDate?: string;
  collectionDate?: string | null;
  status: string;
  estimatedWeight: number;
  priority?: string;
  address?: string;
  notes?: string | null;
  photoUrl: string | null;
  actualWeight: number | null;
  rateApplied: number | null;
  condition: string | null;
  workerId: number | null;
  workerName?: string;
  workerPhone?: string;
  workerZoneId?: number;
  worker?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  latitude: number;
  longitude: number;
  estimatedEarnings?: number;
  citizenNote?: string | null;
  pickupAddress?: string;
}

interface DashboardData {
  assignedPickups?: string;
  activeWorkers?: string;
  pendingPickups?: string;
  totalUsers?: string;
  pendingWithdrawalAmount?: string;
  pendingWithdrawals?: string;
  completedTasks?: string;
  paid?: string;
  inactiveWorkers?: string;
  workersWithTaskAssigned?: string;
  available?: string;
  totalWaste?: string;
  recyclableWastePercentage?: string;
  non_recyclableWastePercentage?: string;
}

const C = {
  green50:   "#ecfdf5",
  green100:  "#d1fae5",
  green200:  "#a7f3d0",
  green500:  "#10b981",
  green600:  "#059669", 
  green700:  "#047857",
  green800:  "#065f46",

  gray50:    "#f9fafb",
  gray100:   "#f3f4f6",
  gray200:   "#e5e7eb",
  gray300:   "#d1d5db",
  gray400:   "#9ca3af",
  gray500:   "#6b7280",
  gray600:   "#4b5563",
  gray700:   "#374151",
  gray800:   "#1f2937",
  gray900:   "#111827",

  blue50:    "#eff6ff",
  blue100:   "#dbeafe",
  blue200:   "#bfdbfe",
  blue500:   "#3b82f6",
  blue600:   "#2563eb",

  amber50:   "#fffbeb",
  amber100:  "#fef3c7",
  amber200:  "#fde68a",
  amber500:  "#f59e0b",
  amber600:  "#d97706",

  rose50:    "#fff1f2",
  rose100:   "#ffe4e6",
  rose500:   "#f43f5e",
  rose600:   "#e11d48",

  purple50:  "#f5f3ff",
  purple100: "#ede9fe",
  purple600: "#7c3aed",

  white: "#ffffff",
  bg:    "#f0fdf8",   
};


const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .swd  { font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; }
  .swd-h{ font-family:'Outfit',sans-serif; }

  @keyframes swUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .sw-in { animation: swUp .42s ease both; }

  /* KPI lift */
  .sw-kpi { transition: transform .2s, box-shadow .2s; cursor:default; }
  .sw-kpi:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(5,150,105,.13), 0 2px 8px rgba(0,0,0,.06) !important;
  }

  /* Pill hover */
  .sw-pill { transition: box-shadow .18s; }
  .sw-pill:hover { box-shadow: 0 4px 16px rgba(0,0,0,.09) !important; }

  /* Table row */
  .sw-tr { transition: background .12s; }
  .sw-tr:hover { background: ${C.green50} !important; }

  /* Thin branded scrollbar */
  .sw-scroll::-webkit-scrollbar       { height:4px; }
  .sw-scroll::-webkit-scrollbar-track { background:transparent; }
  .sw-scroll::-webkit-scrollbar-thumb { background:${C.green200}; border-radius:4px; }

  /* ── Responsive grids ── */
  /* KPI row: 5 → 3 → 2 → 1 */
  .sw-kpi-grid {
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:16px;
  }
  @media(max-width:1280px){ .sw-kpi-grid{ grid-template-columns:repeat(3,1fr); } }
  @media(max-width:860px) { .sw-kpi-grid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:480px) { .sw-kpi-grid{ grid-template-columns:1fr; } }

  /* Chart + donut: side-by-side → stacked */
  .sw-mid {
    display:grid;
    grid-template-columns:1fr 300px;
    gap:20px;
  }
  @media(max-width:1100px){ .sw-mid{ grid-template-columns:1fr; } }

  /* Lifecycle + workers: side-by-side → stacked */
  .sw-bot {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
  }
  @media(max-width:860px){ .sw-bot{ grid-template-columns:1fr; } }

  /* Secondary stat pills: 4 → 2 → 1 */
  .sw-strip {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:14px;
  }
  @media(max-width:1100px){ .sw-strip{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:480px) { .sw-strip{ grid-template-columns:1fr; } }

  /* Reduce page padding on small screens */
  @media(max-width:640px){
    .sw-page{ padding:20px 16px 56px !important; }
  }
`;

// ─── Utilities ────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildChartData(rev: Record<string,number>, pay: Record<string,number>) {
  const keys = Array.from(new Set([...Object.keys(rev), ...Object.keys(pay)]));
  keys.sort((a, b) => {
    const [ay, am] = a.split("-").map(Number);
    const [by, bm] = b.split("-").map(Number);
    return ay !== by ? ay - by : am - bm;
  });
  return keys.map((k) => {
    const [yr, mo] = k.split("-").map(Number);
    return {
      month:   `${MONTHS[mo - 1]} '${String(yr).slice(2)}`,
      revenue: rev[k] ?? 0,
      payouts: pay[k] ?? 0,
    };
  });
}

function timeAgo(d: string) {
  if (!d) return "—";
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmt(v?: string | number, prefix = "") {
  if (v === undefined || v === null || v === "") return "—";
  const num = Number(v);
  return `${prefix}${isNaN(num) ? v : num.toLocaleString()}`;
}

function statusStyle(s: string) {
  switch (s?.toUpperCase()) {
    case "PENDING":   return { color:C.amber600, bg:C.amber50,  border:C.amber100,  dot:C.amber500,  label:"Pending"   };
    case "ASSIGNED":  return { color:C.blue600,  bg:C.blue50,   border:C.blue100,   dot:C.blue500,   label:"Assigned"  };
    case "COMPLETED": return { color:C.green800, bg:C.green50,  border:C.green200,  dot:C.green600,  label:"Completed" };
    case "CANCELLED": return { color:C.rose600,  bg:C.rose50,   border:C.rose100,   dot:C.rose500,   label:"Cancelled" };
    default:          return { color:C.gray600,  bg:C.gray100,  border:C.gray200,   dot:C.gray400,   label:s ?? "—"    };
  }
}

const card: React.CSSProperties = {
  background: C.white,
  borderRadius: 18,
  border: `1px solid ${C.gray200}`,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

function Ico({ i, s = 20, c = "currentColor" }: { i: string; s?: number; c?: string }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize:s, lineHeight:1, color:c, display:"inline-flex", alignItems:"center", userSelect:"none", flexShrink:0 }}
    >
      {i}
    </span>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <span
        className="swd-h"
        style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.13em", color:C.gray400, whiteSpace:"nowrap" }}
      >
        {title}
      </span>
      <div style={{ flex:1, height:1, background:C.gray100 }} />
    </div>
  );
}


interface KpiProps {
  label: string; value: string; icon: string;
  accent: string; accentBg: string;
  trend?: string; up?: boolean; delay?: number;
}
function KpiCard({ label, value, icon, accent, accentBg, trend, up = true, delay = 0 }: KpiProps) {
  return (
    <div
      className="sw-kpi sw-in"
      style={{ ...card, padding:"20px", display:"flex", flexDirection:"column", gap:14, borderTop:`3px solid ${accent}`, animationDelay:`${delay}ms` }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ width:38, height:38, borderRadius:11, background:accentBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Ico i={icon} s={19} c={accent} />
        </div>
        {trend && (
          <span style={{ fontSize:10, fontWeight:700, color:up ? C.green700 : C.amber600, background:up ? C.green50 : C.amber50, borderRadius:8, padding:"3px 8px", display:"flex", alignItems:"center", gap:3 }}>
            <Ico i={up ? "trending_up" : "schedule"} s={12} c={up ? C.green700 : C.amber600} />
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="swd-h" style={{ fontSize:28, fontWeight:900, color:C.gray900, letterSpacing:"-0.04em", lineHeight:1 }}>
          {value}
        </div>
        <div style={{ fontSize:10, color:C.gray400, fontWeight:500, marginTop:5, textTransform:"uppercase", letterSpacing:"0.08em" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, icon, accent, accentBg }: { label:string; value:string; icon:string; accent:string; accentBg:string }) {
  return (
    <div className="sw-pill" style={{ ...card, padding:"14px 18px", display:"flex", alignItems:"center", gap:13 }}>
      <div style={{ width:36, height:36, borderRadius:10, background:accentBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Ico i={icon} s={18} c={accent} />
      </div>
      <div style={{ minWidth:0 }}>
        <div className="swd-h" style={{ fontSize:20, fontWeight:900, color:C.gray900, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:10, color:C.gray400, fontWeight:500, marginTop:3, textTransform:"uppercase", letterSpacing:"0.07em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function FinancialChart({ data }: { data: { month:string; revenue:number; payouts:number }[] }) {
  const fmtY   = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`;
  const fmtTip = (v: number) => `Rs ${v.toLocaleString()}`;
  const empty  = data.length === 0;

  return (
    <div style={{ ...card, padding:"24px", display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h3 className="swd-h" style={{ fontSize:16, fontWeight:800, color:C.gray900, margin:0 }}>Financial Overview</h3>
          <p style={{ fontSize:11, color:C.gray400, marginTop:3, fontWeight:500 }}>Revenue vs Payout trend</p>
        </div>
        <button
          style={{ fontSize:11, fontWeight:700, color:C.green700, background:C.green50, border:`1px solid ${C.green200}`, cursor:"pointer", display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:10, transition:"background .15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.green100)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.green50)}
        >
          <Ico i="download" s={14} c={C.green700} />Export
        </button>
      </div>

      {empty ? (
        <div style={{ flex:1, minHeight:240, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
          <Ico i="bar_chart" s={38} c={C.gray200} />
          <span style={{ fontSize:13, color:C.gray400 }}>No financial data available yet</span>
        </div>
      ) : (
        <>
          <div style={{ flex:1, minHeight:240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data} margin={{ top:6, right:12, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize:11, fontWeight:600, fill:C.gray400, fontFamily:"'DM Sans',sans-serif" }} />
                <YAxis tickFormatter={fmtY} tickLine={false} axisLine={false} width={48} tick={{ fontSize:11, fontWeight:600, fill:C.gray400, fontFamily:"'DM Sans',sans-serif" }} />
                <Tooltip
                  formatter={(v: number, name: string) => [fmtTip(v), name === "revenue" ? "Revenue" : "Payouts"]}
                  contentStyle={{ background:C.gray900, border:"none", borderRadius:12, color:"#fff", fontSize:12, fontWeight:600, padding:"10px 14px" }}
                  labelStyle={{ color:C.gray300, fontWeight:700, marginBottom:4 }}
                  cursor={{ stroke:C.gray100, strokeWidth:1 }}
                />
                <Line type="monotone" dataKey="revenue" name="revenue" stroke={C.green600} strokeWidth={3} dot={{ r:4, fill:"#fff", strokeWidth:2, stroke:C.green600 }} activeDot={{ r:6, fill:C.green600, stroke:"#fff", strokeWidth:2 }} />
                <Line type="monotone" dataKey="payouts" name="payouts" stroke={C.amber500} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r:3, fill:"#fff", strokeWidth:2, stroke:C.amber500 }} activeDot={{ r:5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"flex", gap:20, marginTop:16, paddingTop:14, borderTop:`1px solid ${C.gray100}` }}>
            {[{ col:C.green600, label:"Revenue", dash:false }, { col:C.amber500, label:"Payouts", dash:true }].map((l) => (
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <svg width={26} height={12}>
                  <line x1={0} y1={6} x2={26} y2={6} stroke={l.col} strokeWidth={2.5} strokeDasharray={l.dash ? "5 3" : undefined} />
                  <circle cx={13} cy={6} r={3} fill="#fff" stroke={l.col} strokeWidth={2} />
                </svg>
                <span style={{ fontSize:12, fontWeight:600, color:C.gray500 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WasteDonut({ data, total }: { data:{ name:string; value:number; color:string }[]; total:number }) {
  return (
    <div style={{ ...card, padding:"24px", display:"flex", flexDirection:"column" }}>
      <h3 className="swd-h" style={{ fontSize:16, fontWeight:800, color:C.gray900, marginBottom:3 }}>Waste Composition</h3>
      <p style={{ fontSize:11, color:C.gray400, fontWeight:500, marginBottom:20 }}>Recyclable split by kg</p>

      <div style={{ position:"relative", display:"flex", justifyContent:"center", marginBottom:4 }}>
        <PieChart width={158} height={158}>
          <Pie data={data} cx={74} cy={74} innerRadius={52} outerRadius={72} dataKey="value" strokeWidth={4} stroke={C.white}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={{ background:C.gray900, border:"none", borderRadius:10, color:"#fff", fontSize:12, fontWeight:600 }} formatter={(v) => [`${v}%`]} />
        </PieChart>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
          <div className="swd-h" style={{ fontSize:22, fontWeight:900, color:C.gray900, lineHeight:1 }}>{total.toLocaleString()}</div>
          <div style={{ fontSize:9, color:C.gray400, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:3 }}>kg total</div>
        </div>
      </div>

      <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:12, paddingTop:18, borderTop:`1px solid ${C.gray100}` }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:d.color }} />
                <span style={{ fontSize:12, color:C.gray600, fontWeight:500 }}>{d.name}</span>
              </div>
              <span className="swd-h" style={{ fontSize:13, fontWeight:800, color:C.gray900 }}>{d.value}%</span>
            </div>
            <div style={{ height:5, borderRadius:4, background:C.gray100, overflow:"hidden" }}>
              <div style={{ width:`${d.value}%`, height:"100%", background:d.color, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LifecycleStep { step:number; label:string; count?:string; icon:string; color:string; bg:string }
function PickupLifecycle({ steps }: { steps: LifecycleStep[] }) {
  return (
    <div style={{ ...card, padding:"24px" }}>
      <h3 className="swd-h" style={{ fontSize:16, fontWeight:800, color:C.gray900, marginBottom:3 }}>Pickup Lifecycle</h3>
      <p style={{ fontSize:11, color:C.gray400, fontWeight:500, marginBottom:20 }}>Request flow by current stage</p>

      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {steps.map((s, i) => (
          <div key={s.step}>
            <div
              className="sw-pill"
              style={{ display:"flex", alignItems:"center", gap:13, padding:"12px 15px", borderRadius:13, background:s.bg, border:`1px solid ${s.color}22` }}
            >
              <div style={{ width:32, height:32, borderRadius:9, background:`${s.color}1a`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ico i={s.icon} s={17} c={s.color} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.gray700 }}>{s.label}</div>
                <div style={{ fontSize:10, color:C.gray400, marginTop:1 }}>Stage {s.step} of {steps.length}</div>
              </div>
              <div className="swd-h" style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.count ?? "—"}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ display:"flex", justifyContent:"center", padding:"3px 0" }}>
                <Ico i="south" s={13} c={C.gray300} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkerStatus({ rows }: { rows:{ label:string; count:number; color:string; bg:string }[] }) {
  const total = rows.reduce((a, d) => a + d.count, 0);
  const pie   = rows.map((d) => ({ name:d.label, value:d.count, color:d.color }));

  return (
    <div style={{ ...card, padding:"24px" }}>
      <h3 className="swd-h" style={{ fontSize:16, fontWeight:800, color:C.gray900, marginBottom:3 }}>Worker Status</h3>
      <p style={{ fontSize:11, color:C.gray400, fontWeight:500, marginBottom:20 }}>Live field workforce snapshot</p>

      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <PieChart width={110} height={110}>
            <Pie data={pie} cx={50} cy={50} innerRadius={34} outerRadius={50} dataKey="value" strokeWidth={4} stroke={C.white}>
              {pie.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
          </PieChart>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
            <div className="swd-h" style={{ fontSize:17, fontWeight:900, color:C.gray900 }}>{total}</div>
            <div style={{ fontSize:8, fontWeight:700, color:C.gray400, textTransform:"uppercase" }}>Total</div>
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:11 }}>
          {rows.map((d) => {
            const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
            return (
              <div key={d.label}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:d.color }} />
                    <span style={{ fontSize:11, fontWeight:600, color:C.gray600 }}>{d.label}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:10, color:C.gray400 }}>{pct}%</span>
                    <span className="swd-h" style={{ fontSize:15, fontWeight:800, color:C.gray900, minWidth:20, textAlign:"right" }}>{d.count}</span>
                  </div>
                </div>
                <div style={{ height:4, borderRadius:4, background:C.gray100, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:d.color, borderRadius:4, transition:"width .5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RequestsTable({ requests }: { requests: PickupRequestItem[] }) {
  const navigate = useNavigate();

  const palettes = [
    { bg:C.blue100,   text:"#1d4ed8" },
    { bg:C.green100,  text:C.green800 },
    { bg:C.purple100, text:"#5b21b6" },
    { bg:C.amber100,  text:"#92400e" },
  ];

  function workerInfo(req: PickupRequestItem) {
    if (!req.workerId) return null;
    const name   = req.workerName ?? req.worker ?? `Worker #${req.workerId}`;
    const parts  = name.trim().split(" ");
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
    return { name, initials: initials.toUpperCase() };
  }

  function shortAddr(a?: string) {
    if (!a) return "—";
    return a.split(",").slice(0, 2).join(", ");
  }

  const cols = ["Request","Address","Waste Type","Status","Worker","Time"];

  return (
    <div style={{ ...card, overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", borderBottom:`1px solid ${C.gray100}` }}>
        <div>
          <h3 className="swd-h" style={{ fontSize:16, fontWeight:800, color:C.gray900 }}>Recent Service Requests</h3>
          <p style={{ fontSize:11, color:C.gray400, fontWeight:500, marginTop:2 }}>{requests.length} requests shown</p>
        </div>
        <button
          onClick={() => navigate("/admin/manage")}
          style={{ fontSize:11, fontWeight:700, color:C.green700, background:C.green50, border:`1px solid ${C.green200}`, cursor:"pointer", padding:"7px 14px", borderRadius:10, display:"flex", alignItems:"center", gap:5, transition:"background .15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.green100)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.green50)}
        >
          <Ico i="open_in_full" s={13} c={C.green700} />View All
        </button>
      </div>
      <div className="sw-scroll" style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, whiteSpace:"nowrap" }}>
          <thead>
            <tr style={{ background:C.gray50 }}>
              {cols.map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding:"9px 14px",
                    paddingLeft:  i === 0                ? 24 : 14,
                    paddingRight: i === cols.length - 1  ? 24 : 14,
                    textAlign: i === cols.length - 1 ? "right" : "left",
                    fontSize:10, textTransform:"uppercase", letterSpacing:"0.09em",
                    color:C.gray400, fontWeight:700,
                    borderBottom:`1px solid ${C.gray200}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={cols.length} style={{ padding:"48px 24px", textAlign:"center" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, color:C.gray400 }}>
                    <Ico i="inbox" s={32} c={C.gray300} />
                    <span style={{ fontSize:13 }}>No recent requests found</span>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const ss  = statusStyle(req.status);
                const w   = workerInfo(req);
                const pal = palettes[(req.workerId ?? 0) % palettes.length];
                return (
                  <tr key={req.requestId} className="sw-tr" style={{ borderBottom:`1px solid ${C.gray100}` }}>
                    <td style={{ padding:"13px 14px", paddingLeft:24 }}>
                      <span className="swd-h" style={{ fontSize:12, fontWeight:800, color:C.green700 }}>
                        #{`${req.requestId}`}
                      </span>
                    </td>
                    <td style={{ padding:"13px 14px", color:C.gray500, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis" }}>
                      {shortAddr(req.address ?? req.pickupAddress)}
                    </td>
                    <td style={{ padding:"13px 14px" }}>
                      <span style={{
                        fontSize:11, fontWeight:700, borderRadius:7, padding:"3px 9px",
                        color:      req.wasteType === "RECYCLABLE" ? C.green700 : C.gray600,
                        background: req.wasteType === "RECYCLABLE" ? C.green100 : C.gray100,
                      }}>
                        {req.wasteType.replace(/_/g," ").toLowerCase().replace(/\b\w/g,(c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td style={{ padding:"13px 14px" }}>
                      <span style={{ background:ss.bg, color:ss.color, border:`1px solid ${ss.border}`, borderRadius:7, padding:"3px 9px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:5 }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:ss.dot, display:"inline-block", flexShrink:0 }} />
                        {ss.label}
                      </span>
                    </td>
                    <td style={{ padding:"13px 14px", color:C.gray500 }}>
                      {w ? (
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ width:24, height:24, borderRadius:7, background:pal.bg, color:pal.text, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, flexShrink:0 }}>
                            {w.initials}
                          </div>
                          <span style={{ fontWeight:500 }}>{w.name}</span>
                        </div>
                      ) : (
                        <span style={{ fontStyle:"italic", color:C.gray300, fontSize:11 }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding:"13px 14px", paddingRight:24, textAlign:"right", color:C.gray400, fontWeight:500 }}>
                      {timeAgo(req.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DashboardView() {
  const [data,     setData]     = useState<DashboardData>({});
  const [requests, setRequests] = useState<PickupRequestItem[]>([]);
  const [payouts,  setPayouts]  = useState<Record<string,number>>({});
  const [revenue,  setRevenue]  = useState<Record<string,number>>({});
  const [loading,  setLoading]  = useState(true);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { if (styleRef.current) document.head.removeChild(styleRef.current); };
  }, []);

  useEffect(() => {
    adminDashboardData()
      .then((res) => {
        setData(res.responseData ?? {});
        setRequests(res.recentPickupRequests ?? []);
        setPayouts(res.payoutData ?? {});
        setRevenue(res.revenueData ?? {});
      })
      .finally(() => setLoading(false));
  }, []);

  const chartData = buildChartData(revenue, payouts);

  const KPI_CARDS: KpiProps[] = [
    { label:"Total Users",     value:fmt(data.totalUsers),      icon:"group",           accent:C.green600, accentBg:C.green50,  trend:"+5.2%",   up:true,  delay:0   },
    { label:"Active Workers",  value:fmt(data.activeWorkers),   icon:"engineering",     accent:C.blue600,  accentBg:C.blue50,   trend:"89% util",up:true,  delay:60  },
    { label:"Pending Pickups", value:fmt(data.pendingPickups),  icon:"pending_actions", accent:C.amber600, accentBg:C.amber50,  trend:"Avg 2.4h",up:false, delay:120 },
    { label:"Assigned",        value:fmt(data.assignedPickups), icon:"assignment_ind",  accent:C.purple600,accentBg:C.purple50,                            delay:180 },
    { label:"Total Waste (kg)",value:fmt(data.totalWaste),      icon:"recycling",       accent:C.green600, accentBg:C.green50,                             delay:240 },
  ];

  const STAT_PILLS = [
    { label:"Completed Tasks",     value:fmt(data.completedTasks),                     icon:"task_alt",               accent:C.green600, accentBg:C.green50 },
    { label:"Paid Pickups",        value:fmt(data.paid),                               icon:"payments",               accent:C.blue600,  accentBg:C.blue50  },
    { label:"Pending Withdrawals", value:fmt(data.pendingWithdrawals),                 icon:"account_balance_wallet", accent:C.amber600, accentBg:C.amber50 },
    { label:"Withdrawal Amount",   value:`Rs ${fmt(data.pendingWithdrawalAmount)}`,    icon:"payments",         accent:C.rose600,  accentBg:C.rose50  },
  ];

  const LIFECYCLE: LifecycleStep[] = [
    { step:1, label:"Pending Review",     count:data.pendingPickups,  icon:"hourglass_top",  color:C.amber600,  bg:C.amber50  },
    { step:2, label:"Assigned to Worker", count:data.assignedPickups, icon:"assignment_ind", color:C.blue600,   bg:C.blue50   },
    { step:3, label:"Completed",          count:data.completedTasks,  icon:"task_alt",       color:C.green600,  bg:C.green50  },
    { step:4, label:"Payment Processed",  count:data.paid,            icon:"payments",       color:C.purple600, bg:C.purple50 },
  ];

  const WORKERS = [
    { label:"On Route",  count:Number(data.workersWithTaskAssigned) || 0, color:C.blue500,  bg:C.blue50  },
    { label:"Available", count:Number(data.available)               || 0, color:C.green500, bg:C.green50 },
    { label:"Inactive",  count:Number(data.inactiveWorkers)         || 0, color:C.gray400,  bg:C.gray50  },
  ];

  const WASTE = [
    { name:"Recyclable",     value:Number(data.recyclableWastePercentage)     || 0, color:C.green600 },
    { name:"Non-Recyclable", value:Number(data.non_recyclableWastePercentage) || 0, color:C.gray300  },
  ];

  if (loading) {
    return (
      <div
        className="swd"
        style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", flexDirection:"column", gap:14 }}
      >
        <div style={{ width:40, height:40, borderRadius:12, background:C.green600, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Ico i="recycling" s={22} c="#fff" />
        </div>
        <span style={{ fontSize:13, color:C.gray400, fontWeight:500 }}>Loading dashboard…</span>
      </div>
    );
  }


  return (
    <div
      className="swd sw-page"
      style={{
        // background: C.bg,
        minHeight: "100%",
        padding: "28px 28px 64px",
      }}
    >

      <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
        <section>
          <SectionLabel title="Overview" />
          <div className="sw-kpi-grid">
            {KPI_CARDS.map((k) => <KpiCard key={k.label} {...k} />)}
          </div>
        </section>
        <section>
          <SectionLabel title="Financial & Task Metrics" />
          <div className="sw-strip">
            {STAT_PILLS.map((p) => <StatPill key={p.label} {...p} />)}
          </div>
        </section>

        <section>
          <SectionLabel title="Analytics" />
          <div className="sw-mid">
            <FinancialChart data={chartData} />
            <WasteDonut data={WASTE} total={Number(data.totalWaste) || 0} />
          </div>
        </section>
        <section>
          <SectionLabel title="Operations" />
          <div className="sw-bot">
            <PickupLifecycle steps={LIFECYCLE} />
            <WorkerStatus rows={WORKERS} />
          </div>
        </section>
        <section>
          <SectionLabel title="Recent Activity" />
          <RequestsTable requests={requests} />
        </section>

      </div>
    </div>
  );
}