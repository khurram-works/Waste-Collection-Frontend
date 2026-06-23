import React, { useEffect, useState, useMemo, useCallback } from "react";
import WithDrawDetails from "./withdrawalRequestDetailModal";
import { allWithdrawalRequests } from "../../api/auth";
import { allWithdrawalsData } from "../../Types/types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// ── Constants ────────────────────────────────────────────────────
const PAGE_SIZE = 10;

const statusOptions = [
  { name: "All Statuses", value: "ALL" },
  { name: "Pending",      value: "PENDING" },
  { name: "Approved",     value: "APPROVED" },
  { name: "Paid",         value: "PAID" },
  { name: "Rejected",     value: "REJECTED" },
];

// ── Formatters ───────────────────────────────────────────────────
const formatAmount = (amount: number) =>
  `Rs ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

const getInitials = (name: string) =>
  (name ?? "??")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Config maps ──────────────────────────────────────────────────
const payoutConfig: Record<string, { icon: string; colorClass: string; label: string }> = {
  EASYPAISA: {
    icon:       "smartphone",
    colorClass: "bg-blue-50 text-blue-700 border border-blue-100",
    label:      "EasyPaisa",
  },
  JAZZCASH: {
    icon:       "account_balance_wallet",
    colorClass: "bg-rose-50 text-rose-700 border border-rose-100",
    label:      "JazzCash",
  },
  BANK: {
    icon:       "account_balance",
    colorClass: "bg-slate-50 text-slate-700 border border-slate-200",
    label:      "Bank",
  },
};

const getPayoutConfig = (method: string) =>
  payoutConfig[method?.toUpperCase()] ?? {
    icon:       "payments",
    colorClass: "bg-gray-50 text-gray-700 border border-gray-200",
    label:      method ?? "Unknown",
  };

const statusConfig: Record<
  string,
  { pill: string; dotColor: string | null; label: string; rowClass: string; icon?: string }
> = {
  PENDING: {
    pill:      "bg-amber-50 text-amber-700 border border-amber-200",
    dotColor:  "bg-amber-400",
    label:     "Pending",
    rowClass:  "",
  },
  APPROVED: {
    pill:      "bg-sky-50 text-sky-700 border border-sky-200",
    dotColor:  "bg-sky-400",
    label:     "Approved",
    rowClass:  "",
  },
  PAID: {
    pill:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotColor:  null,
    icon:      "check_small",
    label:     "Paid",
    rowClass:  "opacity-70",
  },
  REJECTED: {
    pill:      "bg-red-50 text-red-700 border border-red-200",
    dotColor:  "bg-red-400",
    label:     "Rejected",
    rowClass:  "opacity-60",
  },
};

const getStatusConfig = (status: string) =>
  statusConfig[status?.toUpperCase()] ?? {
    pill:      "bg-gray-100 text-gray-600 border border-gray-200",
    dotColor:  "bg-gray-400",
    label:     status ?? "Unknown",
    rowClass:  "",
  };

// ── Stats ────────────────────────────────────────────────────────
function computeStats(data: allWithdrawalsData[]) {
  const now   = new Date();
  const month = now.getMonth();
  const year  = now.getFullYear();

  return {
    pending:     data.filter((d) => d.status === "PENDING").length,
    approved:    data.filter((d) => d.status === "APPROVED").length,
    // FIX: only count PAID entries from the current calendar month
    paid: data.filter((d) => {
      if (d.status !== "PAID") return false;
      const d2 = new Date(d.processedAt ?? d.createdAt);
      return d2.getMonth() === month && d2.getFullYear() === year;
    }).length,
    totalAmount: data.reduce((s, d) => s + Number(d.amount ?? 0), 0),
    totalCount:  data.length,
  };
}

// ── Stat Card ────────────────────────────────────────────────────
const StatCard = ({
  label, value, sub, subColor, icon, iconColor, accent,
}: {
  label:     string;
  value:     React.ReactNode;
  sub:       string;
  subColor:  string;
  icon:      string;
  iconColor: string;
  accent?:   boolean;
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between h-32 border transition-shadow hover:shadow-md ${
      accent
        ? "bg-gradient-to-br from-emerald-600 to-teal-700 border-transparent shadow-lg shadow-emerald-600/20"
        : "bg-white border-gray-100 shadow-sm"
    }`}
  >
    <span
      className={`absolute -right-3 -top-3 material-symbols-outlined text-8xl pointer-events-none select-none ${
        accent ? "text-white/10" : `${iconColor} opacity-[0.06]`
      }`}
      style={{ fontVariationSettings: "'FILL' 1" }}
    >
      {icon}
    </span>

    <p className={`text-[9px] font-bold uppercase tracking-[0.16em] ${accent ? "text-emerald-200" : "text-gray-400"}`}>
      {label}
    </p>

    <div>
      <div className={`text-2xl font-extrabold tracking-tight ${accent ? "text-white" : "text-gray-900"}`}>
        {value}
      </div>
      <p className={`text-[11px] mt-1 font-semibold ${accent ? "text-emerald-200" : subColor}`}>
        {sub}
      </p>
    </div>
  </div>
);

