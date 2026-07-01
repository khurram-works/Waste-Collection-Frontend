import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getAuditLogs } from "../../api/auth";
import LogDetailDrawer from "./logDetailDrawer";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

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

const ACTION_CONFIG: Record<string, { label: string; icon: string; pill: string; dot: string }> = {
  LOGIN:  { label: "Login",  icon: "login",       pill: "bg-sky-50 text-sky-700 border border-sky-200 ring-sky-100",     dot: "bg-sky-400"    },
  LOGOUT: { label: "Logout", icon: "logout",      pill: "bg-slate-100 text-slate-600 border border-slate-200 ring-slate-50",  dot: "bg-slate-400"  },
  CREATE: { label: "Create", icon: "add_circle",  pill: "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-emerald-50", dot: "bg-emerald-500"},
  UPDATE: { label: "Update", icon: "edit",        pill: "bg-amber-50 text-amber-700 border border-amber-200 ring-amber-50",    dot: "bg-amber-400"  },
  DELETE: { label: "Delete", icon: "delete",      pill: "bg-red-50 text-red-700 border border-red-200 ring-red-50",       dot: "bg-red-400"    },
};

const ROLE_CONFIG: Record<string, { pill: string; avatar: string }> = {
  ADMIN:   { pill: "bg-violet-50 text-violet-700 border border-violet-200", avatar: "from-violet-500 to-purple-600" },
  WORKER:  { pill: "bg-teal-50 text-teal-700 border border-teal-200",       avatar: "from-teal-400 to-emerald-500" },
  CITIZEN: { pill: "bg-blue-50 text-blue-700 border border-blue-200",       avatar: "from-blue-400 to-sky-500"     },
};

const STATUS_CONFIG: Record<string, { pill: string; icon: string; dot: string }> = {
  SUCCESS: { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: "check_circle", dot: "bg-emerald-500" },
  FAILED:  { pill: "bg-red-50 text-red-600 border border-red-200",            icon: "cancel",       dot: "bg-red-500"     },
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
    relative: getRelativeTime(d),
  };
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function parseBrowser(ua: string | null): { name: string; icon: string } {
  if (!ua) return { name: "Unknown", icon: "devices" };
  if (ua.includes("Edg")) return { name: "Edge", icon: "language" };
  if (ua.includes("Firefox")) return { name: "Firefox", icon: "language" };
  if (ua.includes("Chrome")) return { name: "Chrome", icon: "language" };
  if (ua.includes("Safari")) return { name: "Safari", icon: "language" };
  if (ua.includes("Android")) return { name: "Android", icon: "android" };
  if (ua.includes("iPhone") || ua.includes("iPad")) return { name: "iOS", icon: "phone_iphone" };
  return { name: "Unknown", icon: "devices" };
}

function getInitials(userId: number): string {
  return `U${userId}`;
}

