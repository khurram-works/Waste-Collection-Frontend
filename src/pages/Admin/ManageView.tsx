import React, { useEffect, useState, useMemo } from "react";
import RequestDrawer from "./RequestDrawer";
import { manageRequests } from "../../api/auth";
import { Request, Worker, Route } from "../../Types/types";
const RECYCLABLE_TYPES = ["PET", "CARDBOARD", "PAPER", "METAL", "PLASTIC"];
 
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Pending"   },
  ASSIGNED:  { bg: "bg-sky-50",     text: "text-sky-700",     dot: "bg-sky-400",     label: "Assigned"  },
  COLLECTED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Collected" },
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  VERIFIED:  { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-500",    label: "Verified"  },
  PAID:      { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500",  label: "Paid"      },
  CANCELLED: { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-400",    label: "Cancelled" },
};
 
const TABS = [
  { key: "ALL",       label: "All"       },
  { key: "PENDING",   label: "Pending"   },
  { key: "ASSIGNED",  label: "Assigned"  },
  { key: "VERIFIED", label: "Verified" },
  { key: "CANCELLED", label: "Cancelled" },
];
 
const WASTE_OPTIONS = [
  { value: "",           label: "All Waste Types" },
  { value: "RECYCLABLE", label: "♻️  Recycling"   },
  { value: "LANDFILL",   label: "🗑️  Landfill"    },
];
 
const ZONE_OPTIONS = [
  "Zone A",
  "Zone B",
  "Zone C",
  "Zone D",
];
 
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400", label: status,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
      <span className={`size-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};
 
const WasteTypeBadge = ({ wasteType }: { wasteType: string }) => {
  const recyclable = RECYCLABLE_TYPES.includes(wasteType);
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
      recyclable ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
    }`}>
      {recyclable ? "♻️" : "🗑️"}
      {recyclable ? "Recycling" : "Landfill"}
    </span>
  );
};
 
const CitizenAvatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const palettes = [
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-amber-400 to-orange-400",
    "from-rose-400 to-pink-500",
  ];
  const gradient = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div className={`size-8 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
};
 
const SkeletonRow = () => (
  <tr className="border-b border-[#f0f4f2]">
    {[140, 100, 160, 200, 100, 90, 70].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div
          className="h-3.5 rounded-full bg-linear-to-r from-[#f0f4f2] via-[#e8edea] to-[#f0f4f2] animate-pulse"
          style={{ width: `${w}px`, maxWidth: "100%" }}
        />
      </td>
    ))}
  </tr>
);

const ManageView = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [drawerOpen, setDrawerOpen]           = useState(false);
  const [activeTab, setActiveTab]             = useState("ALL");
  const [searchQuery, setSearchQuery]         = useState("");
  const [wasteFilter, setWasteFilter]         = useState("");
  const [zoneFilter, setZoneFilter]           = useState("All Zones");
 
  const [dashboardData, setDashboardData] = useState<Request[]>([]);
  const [workersData, setWorkersData]     = useState<Worker[]>([]);
  const [routes, setRoutes]               = useState<Route[]>([]);
  const [loading, setLoading]             = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await manageRequests();
        setDashboardData(data.allRequests);
        setWorkersData(data.allWorkers);
        setRoutes(data.allroutes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const tabCounts = useMemo(
    () =>
      TABS.reduce((acc, tab) => {
        acc[tab.key] =
          tab.key === "ALL"
            ? dashboardData.length
            : dashboardData.filter((r) => r.status === tab.key).length;
        return acc;
      }, {} as Record<string, number>),
    [dashboardData],
  );
 
  const hasActiveFilters =
    searchQuery.trim() !== "" || wasteFilter !== "" || zoneFilter !== "All Zones";
 
  const clearFilters = () => {
    setSearchQuery("");
    setWasteFilter("");
    setZoneFilter("All Zones");
  };
 

  const filteredData = useMemo(() => {
    return dashboardData.filter((r) => {
      if (activeTab !== "ALL" && r.status !== activeTab) return false;
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const idStr      = String(r.requestId).toLowerCase();
        const nameStr    = (r.citizen?.name ?? "").toLowerCase();
        const addressStr = (r.address ?? "").toLowerCase();
        if (!idStr.includes(q) && !nameStr.includes(q) && !addressStr.includes(q)) return false;
      }
      if (wasteFilter === "RECYCLABLE" && !RECYCLABLE_TYPES.includes(r.wasteType)) return false;
      if (wasteFilter === "LANDFILL"   &&  RECYCLABLE_TYPES.includes(r.wasteType)) return false;
 
      return true;
    });
  }, [dashboardData, activeTab, searchQuery, wasteFilter]);
 
  if (loading) {
    return (
      <main className="flex-1 min-h-screen bg-[#f6f9f7] p-8">
        <div className="h-7 w-52 bg-[#e8edea] rounded-lg animate-pulse mb-1.5" />
        <div className="h-4 w-36 bg-[#f0f4f2] rounded-lg animate-pulse mb-7" />
        <div className="bg-white rounded-2xl border border-[#e4ebe7] shadow-sm overflow-hidden">
          <div className="h-12 bg-[#f6f9f7] border-b border-[#e4ebe7]" />
          <div className="h-14 bg-[#fafcfb] border-b border-[#f0f4f2]" />
          <table className="w-full">
            <tbody>{[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
          </table>
        </div>
      </main>
    );
  }
 
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#f6f9f7] overflow-hidden">
      <div className="p-6 xl:p-8 flex-1 overflow-y-auto space-y-5">
 
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#0d1f18] text-[22px] font-extrabold tracking-tight">
              Pickup Requests
            </h1>
            <p className="text-[13px] text-[#7a9e8a] mt-0.5 font-medium">
              {dashboardData.length} total ·{" "}
              <span className="text-amber-600 font-semibold">
                {tabCounts["PENDING"] ?? 0} need action
              </span>
            </p>
          </div>
        </div>
 
        <div className="bg-white rounded-2xl border border-[#e4ebe7] shadow-sm overflow-hidden">
          <div className="flex items-end gap-0.5 px-5 pt-4 border-b border-[#e4ebe7] overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              const count  = tabCounts[tab.key] ?? 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative flex items-center gap-2 px-4 pb-3 pt-1.5 text-[13px] font-semibold
                    whitespace-nowrap transition-all duration-150 rounded-t-lg
                    ${active
                      ? "text-[#2e8a57]"
                      : "text-[#9ab3a4] hover:text-[#4a6e5a] hover:bg-[#f6f9f7]"
                    }
                  `}
                >
                  {tab.label}
                  <span className={`
                    text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-5 text-center transition-colors
                    ${active
                      ? "bg-[#2e8a57] text-white"
                      : tab.key === "PENDING" && count > 0
                        ? "bg-amber-100 text-amber-600"
                        : "bg-[#f0f4f2] text-[#9ab3a4]"
                    }
                  `}>
                    {count}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2e8a57] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
 
          <div className="px-5 py-3 flex flex-wrap items-center gap-2.5 border-b border-[#f0f4f2] bg-[#fafcfb]">
 
            <div className={`
              flex items-center gap-2 h-9 px-3 rounded-xl bg-white border transition-all
              flex-1 min-w-50 max-w-sm
              ${searchQuery
                ? "border-[#2e8a57] ring-2 ring-[#2e8a57]/10"
                : "border-[#e2e8e4] hover:border-[#2e8a57]/40"
              }
            `}>
              <svg className="text-[#9ab3a4] shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, citizen name or address…"
                className="bg-transparent text-[13px] font-medium text-[#1a2e23] placeholder:text-[#b0c4ba] w-full focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-[#b0c4ba] hover:text-[#4a6e5a] transition-colors"
                  aria-label="Clear search"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
 
            {/* Waste type dropdown */}
            <div className="relative">
              <select
                value={wasteFilter}
                onChange={(e) => setWasteFilter(e.target.value)}
                className={`
                  appearance-none h-9 pl-3 pr-8 rounded-xl text-[13px] font-medium
                  bg-white border transition-all cursor-pointer focus:outline-none
                  ${wasteFilter
                    ? "border-[#2e8a57] ring-2 ring-[#2e8a57]/10 text-[#2e8a57]"
                    : "border-[#e2e8e4] text-[#4a6e5a] hover:border-[#2e8a57]/40"
                  }
                `}
              >
                {WASTE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ab3a4]" width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
 
            {/* Zone dropdown */}
            <div className="relative">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className={`
                  appearance-none h-9 pl-3 pr-8 rounded-xl text-[13px] font-medium
                  bg-white border transition-all cursor-pointer focus:outline-none
                  ${zoneFilter !== "All Zones"
                    ? "border-[#2e8a57] ring-2 ring-[#2e8a57]/10 text-[#2e8a57]"
                    : "border-[#e2e8e4] text-[#4a6e5a] hover:border-[#2e8a57]/40"
                  }
                `}
              >
                {ZONE_OPTIONS.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ab3a4]" width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
 
            {/* Clear filters pill — only visible when filters are active */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-bold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                Clear filters
              </button>
            )}
 
            <div className="flex-1" />
 
            <span className="text-[12px] text-[#9ab3a4] font-medium">
              {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
            </span>
 
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#6a8174] bg-white border border-[#e2e8e4] hover:border-[#2e8a57]/40 hover:text-[#2e8a57] transition-all">
              <span className="material-symbols-outlined text-[15px]">download</span>
              Export
            </button>
          </div>
 
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f6f9f7] border-b border-[#e4ebe7]">
                  {["Request ID", "Submitted", "Citizen", "Address / Zone", "Waste Type", "Status", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`px-5 py-3 text-[11px] font-extrabold text-[#7a9e8a] uppercase tracking-[0.08em] whitespace-nowrap ${i === 6 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center gap-3 py-20">
                        <div className="size-14 rounded-2xl bg-[#f0f4f2] flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#b0c4ba]">
                            <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 3L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M8 12H16M8 15.5H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-[14px] font-bold text-[#4a6e5a]">No requests found</p>
                          <p className="text-[12px] text-[#9ab3a4] mt-0.5">
                            {hasActiveFilters ? "Try adjusting your filters." : "No requests in this category yet."}
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="mt-2 text-[#2e8a57] text-[12px] font-bold hover:underline"
                            >
                              Clear all filters →
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((request) => (
                    <tr
                      key={request.requestId}
                      className="group border-b border-[#f0f4f2] hover:bg-[#fafcfb] transition-colors duration-100"
                    >
                      {/* Request ID */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-[11.5px] font-bold text-[#2e8a57] bg-[#2e8a57]/8 px-2.5 py-1 rounded-lg tracking-wide">
                          #{String(request.requestId)}
                        </span>
                      </td>
 
                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-[13px] font-semibold text-[#1a2e23]">
                          {new Date(request.requestDate).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short",
                          })}
                        </p>
                        <p className="text-[11px] text-[#9ab3a4] font-medium mt-0.5">
                          {new Date(request.requestDate).toLocaleTimeString("en-GB", {
                            hour: "2-digit", minute: "2-digit", hour12: true,
                          })}
                        </p>
                      </td>
 
                      {/* Citizen */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <CitizenAvatar name={request.citizen.name} />
                          <span className="text-[13px] font-semibold text-[#1a2e23] whitespace-nowrap">
                            {request.citizen.name}
                          </span>
                        </div>
                      </td>
 
                      {/* Address */}
                      <td className="px-5 py-4 max-w-45">
                        <p className="text-[13px] text-[#6a8174] truncate font-medium" title={request.address}>
                          {request.address}
                        </p>
                      </td>
 
                      {/* Waste Type */}
                      <td className="px-5 py-4">
                        <WasteTypeBadge wasteType={request.wasteType} />
                      </td>
 
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={request.status} />
                      </td>
 
                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setDrawerOpen(true);
                          }}
                          className="
                            inline-flex items-center gap-1.5 text-[12px] font-semibold
                            px-3 py-1.5 rounded-lg transition-all duration-150
                            text-[#7a9e8a] bg-white border border-[#e4ebe7]
                            group-hover:text-[#2e8a57] group-hover:border-[#2e8a57]/35 group-hover:bg-[#f6f9f7]
                          "
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
 
          {/* Table footer */}
          <div className="px-5 py-3 flex items-center justify-between border-t border-[#e4ebe7] bg-[#fafcfb]">
            <p className="text-[12px] text-[#9ab3a4] font-medium">
              Showing{" "}
              <span className="text-[#4a6e5a] font-bold">{filteredData.length}</span>
              {" "}of{" "}
              <span className="text-[#4a6e5a] font-bold">{dashboardData.length}</span>
              {" "}requests
            </p>
            {hasActiveFilters && (
              <p className="text-[12px] text-[#9ab3a4] font-medium">
                Filters active —{" "}
                <button onClick={clearFilters} className="text-[#2e8a57] font-bold hover:underline">
                  clear
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
 
      <RequestDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        workersData={workersData}
        routesData={routes}
      />
    </main>
  );
};
 
export default ManageView;