// ── Status Listbox ───────────────────────────────────────────────
// Extracted so the portal renders outside the overflow container, avoiding clipping.
const StatusListbox = ({
  value,
  onChange,
}: {
  value:    typeof statusOptions[number];
  onChange: (opt: typeof statusOptions[number]) => void;
}) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative sm:w-44">
      <ListboxButton
        className={clsx(
          "relative w-full flex items-center justify-between gap-2",
          "bg-gray-50 border border-gray-200 rounded-xl",
          "px-3 py-2.5 text-sm font-medium text-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400",
          "transition-all cursor-pointer hover:bg-white",
        )}
      >
        <span>{value.name}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
      </ListboxButton>

      {/* FIX: portal via `anchor` prop renders outside overflow — proper z-index + light-theme colors */}
      <ListboxOptions
        anchor="bottom start"
        transition
        className={clsx(
          "z-50 mt-1 w-44 rounded-xl border border-gray-200 bg-white shadow-lg p-1",
          "focus:outline-none",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
        )}
      >
        {statusOptions.map((opt) => (
          <ListboxOption
            key={opt.value}
            value={opt}
            className={clsx(
              "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer select-none",
              "text-sm text-gray-700",
              "data-[focus]:bg-emerald-50 data-[focus]:text-emerald-700",
            )}
          >
            <CheckIcon className="h-4 w-4 text-emerald-600 invisible group-data-[selected]:visible flex-shrink-0" />
            {opt.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </div>
  </Listbox>
);

// ── Main Component ───────────────────────────────────────────────
export default function WithdrawalRequests() {
  const [open,            setOpen]            = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<allWithdrawalsData | null>(null);
  const [withdrawals,     setWithdrawals]     = useState<allWithdrawalsData[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState("");
  const [statusFilter,    setStatusFilter]    = useState("ALL");
  const [currentPage,     setCurrentPage]     = useState(1);

  // ── Handlers ─────────────────────────────────────────────────
  const openModal = useCallback((req: allWithdrawalsData) => {
    setSelectedRequest(req);
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setSelectedRequest(null);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  }, []);

  // ── Fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await allWithdrawalRequests();
        // FIX: sort newest-first immediately after fetching
        const sorted = (res.allWithdrawalRequests ?? []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setWithdrawals(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const selectedOption =
    statusOptions.find((opt) => opt.value === statusFilter) ?? statusOptions[0];

  // ── Derived data ──────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      withdrawals.filter((w) => {
        const q           = search.toLowerCase();
        const matchSearch =
          !search ||
          `#WDL-${w.id}`.toLowerCase().includes(q) ||
          w.accountTitle?.toLowerCase().includes(q) ||
          w.accountNumber?.toLowerCase().includes(q) ||
          w.user?.name?.toLowerCase().includes(q) ||
          w.user?.email?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "ALL" || w.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [withdrawals, search, statusFilter],
  );

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const stats       = computeStats(withdrawals);
  const hasFilter   = search || statusFilter !== "ALL";

  // ── Pagination helpers ────────────────────────────────────────
  const goTo = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  /** Returns a compact page number array like [1, 2, "…", 7, 8, 9, "…", 15] */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (safePage > 3)        pages.push("…");
    for (let p = Math.max(2, safePage - 1); p <= Math.min(totalPages - 1, safePage + 1); p++) pages.push(p);
    if (safePage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="p-5 md:p-7 lg:p-9 space-y-7 min-h-screen bg-[#f7f8fa]">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="material-symbols-outlined text-emerald-600 text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Withdrawal Requests
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-7">
            Review, approve, and process citizen payout requests
          </p>
        </div>

        <button className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[17px]">download</span>
          Export CSV
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Pending Approvals"
          value={stats.pending}
          sub="⚠ Requires review"
          subColor="text-amber-500"
          icon="hourglass_empty"
          iconColor="text-amber-500"
        />
        <StatCard
          label="Approved / Ready"
          value={stats.approved}
          sub="↻ Awaiting transfer"
          subColor="text-sky-500"
          icon="task_alt"
          iconColor="text-sky-500"
        />
        <StatCard
          label="Paid This Month"
          value={stats.paid}
          sub="✓ Completed"
          subColor="text-emerald-600"
          icon="check_circle"
          iconColor="text-emerald-500"
        />
        <StatCard
          accent
          label="Total Requested"
          value={<span className="text-xl">{formatAmount(stats.totalAmount)}</span>}
          sub={`Across ${stats.totalCount} request${stats.totalCount !== 1 ? "s" : ""}`}
          subColor=""
          icon="payments"
          iconColor=""
        />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2.5 flex-1">

            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">
                search
              </span>
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none transition-all"
                placeholder="Search name, ID, account…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FIX: corrected Listbox with proper light-theme styling */}
            <StatusListbox
              value={selectedOption}
              onChange={(opt) => setStatusFilter(opt.value)}
            />
          </div>

          {hasFilter && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2.5 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              Clear
            </button>
          )}
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-400">
              <span className="material-symbols-outlined text-4xl animate-spin text-emerald-500">
                progress_activity
              </span>
              <p className="text-sm font-medium">Loading requests…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-400">
              <span className="material-symbols-outlined text-5xl text-gray-200">inbox</span>
              <p className="text-sm font-bold text-gray-600">No requests found</p>
              <p className="text-xs">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Request ID", "Citizen", "Amount", "Payout Method", "Status"].map(
                    (col, i) => (
                      <th
                        key={col}
                        className={`px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400 whitespace-nowrap ${
                          i === 2 ? "text-right" : ""
                        }`}
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((req) => {
                  const sc          = getStatusConfig(req.status);
                  const pc          = getPayoutConfig(req.paymentMethod);
                  const displayName = req.user?.name ?? req.accountTitle ?? `User #${req.userId}`;
                  const displaySub  = req.user?.email ?? req.accountNumber;
                  const last4       = req.accountNumber?.slice(-4) ?? "????";

                  return (
                    <tr
                      key={req.id}
                      onClick={() => openModal(req)}
                      className={`hover:bg-emerald-50/40 cursor-pointer transition-colors group ${sc.rowClass}`}
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
                          #WDL-{req.id}
                        </span>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {formatDate(req.createdAt)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-emerald-700 font-extrabold text-[11px] flex-shrink-0 shadow-sm">
                            {getInitials(displayName)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-gray-800 truncate">
                              {displayName}
                            </div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {displaySub}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="text-[13px] font-extrabold text-gray-900">
                          {formatAmount(req.amount)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${pc.colorClass}`}>
                          <span className="material-symbols-outlined text-[12px]">{pc.icon}</span>
                          {pc.label}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-1 font-mono">
                          {req.iban ? `IBAN •••• ${req.iban.slice(-4)}` : `**** ${last4}`}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${sc.pill}`}>
                          {sc.dotColor ? (
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dotColor} animate-pulse`} />
                          ) : (
                            <span
                              className="material-symbols-outlined text-[13px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {sc.icon ?? "check_small"}
                            </span>
                          )}
                          {sc.label}
                        </span>
                        {req.processedAt && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            {formatDate(req.processedAt)}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Mobile cards ── */}
        <div className="md:hidden divide-y divide-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2.5 text-gray-400">
              <span className="material-symbols-outlined animate-spin text-emerald-500">
                progress_activity
              </span>
              <span className="text-sm font-medium">Loading…</span>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <span className="material-symbols-outlined text-4xl text-gray-200">inbox</span>
              <p className="text-sm font-semibold text-gray-600">No requests found.</p>
            </div>
          ) : (
            paginated.map((req) => {
              const sc          = getStatusConfig(req.status);
              const pc          = getPayoutConfig(req.paymentMethod);
              const displayName = req.user?.name ?? req.accountTitle ?? `User #${req.userId}`;

              return (
                <div
                  key={req.id}
                  onClick={() => openModal(req)}
                  className="p-4 space-y-3 cursor-pointer active:bg-emerald-50/50 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-bold text-gray-900">
                          #WDL-{req.id}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.pill}`}>
                          {sc.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {formatDate(req.createdAt)}
                        {req.processedAt && (
                          <span className="ml-2 text-gray-300">
                            · Processed {formatDate(req.processedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-gray-900 flex-shrink-0">
                      {formatAmount(req.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-2.5 border-y border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-emerald-700 font-extrabold text-[11px] flex-shrink-0">
                        {getInitials(displayName)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-gray-800 truncate">
                          {displayName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${pc.colorClass}`}>
                            <span className="material-symbols-outlined text-[10px]">{pc.icon}</span>
                            {pc.label}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            **** {req.accountNumber?.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 text-[20px] flex-shrink-0">
                      chevron_right
                    </span>
                  </div>

                  {/* FIX: mobile quick-action buttons now call openModal on approve/reject */}
                  {req.status === "PENDING" && (
                    <div
                      className="flex gap-2 pt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openModal(req)}
                        className="flex-1 h-10 bg-emerald-500/10 text-emerald-700 font-bold rounded-xl text-[13px] flex items-center justify-center gap-1.5 hover:bg-emerald-500/20 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                        Approve
                      </button>
                      <button
                        onClick={() => openModal(req)}
                        className="flex-1 h-10 bg-red-500/10 text-red-600 font-bold rounded-xl text-[13px] flex items-center justify-center gap-1.5 hover:bg-red-500/20 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Pagination footer ── */}
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-2">
          <span className="text-[12px] text-gray-400 hidden sm:block">
            Showing{" "}
            <span className="font-bold text-gray-700">
              {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700">{filtered.length}</span>{" "}
            entries
          </span>

          <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-end">
            {/* Previous */}
            <button
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((p, idx) =>
                p === "…" ? (
                  <span key={`ellipsis-${idx}`} className="h-9 w-7 flex items-center justify-center text-gray-400 text-sm select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goTo(p as number)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      p === safePage
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                        : "border border-gray-200 text-gray-500 hover:bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            {/* Next */}
            <button
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === totalPages}
              className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <WithDrawDetails open={open} onClose={onClose} request={selectedRequest} />
    </div>
  );
}
