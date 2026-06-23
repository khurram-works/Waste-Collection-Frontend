import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCitizenData } from "../../api/auth";
interface RecentPickupRequest {
  requestId: number;
  wasteType: string;
  requestDate: string;
  status: string;
}
 
interface CitizenData {
  totalEarnings: number;
  pendingPickups: number;
  completedThisMonth: number;
  recentPickupRequests: RecentPickupRequest[];
}

const STATUS_CONFIG: Record<
  string,
  {
    bg: string;
    text: string;
    ring: string;
    dot: string;
    glow: string;
    label: string;
  }
> = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200/80",
    dot: "bg-amber-400",
    glow: "shadow-amber-100",
    label: "Pending",
  },
  ASSIGNED: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200/80",
    dot: "bg-sky-400",
    glow: "shadow-sky-100",
    label: "Assigned",
  },
  COLLECTED: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200/80",
    dot: "bg-violet-400",
    glow: "shadow-violet-100",
    label: "Collected",
  },
  VERIFIED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200/80",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-100",
    label: "Verified",
  },
  PAID: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    ring: "ring-teal-200/80",
    dot: "bg-teal-400",
    glow: "shadow-teal-100",
    label: "Paid",
  },
  CANCELLED: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    ring: "ring-rose-200/80",
    dot: "bg-rose-400",
    glow: "shadow-rose-100",
    label: "Cancelled",
  },
};
 
const WASTE_ICONS: Record<string, string> = {
  PET: "water_drop",
  CARDBOARD: "deployed_code",
  GLASS: "local_bar",
  PLASTIC: "recycling",
  METAL: "hardware",
  PAPER: "description",
};
 
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  iconColor: string;
  sub: React.ReactNode;
  delay?: string;
}
 
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  gradientFrom,
  gradientTo,
  iconBg,
  iconColor,
  sub,
  delay = "0ms",
}) => (
  <div
    className="group relative flex flex-col gap-4 rounded-2xl bg-white p-6 overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    style={{ animationDelay: delay }}
  >
    <div
      className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-t-2xl`}
    />
    <div
      className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-[0.06] blur-xl pointer-events-none group-hover:opacity-[0.10] transition-opacity duration-500`}
    />
    <div className="flex items-center justify-between relative">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400">
        {label}
      </p>
      <div
        className={`w-9 h-9 flex items-center justify-center rounded-xl ${iconBg} group-hover:scale-105 transition-transform duration-300`}
      >
        <span className={`material-symbols-outlined text-[19px] ${iconColor}`}>
          {icon}
        </span>
      </div>
    </div>
    <p className="text-[2rem] font-extrabold tracking-tight text-gray-900 leading-none relative">
      {value}
    </p>
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 relative">
      {sub}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl bg-white border border-gray-100 p-6 space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-2.5 w-20 rounded-full bg-gray-100" />
      <div className="w-9 h-9 rounded-xl bg-gray-100" />
    </div>
    <div className="h-8 w-28 rounded-lg bg-gray-100" />
    <div className="h-2.5 w-36 rounded-full bg-gray-100" />
  </div>
);

const CitizenDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<CitizenData | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    (async () => {
      try {
        const data = await getCitizenData();
        setDashboardData(data.citizenData);
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);
  if (loading) {
    return (
      <div className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="h-7 w-32 rounded-lg bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 h-52 animate-pulse" />
        <div className="rounded-2xl bg-white border border-gray-100 h-72 animate-pulse" />
      </div>
    );
  }
 
  if (!dashboardData) return null;
 
  const hasRequests = dashboardData.recentPickupRequests?.length > 0;
 
  return (
    <div className="min-h-full bg-[#f7faf8] p-5 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-600">
                Overview
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
              Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Here's your recycling activity at a glance.
            </p>
          </div>
          <button
            onClick={() => navigate("/citizen/request")}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.97] transition-all duration-200 self-start shrink-0"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
            }}
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            New Pickup
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Earnings"
            value={
              <span>
                <span className="text-lg font-bold text-gray-400 mr-1">Rs</span>
                {dashboardData.totalEarnings.toLocaleString()}
              </span>
            }
            icon="payments"
            gradientFrom="from-emerald-400"
            gradientTo="to-teal-500"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            delay="0ms"
            sub={
              <>
                <span className="material-symbols-outlined text-emerald-400 text-[13px]">
                  trending_up
                </span>
                <span className="text-emerald-500 font-semibold">+0%</span>
                <span>vs last month</span>
              </>
            }
          />
          <StatCard
            label="Pending Pickups"
            value={dashboardData.pendingPickups}
            icon="pending_actions"
            gradientFrom="from-amber-400"
            gradientTo="to-orange-400"
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
            delay="60ms"
            sub={
              <>
                <span className="material-symbols-outlined text-gray-300 text-[13px]">
                  schedule
                </span>
                Awaiting collection
              </>
            }
          />
          <StatCard
            label="Completed This Month"
            value={dashboardData.completedThisMonth}
            icon="verified"
            gradientFrom="from-teal-400"
            gradientTo="to-cyan-500"
            iconBg="bg-teal-50"
            iconColor="text-teal-600"
            delay="120ms"
            sub={
              <>
                <span className="material-symbols-outlined text-gray-300 text-[13px]">
                  flag
                </span>
                <span className="font-semibold text-gray-500">
                  {dashboardData.completedThisMonth}
                </span>
                &nbsp;pickups this month
              </>
            }
          />
        </div>
 
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-40 blur-2xl" />
            <div className="absolute top-4 right-32 w-20 h-20 rounded-full bg-emerald-100 opacity-30 blur-xl" />
          </div>
           <div className="relative flex flex-col lg:flex-row items-stretch">
            <div
              className="w-full lg:w-72 min-h-52 bg-center bg-cover bg-no-repeat shrink-0 relative"
              style={{ backgroundImage: 'url("/waste.png")' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white lg:to-white/90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent lg:hidden" />
            </div>
            <div className="flex flex-col justify-center gap-5 p-7 lg:p-10 relative">
              <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full text-emerald-700 ring-1 ring-emerald-200 bg-emerald-50">
                <span className="material-symbols-outlined text-[12px]">eco</span>
                Ready to recycle?
              </span>
 
              <div className="space-y-2">
                <h3 className="text-[1.55rem] font-extrabold text-gray-900 leading-snug tracking-tight">
                  Submit a pickup &amp; start
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #10b981, #0d9488)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    earning rewards
                  </span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                  We collect PET plastic, cardboard, and glass. Schedule at your
                  convenience and track every step in real time.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { icon: "water_drop", label: "PET" },
                  { icon: "deployed_code", label: "Cardboard" },
                  { icon: "inventory_2", label: "Metal" },
                  {icon:"insert_drive_file",label:"Paper"}
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-white/80 border border-gray-200 px-2.5 py-1 rounded-full"
                  >
                    <span className="material-symbols-outlined text-[12px] text-emerald-500">
                      {icon}
                    </span>
                    {label}
                  </span>
                ))}
              </div>
 
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/citizen/request")}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-[0.97] transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add_circle
                  </span>
                  Submit a Request
                </button>
                <button
                  onClick={() => navigate("/citizen/status")}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50/80 active:scale-[0.97] transition-all duration-200"
                >
                  View past requests
                  <span className="material-symbols-outlined text-[14px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[15px] font-extrabold text-gray-900 tracking-tight">
                Recent Pickup Requests
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                Your latest activity
              </p>
            </div>
            <button
              onClick={() => navigate("/citizen/status")}
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-2 shrink-0 transition-colors"
            >
              View all
              <span className="material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
            </button>
          </div>
          {!hasRequests ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-300 text-[32px]">
                    inbox
                  </span>
                </div>
                <div className="absolute -inset-1 rounded-[18px] bg-gradient-to-br from-emerald-200 to-teal-200 opacity-20 blur-md -z-10" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">
                  No requests yet
                </p>
                <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                  Submit your first pickup request to start earning rewards and
                  tracking your environmental impact.
                </p>
              </div>
              <button
                onClick={() => navigate("/citizen/request")}
                className="inline-flex items-center gap-2 mt-1 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-[0.97] transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                }}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New Request
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#f7faf8] border-b border-gray-100">
                      {[
                        "Request ID",
                        "Waste Type",
                        "Date Submitted",
                        "Status",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3.5 text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentPickupRequests.map(
                      (req: RecentPickupRequest, idx) => {
                        const status =
                          STATUS_CONFIG[req.status] ?? {
                            bg: "bg-gray-50",
                            text: "text-gray-500",
                            ring: "ring-gray-200/80",
                            dot: "bg-gray-300",
                            glow: "shadow-gray-100",
                            label: req.status,
                          };
                        const wasteIcon =
                          WASTE_ICONS[req.wasteType?.toUpperCase()] ??
                          "recycling";
                        const isLast =
                          idx ===
                          dashboardData.recentPickupRequests.length - 1;
 
                        return (
                          <tr
                            key={req.requestId}
                            className={[
                              "group hover:bg-emerald-50/30 transition-colors duration-150 cursor-default",
                              !isLast ? "border-b border-gray-50" : "",
                            ].join(" ")}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-mono text-gray-300 select-none">
                                  #
                                </span>
                                <span className="text-sm font-bold text-gray-700 font-mono tracking-wide">
                                  {req.requestId}
                                </span>
                              </div>
                            </td>
 
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100/80">
                                  <span className="material-symbols-outlined text-emerald-400 text-[14px]">
                                    {wasteIcon}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600 font-semibold">
                                  {req.wasteType}
                                </span>
                              </div>
                            </td>
 
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-400 font-medium tabular-nums">
                                {new Date(req.requestDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </td>
 
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={[
                                  "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[11px] font-bold ring-1",
                                  status.bg,
                                  status.text,
                                  status.ring,
                                ].join(" ")}
                              >
                                
                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                  {["PENDING", "ASSIGNED"].includes(
                                    req.status
                                  ) && (
                                    <span
                                      className={`absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-60 animate-ping`}
                                    />
                                  )}
                                  <span
                                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.dot}`}
                                  />
                                </span>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
 
          
              <div className="px-6 py-3 bg-[#f7faf8]/70 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-600">
                    {dashboardData.recentPickupRequests.length}
                  </span>{" "}
                  most recent requests
                </p>
                <button
                  onClick={() => navigate("/citizen/status")}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-2 transition-colors"
                >
                  Full history →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default CitizenDashboardView;