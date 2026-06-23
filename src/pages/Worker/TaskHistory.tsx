import React, { useState, useEffect, useMemo } from "react";
import { tasksHistory } from "../../api/auth";
import StatsPanel from "./StatsPanel";
import FilterBar, { FilterState } from "./FilterBar";
import HistoryTable from "./HistoryTable";
 
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
 
const DEFAULT_FILTERS: FilterState = {
  search: "",
  wasteType: "ALL",
  condition: "ALL",
  datePreset: "ALL",
  dateFrom: "",
  dateTo: "",
};
 
const getPresetDateRange = (preset: string): { from: Date | null; to: Date | null } => {
  const now = new Date();
  switch (preset) {
    case "TODAY": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { from: start, to: now };
    }
    case "WEEK": {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return { from: start, to: now };
    }
    case "MONTH": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: start, to: now };
    }
    default:
      return { from: null, to: null };
  }
};
 
const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`rounded-2xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse ${className}`} />
);
 
const TaskHistory: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksHistory();
        setTasks(data.history || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
 
  const stats = useMemo(() => {
    const totalWeight = tasks.reduce((sum, t) => sum + Number(t.actualWeight || 0), 0);
    const totalEarnings = tasks.length > 0 ? (tasks[0].worker?.totalEarnings ?? 0) : 0;
    const properCount = tasks.filter((t) => t.condition === "PROPER").length;
    const properRate =
      tasks.length > 0 ? Math.round((properCount / tasks.length) * 100) : 0;
    return { totalWeight, totalEarnings, properRate };
  }, [tasks]);
 
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !String(task.requestId ?? "").toLowerCase().includes(q) &&
          !String(task.address ?? "").toLowerCase().includes(q)
        )
          return false;
      }
 
      if (filters.wasteType !== "ALL" && task.wasteType !== filters.wasteType)
        return false;
 
      if (filters.condition !== "ALL" && task.condition !== filters.condition)
        return false;
 
      const taskDate = new Date(task.createdAt);
      if (filters.datePreset !== "ALL" && filters.datePreset !== "CUSTOM") {
        const { from, to } = getPresetDateRange(filters.datePreset);
        if (from && taskDate < from) return false;
        if (to && taskDate > to) return false;
      } else if (filters.datePreset === "CUSTOM") {
        if (filters.dateFrom && taskDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (taskDate > toDate) return false;
        }
      }
 
      return true;
    });
  }, [tasks, filters]);
 
  /* ── Loading skeleton ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="flex-1 p-5 md:p-8 lg:p-10 min-h-screen bg-[#f0f4f2]">
        {/* Page header skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <SkeletonBlock className="w-9 h-9" />
          <SkeletonBlock className="w-48 h-7" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
          {[...Array(4)].map((_, i) => (
            <SkeletonBlock key={i} className="h-32" />
          ))}
        </div>
        {/* Filter skeleton */}
        <SkeletonBlock className="h-14 mb-6" />
        {/* Table skeleton */}
        <SkeletonBlock className="h-96" />
      </main>
    );
  }
 
  /* ── Main render ──────────────────────────────────────────────────────── */
  return (
    <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-x-hidden bg-[#f0f4f2] min-h-screen">
      {/* Page header */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/25">
            <span className="material-symbols-outlined text-white text-[18px]">history</span>
          </div>
          <div>
            <h1 className="text-gray-900 text-2xl md:text-[1.6rem] font-black tracking-tight leading-none">
              Task History
            </h1>
            <p className="text-gray-400 text-xs font-medium mt-0.5">
              Review your collection performance and earnings
            </p>
          </div>
        </div>
      </div>
 
      {/* Stats */}
      <StatsPanel
        totalTasks={tasks.length}
        totalEarnings={stats.totalEarnings}
        totalWeight={stats.totalWeight}
        properRate={stats.properRate}
      />
 
      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalResults={filteredTasks.length}
      />
 
      {/* Table */}
      <HistoryTable tasks={filteredTasks} />
    </main>
  );
};
 
export default TaskHistory;