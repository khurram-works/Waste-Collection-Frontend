import { useState, useEffect } from "react";
import { getSystemReport } from "../../api/auth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface weightData {
  actualWeight?: string;
}

interface reportData {
  totalRequests?: string;
  recyclableWaste?: weightData;
  nonRecyclableWaste?: weightData;
  activeWorkers?: string;
  totalEarnings?: { totalEarnings: string };
  verifiedPickups?: string;
  totalUsers?: string;
  petPer?: number;
  cardPer?: number;
  paperPer?: number;
  metalPer?: number;
  non_recyclePer?: number;
  totalWaste?: number;
}

interface bestWorker {
  workerId?: number;
  name?: string;
  efficiency?: number;
  vehicle?: string;
  completedTasks?: number;
  totalTasks?: number;
  assignedTasks?: number;
}

interface workersData {
  zoneId?: number;
  zoneName?: string;
  bestWorker?: bestWorker | null;
}

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

const T = {
  emerald: "#059669",
  emeraldDark: "#047857",
  emeraldLight: "#10b981",
  emeraldGhost: "#d1fae5",
  emeraldFaint: "#ecfdf5",
  sky: "#0284c7",
  skyGhost: "#e0f2fe",
  amber: "#d97706",
  amberGhost: "#fef3c7",
  rose: "#e11d48",
  roseGhost: "#ffe4e6",
  violet: "#7c3aed",
  violetGhost: "#ede9fe",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray700: "#374151",
  gray900: "#111827",
  white: "#ffffff",
  bg: "#f0fdf4",

  chartGreen: "#059669",
  chartTeal: "#0d9488",
  chartBlue: "#0284c7",
  chartAmber: "#f59e0b",
  chartRose: "#f43f5e",
};
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

  .sw-report * { box-sizing: border-box; }

  .sw-report {
    font-family: 'DM Sans', sans-serif;
    background: ${T.bg};
    min-height: 100vh;
    color: ${T.gray900};
    -webkit-font-smoothing: antialiased;
  }

  .sw-report .display-font { font-family: 'Outfit', sans-serif; }

  /* KPI Card hover */
  .kpi-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .kpi-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(5, 150, 105, 0.12) !important;
  }

  /* Table row hover */
  .worker-row {
    transition: background 0.15s ease;
  }
  .worker-row:hover {
    background: ${T.emeraldFaint} !important;
  }

  /* Pill badge */
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.02em;
  }

  /* Recharts overrides */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    border-radius: 10px !important;
    border: 1px solid ${T.gray200} !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    font-family: 'DM Sans', sans-serif !important;
  }

  /* Scrollbar */
  .sw-report ::-webkit-scrollbar { width: 4px; height: 4px; }
  .sw-report ::-webkit-scrollbar-track { background: ${T.gray100}; }
  .sw-report ::-webkit-scrollbar-thumb { background: ${T.gray300}; border-radius: 999px; }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, ${T.gray100} 25%, ${T.gray200} 50%, ${T.gray100} 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }

  /* Responsive grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
  }
  @media (max-width: 1100px) {
    .kpi-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 900px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-row { flex-direction: column !important; }
    .bottom-row { flex-direction: column !important; }
  }
  @media (max-width: 600px) {
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .page-main { padding: 16px !important; }
    .header-filters { flex-direction: column !important; align-items: stretch !important; }
    .filter-controls { flex-wrap: wrap !important; }
  }
  @media (max-width: 420px) {
    .kpi-grid { grid-template-columns: 1fr; }
  }

  /* Fade-in animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.1s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.2s; }
`;

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

const actionConfig: Record<
  string,
  { icon: string; color: string; bg: string }
> = {
  LOGIN: { icon: "login", color: T.sky, bg: T.skyGhost },
  LOGOUT: { icon: "logout", color: T.gray500, bg: T.gray100 },
  CREATE: { icon: "add_circle", color: T.emerald, bg: T.emeraldGhost },
  UPDATE: { icon: "edit", color: T.amber, bg: T.amberGhost },
  DELETE: { icon: "delete", color: T.rose, bg: T.roseGhost },
};

const roleConfig: Record<string, { color: string; bg: string }> = {
  ADMIN: { color: T.violet, bg: T.violetGhost },
  WORKER: { color: T.emerald, bg: T.emeraldGhost },
  CITIZEN: { color: T.sky, bg: T.skyGhost },
};

function Icon({
  name,
  size = 20,
  fill = 0,
  style = {},
}: {
  name: string;
  size?: number;
  fill?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}`,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

function Skeleton({
  w = "100%",
  h = 20,
}: {
  w?: string | number;
  h?: string | number;
}) {
  return <div className="skeleton" style={{ width: w, height: h }} />;
}

interface KpiCardProps {
  label: string;
  value?: string;
  icon: string;
  trend: { value: string; dir: "up" | "down" | "flat" };
  accent?: "green" | "blue" | "amber" | "rose" | "violet";
  highlight?: boolean;
  loading?: boolean;
}

function KpiCard({
  label,
  value,
  icon,
  trend,
  accent = "green",
  highlight,
  loading,
}: KpiCardProps) {
  const accentMap = {
    green: { pri: T.emerald, ghost: T.emeraldGhost, faint: T.emeraldFaint },
    blue: { pri: T.sky, ghost: T.skyGhost, faint: "#f0f9ff" },
    amber: { pri: T.amber, ghost: T.amberGhost, faint: "#fffbeb" },
    rose: { pri: T.rose, ghost: T.roseGhost, faint: "#fff1f2" },
    violet: { pri: T.violet, ghost: T.violetGhost, faint: "#faf5ff" },
  };
  const ac = accentMap[accent];
  const trendColor =
    trend.dir === "up" ? T.emerald : trend.dir === "down" ? T.rose : T.gray500;
  const trendIcon =
    trend.dir === "up"
      ? "trending_up"
      : trend.dir === "down"
        ? "trending_down"
        : "horizontal_rule";

  if (highlight) {
    return (
      <div
        className="kpi-card"
        style={{
          background: `linear-gradient(135deg, ${T.emeraldDark} 0%, ${T.emerald} 60%, ${T.emeraldLight} 100%)`,
          borderRadius: 14,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxShadow: "0 6px 24px rgba(5,150,105,0.32)",
          position: "relative",
          overflow: "hidden",
          minHeight: 108,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -16,
            top: -16,
            width: 72,
            height: 72,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(16px)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {label}
          </span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={icon} size={15} style={{ color: "#fff" }} />
          </div>
        </div>

        {loading ? (
          <Skeleton w="60%" h={22} />
        ) : (
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {value ?? "—"}
          </div>
        )}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.18)",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
            width: "fit-content",
          }}
        >
          <Icon name={trendIcon} size={12} />
          {trend.value}
        </div>
      </div>
    );
  }

  return (
    <div
      className="kpi-card"
      style={{
        background: T.white,
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        border: `1px solid ${T.gray200}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        minHeight: 108,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: ac.pri,
          borderRadius: "14px 14px 0 0",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: T.gray400,
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: ac.faint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={15} style={{ color: ac.pri }} />
        </div>
      </div>

      {loading ? (
        <Skeleton w="55%" h={22} />
      ) : (
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 22,
            color: T.gray900,
            letterSpacing: "-0.02em",
          }}
        >
          {value ?? "—"}
        </div>
      )}

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background:
            trend.dir === "up"
              ? T.emeraldGhost
              : trend.dir === "down"
                ? T.roseGhost
                : T.gray100,
          borderRadius: 999,
          padding: "2px 8px",
          fontSize: 11,
          fontWeight: 600,
          color: trendColor,
          width: "fit-content",
        }}
      >
        <Icon name={trendIcon} size={12} style={{ color: trendColor }} />
        {trend.value}
      </div>
    </div>
  );
}

interface TooltipPayloadItem {
  name: string
  color: string
  value: string | number
}

function CustomAreaTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: T.white,
        border: `1px solid ${T.gray200}`,
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: T.gray700,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: T.gray700,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              display: "inline-block",
            }}
          />
          <span style={{ textTransform: "capitalize", color: T.gray500 }}>
            {p.name}:
          </span>
          <span style={{ fontWeight: 700, color: T.gray900 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

interface WeeklyReportPoint {
  label: string
  pending: number
  collected: number
  paid: number
}

function PickupActivityChart({ weeklyReport }: { weeklyReport: WeeklyReportPoint[] }) {
  return (
    <div
      style={{
        background: T.white,
        borderRadius: 20,
        padding: 28,
        border: `1px solid ${T.gray200}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        flex: 2,
        minWidth: 0,
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: T.gray900,
            }}
          >
            Pickup Activity
          </div>
          <div style={{ fontSize: 13, color: T.gray400, marginTop: 2 }}>
            Daily volume breakdown by status
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Pending", color: T.chartAmber },
            { label: "Collected", color: T.chartTeal },
            { label: "Paid", color: T.chartGreen },
          ].map((l) => (
            <div
              key={l.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 500,
                color: T.gray500,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: l.color,
                  display: "inline-block",
                }}
              />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={weeklyReport}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.chartGreen} stopOpacity={0.18} />
                <stop
                  offset="95%"
                  stopColor={T.chartGreen}
                  stopOpacity={0.01}
                />
              </linearGradient>
              <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.chartTeal} stopOpacity={0.18} />
                <stop offset="95%" stopColor={T.chartTeal} stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.chartAmber} stopOpacity={0.18} />
                <stop
                  offset="95%"
                  stopColor={T.chartAmber}
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={T.gray100}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{
                fill: T.gray400,
                fontSize: 11,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{
                fill: T.gray400,
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomAreaTooltip />}
              cursor={{ stroke: T.gray200, strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="pending"
              name="Pending"
              stroke={T.chartAmber}
              strokeWidth={2.5}
              fill="url(#gradPending)"
              dot={false}
              activeDot={{ r: 5, fill: T.chartAmber }}
            />
            <Area
              type="monotone"
              dataKey="collected"
              name="Collected"
              stroke={T.chartTeal}
              strokeWidth={2.5}
              fill="url(#gradCollected)"
              dot={false}
              activeDot={{ r: 5, fill: T.chartTeal }}
            />
            <Area
              type="monotone"
              dataKey="paid"
              name="Paid"
              stroke={T.chartGreen}
              strokeWidth={2.5}
              fill="url(#gradPaid)"
              dot={false}
              activeDot={{ r: 5, fill: T.chartGreen }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
const WASTE_COLORS = [
  T.chartGreen,
  T.chartTeal,
  T.chartBlue,
  T.chartAmber,
  T.chartRose,
];

function WasteCompositionChart({
  wasteItems,
}: {
  wasteItems: { label: string; pct: number; color: string }[];
}) {
  const validItems = wasteItems.filter((i) => i.pct > 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      style={{
        background: T.white,
        borderRadius: 20,
        padding: 28,
        border: `1px solid ${T.gray200}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        flex: 1,
        minWidth: 0,
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: T.gray900,
        }}
      >
        Waste Composition
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.gray400,
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Breakdown by material type
      </div>

      <div style={{ flex: 1, minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={validItems}
              cx="50%"
              cy="45%"
              innerRadius="45%"
              outerRadius="70%"
              dataKey="pct"
              nameKey="label"
              labelLine={false}
              label={renderCustomLabel}
              paddingAngle={3}
            >
              {validItems.map((_, i) => (
                <Cell
                  key={i}
                  fill={WASTE_COLORS[i % WASTE_COLORS.length]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}%`, ""]}
              contentStyle={{
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                border: `1px solid ${T.gray200}`,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 8,
        }}
      >
        {validItems.map((item, i) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                flexShrink: 0,
                background: WASTE_COLORS[i % WASTE_COLORS.length],
              }}
            />
            <span style={{ flex: 1, fontSize: 13, color: T.gray500 }}>
              {item.label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 60,
                  height: 5,
                  background: T.gray100,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${item.pct}%`,
                    height: "100%",
                    background: WASTE_COLORS[i % WASTE_COLORS.length],
                    borderRadius: 999,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: WASTE_COLORS[i % WASTE_COLORS.length],
                  minWidth: 30,
                  textAlign: "right",
                }}
              >
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EfficiencyBadge({ pct = 0 }: { pct?: number }) {
  const color = pct >= 80 ? T.emerald : pct >= 60 ? T.amber : T.rose;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 72,
          height: 6,
          background: T.gray100,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(pct, 100)}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color,
          minWidth: 38,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
function WorkerTable({ workersData: data }: { workersData: workersData[] }) {
  const rankColors = [T.amber, T.gray400, "#cd7f32"];
  const rankIcons = ["emoji_events", "military_tech", "workspace_premium"];

  return (
    <div
      style={{
        background: T.white,
        borderRadius: 20,
        border: `1px solid ${T.gray200}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        flex: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div
        style={{
          padding: "22px 28px",
          borderBottom: `1px solid ${T.gray100}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: T.gray900,
            }}
          >
            Top Performing Workers
          </div>
          <div style={{ fontSize: 13, color: T.gray400, marginTop: 2 }}>
            Ranked by efficiency and completed pickups
          </div>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: T.emeraldFaint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="leaderboard" size={20} style={{ color: T.emerald }} />
        </div>
      </div>
      <div style={{ overflowX: "auto", flex: 1 }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr style={{ background: T.gray50 }}>
              {["#", "Worker", "Zone", "Tasks", "Efficiency"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    fontSize: 10,
                    fontFamily: "'Outfit', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: T.gray400,
                    fontWeight: 700,
                    borderBottom: `1px solid ${T.gray100}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((w, idx) => {
              const worker = w.bestWorker;
              if (!worker) {
                return (
                  <tr
                    key={w.zoneId}
                    style={{ borderBottom: `1px solid ${T.gray100}` }}
                  >
                    <td
                      colSpan={5}
                      style={{
                        padding: "14px 20px",
                        color: T.gray400,
                        fontStyle: "italic",
                        fontSize: 13,
                      }}
                    >
                      {w.zoneName} — No worker data available
                    </td>
                  </tr>
                );
              }
              const rank = idx < 3 ? rankColors[idx] : null;
              return (
                <tr
                  key={w.zoneId}
                  className="worker-row"
                  style={{
                    borderBottom: `1px solid ${T.gray100}`,
                    cursor: "default",
                  }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    {rank ? (
                      <Icon
                        name={rankIcons[idx]}
                        size={20}
                        style={{ color: rank }}
                        fill={1}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                          color: T.gray300,
                        }}
                      >
                        #{idx + 1}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${T.emerald}, ${T.emeraldLight})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: 12,
                          color: "#fff",
                        }}
                      >
                        {getInitials(worker.name)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: T.gray900,
                            fontSize: 14,
                          }}
                        >
                          {worker.name}
                        </div>
                        <div style={{ fontSize: 11, color: T.gray400 }}>
                          {worker.vehicle || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      className="status-pill"
                      style={{ background: T.emeraldFaint, color: T.emerald }}
                    >
                      <Icon
                        name="location_on"
                        size={11}
                        style={{ color: T.emerald }}
                        fill={1}
                      />
                      {w.zoneName}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: T.gray900,
                        }}
                      >
                        {worker.completedTasks}
                      </span>
                      <span style={{ color: T.gray300, margin: "0 4px" }}>
                        /
                      </span>
                      <span style={{ color: T.gray400, fontSize: 13 }}>
                        {worker.totalTasks}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <EfficiencyBadge pct={worker.efficiency} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "14px 28px",
          borderTop: `1px solid ${T.gray100}`,
          background: T.gray50,
          textAlign: "center",
        }}
      >
        <button
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: T.emerald,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="open_in_new" size={15} style={{ color: T.emerald }} />
          View All Workers
        </button>
      </div>
    </div>
  );
}

function SystemActivity({ systemReport }: { systemReport: AuditLog[] }) {
  return (
    <div
      style={{
        background: T.white,
        borderRadius: 20,
        border: `1px solid ${T.gray200}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 280,
      }}
    >
      <div
        style={{
          padding: "22px 24px",
          borderBottom: `1px solid ${T.gray100}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: T.gray900,
            }}
          >
            System Activity
          </div>
          <div style={{ fontSize: 13, color: T.gray400, marginTop: 2 }}>
            Recent operational events
          </div>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: T.skyGhost,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="history" size={20} style={{ color: T.sky }} />
        </div>
      </div>

      <div
        style={{ padding: "8px 0", overflowY: "auto", flex: 1, maxHeight: 460 }}
      >
        {systemReport.map((log, i) => {
          const ac = actionConfig[log.action] ?? {
            icon: "info",
            color: T.gray400,
            bg: T.gray100,
          };
          const rc = roleConfig[log.userRole] ?? {
            color: T.gray400,
            bg: T.gray100,
          };
          return (
            <div
              key={log.auditId ?? i}
              style={{
                padding: "14px 24px",
                borderBottom:
                  i < systemReport.length - 1
                    ? `1px solid ${T.gray100}`
                    : "none",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: ac.bg,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Icon
                  name={ac.icon}
                  size={16}
                  style={{ color: ac.color }}
                  fill={1}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ fontWeight: 600, fontSize: 14, color: T.gray900 }}
                  >
                    {log.action}
                  </div>
                  <span
                    className="status-pill"
                    style={{
                      background:
                        log.status === "SUCCESS" ? T.emeraldGhost : T.roseGhost,
                      color: log.status === "SUCCESS" ? T.emerald : T.rose,
                      fontSize: 10,
                      flexShrink: 0,
                    }}
                  >
                    {log.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <span
                    className="status-pill"
                    style={{
                      background: rc.bg,
                      color: rc.color,
                      fontSize: 10,
                      padding: "2px 7px",
                    }}
                  >
                    {log.userRole}
                  </span>
                  {log.targetType && (
                    <span style={{ fontSize: 12, color: T.gray400 }}>
                      → {log.targetType}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: T.gray300,
                    marginTop: 6,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
            </div>
          );
        })}

        {systemReport.length === 0 && (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: T.gray300,
            }}
          >
            <Icon
              name="event_available"
              size={36}
              style={{ color: T.gray200 }}
            />
            <div style={{ marginTop: 8, fontSize: 13 }}>No recent activity</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportView() {
  const [timeRange] = useState("Last 30 Days");
  const [zone] = useState("All Zones");
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [data, setData] = useState<reportData>({});
  const [workersData, setWorkersData] = useState<workersData[]>([]);
  const [systemReport, setSystemReport] = useState<AuditLog[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportPoint[]>([]);

  useEffect(() => {
    setLoading(true);
    getSystemReport()
      .then((res) => {
        setData(res.responseData);
        setWorkersData(res.bestWorkersPerZone);
        setSystemReport(res.systemLogs);
        setWeeklyReport(res.weeklyreport);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const payload = {
        reportData: data,
        workersData: workersData,
        systemReport: systemReport,
        weeklyReport: weeklyReport,
        wasteItems: wasteItems,
        kpiCards: kpiCards,
        generatedAt: new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeRange: timeRange,
        zone: zone,
      };

      const response = await fetch("http://localhost:3000/admin/generate-pdf", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SmartWaste_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const wasteItems = [
    { label: "PET Plastic", pct: data.petPer ?? 0, color: T.chartGreen },
    { label: "Cardboard", pct: data.cardPer ?? 0, color: T.chartTeal },
    { label: "Paper", pct: data.paperPer ?? 0, color: T.chartBlue },
    { label: "Metal", pct: data.metalPer ?? 0, color: T.chartAmber },
    {
      label: "Non-Recyclable",
      pct: data.non_recyclePer ?? 0,
      color: T.chartRose,
    },
  ];

  const verifiedPct =
    data.verifiedPickups && data.totalRequests
      ? `${((parseInt(data.verifiedPickups) / parseInt(data.totalRequests)) * 100).toFixed(1)}%`
      : undefined;

  const kpiCards: KpiCardProps[] = [
    {
      label: "Total Requests",
      value: data.totalRequests,
      icon: "inbox",
      trend: { value: "+12.5%", dir: "up" },
      accent: "green",
    },
    {
      label: "Recyclable (kg)",
      value: data.recyclableWaste?.actualWeight,
      icon: "recycling",
      trend: { value: "+8.2%", dir: "up" },
      accent: "green",
    },
    {
      label: "Total Earnings",
      value: `Rs ${data.totalEarnings?.totalEarnings ?? "—"}`,
      icon: "payments",
      trend: { value: "+15.3%", dir: "up" },
      accent: "green",
      highlight: true,
    },
    {
      label: "Verified Pickups",
      value: verifiedPct,
      icon: "verified",
      trend: { value: "-1.2%", dir: "down" },
      accent: "rose",
    },
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: "group",
      trend: { value: "+5.4%", dir: "up" },
      accent: "violet",
    },
  ];

  return (
    <div className="sw-report">
      <style>{globalStyles}</style>

      <main
        className="page-main bg-white"
        style={{
          padding: "28px 32px",
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* SmartWaste branding accent */}
          {/* <div style={{ width: 48, height: 48, borderRadius: 14,
              background: `linear-gradient(135deg, ${T.emeraldDark}, ${T.emeraldLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 16px rgba(5,150,105,0.30)` }}>
              <Icon name="bar_chart" size={24} style={{ color: "#fff" }} fill={1} />
            </div>
            <div>
              <h1 className="display-font" style={{ fontSize: 22, fontWeight: 800,
                color: T.gray900, margin: 0, letterSpacing: "-0.02em" }}>
                Reports & Analytics
              </h1>
              <p style={{ fontSize: 13, color: T.gray400, margin: "3px 0 0" }}>
                Smart<span style={{ color: T.emerald, fontWeight: 700 }}>Waste</span> platform performance insights
              </p>
            </div> */}
        </div>

        {/* Filters */}
        <div
          className="filter-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {/* <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={selectStyle}>
              {["Last 30 Days", "Last 7 Days", "Today", "Custom Range..."].map((o) => <option key={o}>{o}</option>)}
            </select>

            <select value={zone} onChange={(e) => setZone(e.target.value)} style={selectStyle}>
              {["All Zones", "North District", "Downtown"].map((o) => <option key={o}>{o}</option>)}
            </select>

            <button style={{ background: T.white, border: `1px solid ${T.gray200}`, color: T.gray700,
              padding: "8px 16px", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <Icon name="tune" size={16} /> Filters
            </button> */}

          <button
            onClick={handleExportPDF}
            disabled={isExporting || loading}
            style={{
              background: T.emerald,
              border: "none",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: `0 3px 12px rgba(5,150,105,0.30)`,
            }}
          >
            <Icon name="download" size={16} style={{ color: "#fff" }} />
            {isExporting ? "Generating PDF..." : "Export"}
          </button>
        </div>

        <div className="kpi-grid fade-up fade-up-1">
          {kpiCards.map((card) => (
            <KpiCard key={card.label} {...card} loading={loading} />
          ))}
        </div>

        <div
          className="charts-row fade-up fade-up-2"
          style={{ display: "flex", gap: 24, flexWrap: "wrap" }}
        >
          <PickupActivityChart weeklyReport={weeklyReport} />
          <WasteCompositionChart wasteItems={wasteItems} />
        </div>

        <div
          className="bottom-row fade-up fade-up-3"
          style={{ display: "flex", gap: 24, flexWrap: "wrap" }}
        >
          <WorkerTable workersData={workersData} />
          <SystemActivity systemReport={systemReport} />
        </div>

        <div
          className="fade-up fade-up-4"
          style={{ textAlign: "center", padding: "8px 0 4px" }}
        >
          <span
            style={{
              fontSize: 12,
              color: T.gray300,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Smart<span style={{ color: T.emerald }}>Waste</span> Platform · Data
            refreshes every 24 hours
          </span>
        </div>
      </main>
    </div>
  );
}
