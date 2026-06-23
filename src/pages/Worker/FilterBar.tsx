import React, { useState } from "react";
 
export type WasteTypeFilter = "ALL" | "PET" | "PAPER" | "CARDBOARD" | "METAL" | "NON-RECYCLABLE";
export type ConditionFilter = "ALL" | "PROPER" | "MIXED" | "CONTAMINATED";
export type DatePreset = "ALL" | "TODAY" | "WEEK" | "MONTH" | "CUSTOM";
 
export interface FilterState {
  search: string;
  wasteType: WasteTypeFilter;
  condition: ConditionFilter;
  datePreset: DatePreset;
  dateFrom: string;
  dateTo: string;
}
 
interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
}
 
const wasteTypes: { value: WasteTypeFilter; label: string; emoji: string }[] = [
  { value: "ALL", label: "All Types", emoji: "🗂️" },
  { value: "PET", label: "PET Plastic", emoji: "🧴" },
  { value: "PAPER", label: "Paper", emoji: "📄" },
  { value: "CARDBOARD", label: "Cardboard", emoji: "📦" },
  { value: "METAL", label: "Metal", emoji: "🔩" },
  { value: "NON-RECYCLABLE", label: "Non-Recyclable", emoji: "🗑️" },
];
 
const conditions: { value: ConditionFilter; label: string; color: string; active: string }[] = [
  {
    value: "ALL",
    label: "All",
    color: "border-[#dde3e0] text-[#6a8174] bg-white hover:bg-[#f8faf9]",
    active: "border-[#121614] bg-[#121614] text-white",
  },
  {
    value: "PROPER",
    label: "Proper",
    color: "border-green-200 text-green-700 bg-green-50 hover:bg-green-100",
    active: "border-green-600 bg-green-600 text-white",
  },
  {
    value: "MIXED",
    label: "Mixed",
    color: "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100",
    active: "border-amber-500 bg-amber-500 text-white",
  },
  {
    value: "CONTAMINATED",
    label: "Contaminated",
    color: "border-red-200 text-red-700 bg-red-50 hover:bg-red-100",
    active: "border-red-500 bg-red-500 text-white",
  },
];
 
const datePresets: { value: DatePreset; label: string }[] = [
  { value: "ALL", label: "All Time" },
  { value: "TODAY", label: "Today" },
  { value: "WEEK", label: "This Week" },
  { value: "MONTH", label: "This Month" },
  { value: "CUSTOM", label: "Custom" },
];
 
const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, totalResults }) => {
  const [expanded, setExpanded] = useState(false);
 
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
 
  const activeFilterCount = [
    filters.search !== "",
    filters.wasteType !== "ALL",
    filters.condition !== "ALL",
    filters.datePreset !== "ALL",
  ].filter(Boolean).length;
 
  const handleReset = () =>
    onChange({
      search: "",
      wasteType: "ALL",
      condition: "ALL",
      datePreset: "ALL",
      dateFrom: "",
      dateTo: "",
    });
 
  return (
    <div className="bg-white rounded-2xl border border-[#dde3e0] shadow-sm mb-6 overflow-hidden">
      {/* Top bar: search + toggle */}
      <div className="flex items-center gap-3 p-4 border-b border-[#f0f4f2]">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9ab0a5] text-[20px] pointer-events-none">
            search
          </span>
          <input
            className="w-full pl-10 pr-10 py-2.5 bg-[#f8faf9] border border-[#e8edeb] rounded-xl text-sm text-[#121614] placeholder:text-[#9ab0a5] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            placeholder="Search by Task ID or address…"
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
          {filters.search && (
            <button
              onClick={() => update({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ab0a5] hover:text-[#121614] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
 
        {/* Filter toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            expanded || activeFilterCount > 0
              ? "bg-primary text-white border-primary"
              : "bg-[#f8faf9] text-[#6a8174] border-[#e8edeb] hover:border-[#c5d0cc]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white/30 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
 
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Reset
          </button>
        )}
      </div>
 
      {/* Expanded filters */}
      {expanded && (
        <div className="p-4 flex flex-col gap-5 bg-[#fafcfb]">
          {/* Date preset pills */}
          <div>
            <p className="text-xs font-bold text-[#6a8174] uppercase tracking-widest mb-2.5">
              Date Range
            </p>
            <div className="flex flex-wrap gap-2">
              {datePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => update({ datePreset: preset.value })}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    filters.datePreset === preset.value
                      ? "bg-[#121614] text-white border-[#121614]"
                      : "bg-white text-[#6a8174] border-[#dde3e0] hover:border-[#b0bdb8]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
 
            {/* Custom date pickers */}
            {filters.datePreset === "CUSTOM" && (
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex-1 min-w-36">
                  <p className="text-xs font-medium text-[#9ab0a5] mb-1.5">From</p>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => update({ dateFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#dde3e0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex-1 min-w-36">
                  <p className="text-xs font-medium text-[#9ab0a5] mb-1.5">To</p>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => update({ dateTo: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#dde3e0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>
 
          {/* Condition filter */}
          <div>
            <p className="text-xs font-bold text-[#6a8174] uppercase tracking-widest mb-2.5">
              Condition
            </p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => update({ condition: c.value })}
                  className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
                    filters.condition === c.value ? c.active : c.color
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
 
          {/* Waste Type filter */}
          <div>
            <p className="text-xs font-bold text-[#6a8174] uppercase tracking-widest mb-2.5">
              Waste Type
            </p>
            <div className="flex flex-wrap gap-2">
              {wasteTypes.map((w) => (
                <button
                  key={w.value}
                  onClick={() => update({ wasteType: w.value })}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    filters.wasteType === w.value
                      ? "bg-[#121614] text-white border-[#121614]"
                      : "bg-white text-[#6a8174] border-[#dde3e0] hover:border-[#b0bdb8]"
                  }`}
                >
                  <span>{w.emoji}</span>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
 
      {/* Result count footer */}
      <div className="px-4 py-2.5 bg-[#f8faf9] border-t border-[#f0f4f2] flex items-center justify-between">
        <p className="text-xs text-[#9ab0a5]">
          Showing{" "}
          <span className="font-bold text-[#3d5a4a]">{totalResults}</span> result
          {totalResults !== 1 ? "s" : ""}
        </p>
        {activeFilterCount > 0 && (
          <p className="text-xs text-primary font-semibold">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
          </p>
        )}
      </div>
    </div>
  );
};
 
export default FilterBar;