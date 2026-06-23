import React from "react";
 
interface StatsPanelProps {
  totalTasks: number;
  totalEarnings: number;
  totalWeight: number;
  properRate: number;
}
 
interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  border: string;
  trend?: string;
}
 
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon,
  gradient,
  iconBg,
  iconColor,
  valueColor,
  border,
  trend,
}) => (
  <div
    className={`relative flex flex-col justify-between bg-white rounded-2xl border ${border} shadow-sm hover:shadow-md transition-all duration-200 p-5 overflow-hidden group`}
  >
    {/* Subtle gradient wash */}
    <div
      className={`absolute inset-0 opacity-[0.035] group-hover:opacity-[0.06] transition-opacity duration-300 ${gradient}`}
    />
 
    {/* Top row */}
    <div className="flex items-start justify-between mb-4 relative">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <span className={`material-symbols-outlined text-[22px] ${iconColor}`}>{icon}</span>
      </div>
      {trend && (
        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      )}
    </div>
 
    {/* Value */}
    <div className="relative">
      <p className={`text-2xl lg:text-3xl font-black tracking-tight ${valueColor} leading-none`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 font-medium mt-1.5">{sub}</p>
    </div>
 
    {/* Label at bottom */}
    <div className="relative mt-3 pt-3 border-t border-gray-50">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em]">{label}</p>
    </div>
  </div>
);
 
const StatsPanel: React.FC<StatsPanelProps> = ({
  totalTasks,
  totalEarnings,
  totalWeight,
  properRate,
}) => {
  const cards: StatCardProps[] = [
    {
      label: "Total Collected",
      value: totalTasks,
      sub: `${totalTasks === 1 ? "task" : "tasks"} completed`,
      icon: "inventory_2",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-gray-900",
      border: "border-emerald-100/80",
    },
    {
      label: "Earnings Generated",
      value: `Rs ${totalEarnings.toLocaleString()}`,
      sub: "lifetime earnings",
      icon: "payments",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-500",
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
      valueColor: "text-gray-900",
      border: "border-teal-100/80",
    },
    {
      label: "Total Weight",
      value: `${totalWeight} kg`,
      sub: "waste collected",
      icon: "scale",
      gradient: "bg-gradient-to-br from-sky-500 to-blue-500",
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      valueColor: "text-gray-900",
      border: "border-sky-100/80",
    },
    {
      label: "Quality Rate",
      value: `${properRate}%`,
      sub: "proper condition",
      icon: "verified",
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: properRate >= 80 ? "text-emerald-700" : properRate >= 50 ? "text-amber-700" : "text-red-600",
      border: "border-amber-100/80",
      trend: properRate >= 80 ? "Excellent" : properRate >= 50 ? "Average" : "Low",
    },
  ];
 
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};
 
export default StatsPanel;