function StatCard({
  label,
  value,
  icon,
  gradient,
  delta,
}: {
  label: string;
  value: number;
  icon: string;
  gradient: string;
  delta?: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 ${gradient}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
          <p
            className="text-3xl font-black text-gray-900 leading-none"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {value.toLocaleString()}
          </p>
          {delta && (
            <p className="text-[11px] text-gray-400 font-medium mt-1.5">{delta}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${gradient}`}>
          <span
            className="material-symbols-outlined text-white text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-emerald-900 transition-colors ml-0.5"
        aria-label={`Remove ${label} filter`}
      >
        <span className="material-symbols-outlined text-[12px]">close</span>
      </button>
    </span>
  );
}

function EmptyState({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-gray-300 text-[30px]">
          {hasFilters ? "filter_alt_off" : "receipt_long"}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-600 mb-1">
        {hasFilters ? "No events match your filters" : "No audit events yet"}
      </p>
      <p className="text-xs text-gray-400 mb-4">
        {hasFilters
          ? "Try adjusting or clearing your active filters."
          : "System events will appear here as they occur."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-gray-100 rounded-lg" style={{ width: `${60 + (i * 7) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actFilter, setActFilter] = useState("ALL");
  const [statFilter, setStatFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searchRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getAuditLogs();
        setLogs(res?.auditLogs ?? []);
      } catch (err) {
        console.error("Error loading logs", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (roleFilter !== "ALL" && log.userRole !== roleFilter) return false;
      if (actFilter !== "ALL" && log.action !== actFilter) return false;
      if (statFilter !== "ALL" && log.status !== statFilter) return false;
      if (dateFrom && new Date(log.timestamp) < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(log.timestamp) > end) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = [
          String(log.userId),
          String(log.auditId),
          log.targetId ?? "",
          log.ipAddress ?? "",
          log.requestId ?? "",
          log.userRole,
          log.action,
          log.status,
          log.targetType,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [logs, roleFilter, actFilter, statFilter, dateFrom, dateTo, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, actFilter, statFilter, dateFrom, dateTo, pageSize]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setRoleFilter("ALL");
    setActFilter("ALL");
    setStatFilter("ALL");
    setDateFrom("");
    setDateTo("");
  }, []);

  const openDrawer = useCallback((log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const totalSuccess = logs.filter((l) => l.status === "SUCCESS").length;
  const totalFailed = logs.filter((l) => l.status === "FAILED").length;
  const adminActions = logs.filter((l) => l.userRole === "ADMIN").length;
  const failRate = logs.length > 0 ? ((totalFailed / logs.length) * 100).toFixed(1) : "0";

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (roleFilter !== "ALL") activeChips.push({ label: `Role: ${roleFilter}`, onRemove: () => setRoleFilter("ALL") });
  if (actFilter !== "ALL") activeChips.push({ label: `Action: ${actFilter}`, onRemove: () => setActFilter("ALL") });
  if (statFilter !== "ALL") activeChips.push({ label: `Status: ${statFilter}`, onRemove: () => setStatFilter("ALL") });
  if (dateFrom) activeChips.push({ label: `From: ${dateFrom}`, onRemove: () => setDateFrom("") });
  if (dateTo) activeChips.push({ label: `To: ${dateTo}`, onRemove: () => setDateTo("") });
  if (search.trim()) activeChips.push({ label: `Search: "${search}"`, onRemove: () => setSearch("") });

  const hasActiveFilters = activeChips.length > 0;
  function exportCSV() {
    const headers = ["Audit ID", "Timestamp", "User ID", "Role", "Action", "Status", "Target Type", "Target ID", "IP Address", "Browser", "Request ID"];
    const rows = filtered.map((l) => [
      l.auditId, l.timestamp, l.userId, l.userRole, l.action,
      l.status, l.targetType, l.targetId ?? "", l.ipAddress ?? "",
      parseBrowser(l.userAgent).name, l.requestId ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }


  function getPaginationPages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <>
      <LogDetailDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        log={selectedLog}
      />

      <div
        className="flex-1 overflow-auto bg-gray-50 min-h-screen"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/25">
                <span
                  className="material-symbols-outlined text-white text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  receipt_long
                </span>
              </div>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Audit Logs
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Complete forensic trail of all system events and user actions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 px-4 py-2 rounded-xl transition-all duration-150 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export CSV
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard
              label="Total Events"
              value={logs.length}
              icon="receipt_long"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              delta="All time"
            />
            <StatCard
              label="Successful"
              value={totalSuccess}
              icon="check_circle"
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
              delta={logs.length > 0 ? `${((totalSuccess / logs.length) * 100).toFixed(0)}% success rate` : "—"}
            />
            <StatCard
              label="Failed"
              value={totalFailed}
              icon="cancel"
              gradient="bg-gradient-to-br from-rose-500 to-red-600"
              delta={`${failRate}% failure rate`}
            />
            <StatCard
              label="Admin Actions"
              value={adminActions}
              icon="shield_person"
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
              delta="By admin users"
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setFiltersExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined text-emerald-600 text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  filter_alt
                </span>
                <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Filter & Search
                </span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                    {activeChips.length}
                  </span>
                )}
              </div>
              <span
                className={`material-symbols-outlined text-gray-400 text-[20px] transition-transform duration-200 ${
                  filtersExpanded ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            {filtersExpanded && (
              <div className="px-5 pb-5 border-t border-gray-50">
                <div className="relative mt-4 mb-4">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">
                    search
                  </span>
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by User ID, Audit ID, IP address, target…"
                    className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all placeholder:text-gray-400 font-medium"
                  />
                  {search && (
                    <button
                      onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <FilterDropdown
                    label="Role"
                    icon="manage_accounts"
                    value={roleFilter}
                    onChange={setRoleFilter}
                    options={[
                      { value: "ALL", label: "All Roles" },
                      { value: "ADMIN", label: "Admin" },
                      { value: "WORKER", label: "Worker" },
                      { value: "CITIZEN", label: "Citizen" },
                    ]}
                  />
                  <FilterDropdown
                    label="Action"
                    icon="bolt"
                    value={actFilter}
                    onChange={setActFilter}
                    options={[
                      { value: "ALL", label: "All Actions" },
                      { value: "LOGIN", label: "Login" },
                      { value: "LOGOUT", label: "Logout" },
                      { value: "CREATE", label: "Create" },
                      { value: "UPDATE", label: "Update" },
                      { value: "DELETE", label: "Delete" },
                    ]}
                  />
                  <FilterDropdown
                    label="Status"
                    icon="verified"
                    value={statFilter}
                    onChange={setStatFilter}
                    options={[
                      { value: "ALL", label: "All Statuses" },
                      { value: "SUCCESS", label: "Success" },
                      { value: "FAILED", label: "Failed" },
                    ]}
                  />
                  <DateInput label="From date" value={dateFrom} onChange={setDateFrom} />
                  <DateInput label="To date" value={dateTo} onChange={setDateTo} />
                </div>

                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active:</span>
                    {activeChips.map((chip) => (
                      <ActiveFilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} />
                    ))}
                    <button
                      onClick={resetFilters}
                      className="ml-auto text-xs font-bold text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-gray-500">
                  {isLoading
                    ? "Loading events…"
                    : filtered.length === 0
                    ? "No events found"
                    : `Showing ${Math.min((page - 1) * pageSize + 1, filtered.length)}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length.toLocaleString()} event${filtered.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 font-medium hidden sm:block">Rows:</span>
                <div className="flex items-center gap-1">
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => setPageSize(size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        pageSize === size
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {[
                      { label: "Timestamp",    width: "w-36" },
                      { label: "User",         width: "w-44" },
                      { label: "Action",       width: "w-32" },
                      { label: "Target",       width: "w-36" },
                      { label: "IP / Browser", width: "w-44" },
                      { label: "Status",       width: "w-28" },
                      { label: "",             width: "w-10" },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 ${col.width}`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState onReset={resetFilters} hasFilters={hasActiveFilters} />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((log) => (
                      <AuditTableRow
                        key={log.auditId}
                        log={log}
                        onOpen={openDrawer}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : paginated.length === 0 ? (
                <EmptyState onReset={resetFilters} hasFilters={hasActiveFilters} />
              ) : (
                paginated.map((log) => (
                  <AuditMobileCard key={log.auditId} log={log} onOpen={openDrawer} />
                ))
              )}
            </div>

            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/40">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  <span className="hidden sm:block">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {getPaginationPages().map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                          p === page
                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50 disabled:hover:bg-transparent"
                >
                  <span className="hidden sm:block">Next</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

function FilterDropdown({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const isActive = value !== "ALL";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-0.5 flex items-center gap-1">
        <span className="material-symbols-outlined text-[11px] text-gray-400">{icon}</span>
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none text-sm font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all cursor-pointer border ${
            isActive
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[16px] pointer-events-none">
          expand_more
        </span>
      </div>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isActive = !!value;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-0.5 flex items-center gap-1">
        <span className="material-symbols-outlined text-[11px] text-gray-400">calendar_today</span>
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`text-sm font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all border ${
          isActive
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
        }`}
      />
    </div>
  );
}

function AuditTableRow({
  log,
  onOpen,
}: {
  log: AuditLog;
  onOpen: (log: AuditLog) => void;
}) {
  const action = ACTION_CONFIG[log.action] || ACTION_CONFIG.LOGIN;
  const status = STATUS_CONFIG[log.status] || STATUS_CONFIG.SUCCESS;
  const role = ROLE_CONFIG[log.userRole] || ROLE_CONFIG.CITIZEN;
  const { date, time, relative } = formatTimestamp(log.timestamp);
  const browser = parseBrowser(log.userAgent);

  return (
    <tr
      className="group hover:bg-emerald-50/30 transition-colors duration-100 cursor-pointer"
      onClick={() => onOpen(log)}
    >
      <td className="px-5 py-3.5">
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-gray-800 font-mono">{date}</span>
          <span className="text-[11px] text-gray-400 font-mono">{time}</span>
          <span className="text-[10px] text-gray-300 mt-0.5">{relative}</span>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg bg-linear-to-br ${role.avatar} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <span className="text-white text-[11px] font-black">{getInitials(log.userId)}</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-800 leading-tight">UID‑{log.userId}</p>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${role.pill}`}>
              {log.userRole}
            </span>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${action.pill}`}
        >
          <span
            className="material-symbols-outlined text-[13px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {action.icon}
          </span>
          {log.action}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.targetType}</span>
          <span className="text-[12px] font-semibold text-gray-700 font-mono">{log.targetId ?? "—"}</span>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gray-300 text-[13px]">router</span>
            <span className="text-[12px] font-mono font-semibold text-gray-600">
              {log.ipAddress ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gray-300 text-[13px]">{browser.icon}</span>
            <span className="text-[11px] text-gray-400">{browser.name}</span>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${status.pill}`}
        >
          <span
            className="material-symbols-outlined text-[13px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {status.icon}
          </span>
          {log.status}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <span className="material-symbols-outlined text-gray-200 group-hover:text-emerald-500 transition-colors duration-150 text-[20px]">
          chevron_right
        </span>
      </td>
    </tr>
  );
}

function AuditMobileCard({
  log,
  onOpen,
}: {
  log: AuditLog;
  onOpen: (log: AuditLog) => void;
}) {
  const action = ACTION_CONFIG[log.action] || ACTION_CONFIG.LOGIN;
  const status = STATUS_CONFIG[log.status] || STATUS_CONFIG.SUCCESS;
  const role = ROLE_CONFIG[log.userRole] || ROLE_CONFIG.CITIZEN;
  const { date, time, relative } = formatTimestamp(log.timestamp);

  return (
    <div
      className="px-4 py-4 hover:bg-emerald-50/30 transition-colors cursor-pointer active:bg-emerald-50/50"
      onClick={() => onOpen(log)}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl bg-linear-to-br ${role.avatar} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <span className="text-white text-[12px] font-black">{getInitials(log.userId)}</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-800">UID‑{log.userId}</p>
            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${role.pill}`}>
              {log.userRole}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${status.pill}`}
          >
            <span
              className="material-symbols-outlined text-[11px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {status.icon}
            </span>
            {log.status}
          </span>
          <span className="material-symbols-outlined text-gray-300 text-[18px]">chevron_right</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${action.pill}`}
        >
          <span
            className="material-symbols-outlined text-[12px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {action.icon}
          </span>
          {log.action}
        </span>
        <span className="text-[11px] text-gray-400">
          {log.targetType}
          {log.targetId ? ` · ${log.targetId}` : ""}
        </span>
      </div>

      <p className="font-mono text-[10px] text-gray-400 mt-2 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[11px]">schedule</span>
        {date} {time}
        <span className="text-gray-300">·</span>
        {relative}
        <span className="text-gray-300">·</span>
        <span className="material-symbols-outlined text-[11px]">router</span>
        {log.ipAddress ?? "—"}
      </p>
    </div>
  );
}