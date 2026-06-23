import React, { useState } from "react";
 
interface Task {
  createdAt: string;
  requestId: string;
  address: string;
  wasteType: string;
  actualWeight: number;
  condition: string;
  rateApplied: number;
  worker: {
    totalEarnings: number;
  };
}
 
interface HistoryTableProps {
  tasks: Task[];
}
 
const ITEMS_PER_PAGE = 10;
 
const conditionConfig = (condition: string) => {
  switch (condition) {
    case "PROPER":
      return {
        bg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        icon: "check_circle",
        dot: "bg-emerald-500",
      };
    case "MIXED":
      return {
        bg: "bg-amber-50 text-amber-700 border border-amber-100",
        icon: "warning",
        dot: "bg-amber-400",
      };
    case "CONTAMINATED":
      return {
        bg: "bg-red-50 text-red-700 border border-red-100",
        icon: "cancel",
        dot: "bg-red-500",
      };
    default:
      return {
        bg: "bg-gray-50 text-gray-500 border border-gray-200",
        icon: "help",
        dot: "bg-gray-400",
      };
  }
};
 
const wasteConfig = (type: string) => {
  const map: Record<string, { emoji: string; color: string }> = {
    PET: { emoji: "🧴", color: "bg-sky-50 text-sky-700 border border-sky-100" },
    PAPER: { emoji: "📄", color: "bg-yellow-50 text-yellow-700 border border-yellow-100" },
    CARDBOARD: { emoji: "📦", color: "bg-orange-50 text-orange-700 border border-orange-100" },
    METAL: { emoji: "🔩", color: "bg-slate-50 text-slate-600 border border-slate-200" },
    "NON-RECYCLABLE": { emoji: "🗑️", color: "bg-red-50 text-red-600 border border-red-100" },
  };
  return map[type] || { emoji: "♻️", color: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
};
 
const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={7}>
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[30px] text-gray-300">inbox</span>
        </div>
        <p className="text-gray-700 font-bold text-base">No tasks found</p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs leading-relaxed">
          Try adjusting your filters or search term.
        </p>
      </div>
    </td>
  </tr>
);
 
const HistoryTable: React.FC<HistoryTableProps> = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tasks.length / ITEMS_PER_PAGE));
  const paginated = tasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
 
  const getPageRange = (): (number | "...")[] => {
    const range: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        range.push(i);
      if (currentPage < totalPages - 2) range.push("...");
      range.push(totalPages);
    }
    return range;
  };
 
  const columns = ["Date & Time", "Task ID", "Address", "Waste Type", "Weight", "Condition", "Earnings"];
 
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Mobile card view ────────────────────────────────────────────── */}
      <div className="block md:hidden divide-y divide-gray-50">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px] text-gray-300">inbox</span>
            </div>
            <p className="text-gray-700 font-bold text-sm">No tasks found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          paginated.map((task, index) => {
            const cond = conditionConfig(task.condition);
            const waste = wasteConfig(task.wasteType);
            return (
              <div
                key={index}
                className="p-4 hover:bg-gray-50/60 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md inline-block mb-1">
                      {task.requestId}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
                      {task.address}
                    </p>
                  </div>
                  <p className="text-base font-black text-emerald-600 flex-shrink-0">
                    Rs {(task.rateApplied ?? 0).toLocaleString()}
                  </p>
                </div>
 
                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${waste.color}`}>
                    {waste.emoji} {task.wasteType}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${cond.bg}`}>
                    <span className="material-symbols-outlined text-[11px]">{cond.icon}</span>
                    {task.condition}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-100">
                    <span className="material-symbols-outlined text-[11px]">scale</span>
                    {task.actualWeight ?? 0} kg
                  </span>
                  <span className="ml-auto text-[11px] text-gray-400 font-medium">
                    {new Date(task.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
 
      {/* ── Desktop table view ───────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] whitespace-nowrap ${
                    i === 4 || i === 6 ? "text-right" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <EmptyState />
            ) : (
              paginated.map((task, index) => {
                const cond = conditionConfig(task.condition);
                const waste = wasteConfig(task.wasteType);
                return (
                  <tr
                    key={index}
                    className="hover:bg-emerald-50/20 transition-colors duration-100 group"
                  >
                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(task.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(task.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </td>
 
                    {/* Task ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1.5 rounded-lg">
                        {task.requestId}
                      </span>
                    </td>
 
                    {/* Address */}
                    <td className="px-5 py-4 max-w-[200px]">
                      <p
                        className="text-sm text-gray-600 truncate font-medium group-hover:text-gray-800 transition-colors"
                        title={task.address}
                      >
                        {task.address}
                      </p>
                    </td>
 
                    {/* Waste Type */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${waste.color}`}>
                        {waste.emoji} {task.wasteType}
                      </span>
                    </td>
 
                    {/* Weight */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-bold text-gray-700">
                        {task.actualWeight ?? 0}
                        <span className="text-xs font-normal text-gray-400 ml-0.5">kg</span>
                      </span>
                    </td>
 
                    {/* Condition */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cond.bg}`}>
                        <span className="material-symbols-outlined text-[12px]">{cond.icon}</span>
                        {task.condition}
                      </span>
                    </td>
 
                    {/* Earnings */}
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm font-black text-emerald-600">
                        Rs {(task.rateApplied ?? 0).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
 
      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {tasks.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/40">
          <p className="text-xs text-gray-400 order-2 sm:order-1">
            Showing{" "}
            <span className="font-bold text-gray-600">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, tasks.length)}
            </span>{" "}
            of <span className="font-bold text-gray-600">{tasks.length}</span> tasks
          </p>
 
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">chevron_left</span>
            </button>
 
            {getPageRange().map((page, i) =>
              page === "..." ? (
                <span
                  key={`dot-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none"
                >
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-150 ${
                    currentPage === page
                      ? "bg-emerald-600 text-white border border-emerald-600 shadow-sm shadow-emerald-200"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
 
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default HistoryTable;