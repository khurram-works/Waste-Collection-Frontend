import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { allTransactions } from "../../Types/types";

function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
 
function formatAmount(amount: number | string, type: string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const prefix = type === "CREDIT" ? "+" : "−";
  return `${prefix}Rs ${num.toLocaleString("en-PK")}`;
}
 
function getSubtitle(tx: allTransactions): string | null {
  if (tx.request) {
    const weight = tx.request.actualWeight ?? tx.request.estimatedWeight;
    return weight
      ? `${tx.request.wasteType}  ·  ${weight} kg`
      : tx.request.wasteType || null;
  }
  if (tx.withdrawal) {
    const method = tx.withdrawal.paymentMethod.replace(/_/g, " ");
    return `${method}  ·  ${tx.withdrawal.accountTitle}`;
  }
  return null;
}
 
type StatusStyle = { dot: string; text: string; bg: string; label: string };
 
const STATUS: Record<string, StatusStyle> = {
  SUCCESS:    { dot: "bg-emerald-500", text: "text-emerald-700",  bg: "bg-emerald-50",  label: "Completed"  },
  PENDING:    { dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",    label: "Pending"    },
  AUTHORIZED: { dot: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50",   label: "Authorized" },
  FAILED:     { dot: "bg-red-500",     text: "text-red-600",     bg: "bg-red-50",      label: "Failed"     },
  REFUNDED:   { dot: "bg-orange-400",  text: "text-orange-700",  bg: "bg-orange-50",   label: "Refunded"   },
};
 
const SOURCE_ICON: Record<string, string> = {
  PICKUP:     "recycling",
  WITHDRAWAL: "account_balance",
  TRANSFER:   "swap_horiz",
  REFUND:     "undo",
};
 
const SOURCE_ACCENT: Record<string, string> = {
  PICKUP:     "bg-emerald-50 text-emerald-600",
  WITHDRAWAL: "bg-slate-100 text-slate-500",
  TRANSFER:   "bg-blue-50 text-blue-500",
  REFUND:     "bg-orange-50 text-orange-500",
};
 
const TABS = ["All", "Earnings", "Withdrawals"] as const;
type Tab = (typeof TABS)[number];
 
const TAB_FILTERS: Record<Tab, (tx: allTransactions) => boolean> = {
  All:         () => true,
  Earnings:    (tx) => tx.type === "CREDIT",
  Withdrawals: (tx) => tx.type === "DEBIT",
};
 
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drawerIn {
    from { transform: translateX(100%); opacity: 0.6; }
    to   { transform: translateX(0); opacity: 1; }
  }
`;
 
function TransactionCard({
  tx,
  index,
}: {
  tx: allTransactions;
  index: number;
}) {
  const status = STATUS[tx.transactionStatus] ?? STATUS["PENDING"];
  const icon   = SOURCE_ICON[tx.sourceType] ?? "receipt_long";
  const accent = SOURCE_ACCENT[tx.sourceType] ?? "bg-slate-100 text-slate-500";
  const subtitle = getSubtitle(tx);
  const isCredit = tx.type === "CREDIT";
 
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-sm transition-all duration-200 group"
      style={{
        animation: "cardIn 0.25s ease both",
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${accent}`}
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold text-slate-800 leading-snug truncate font-['DM_Sans',sans-serif]">
              {tx.description}
            </p>
            <span
              className={`text-[13px] font-bold flex-shrink-0 font-['DM_Mono',monospace] ${
                isCredit ? "text-emerald-600" : "text-slate-600"
              }`}
            >
              {formatAmount(tx.amount, tx.type)}
            </span>
          </div>
 
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5 font-['DM_Sans',sans-serif]">
              {subtitle}
            </p>
          )}
 
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-50">
            <span className="text-[11px] text-slate-400 font-['DM_Mono',monospace] tracking-wide">
              {formatDate(tx.createdAt)}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
              {status.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default function TaskHistoryDrawer({
  open,
  onClose,
  transactions,
  totalwithdrawn
}: {
  open: boolean;
  onClose: () => void;
  transactions: allTransactions[];
  totalwithdrawn: number;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [animKey, setAnimKey]     = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
 
  const filtered = transactions.filter(TAB_FILTERS[activeTab]);
 
  const moveIndicator = (tab: Tab) => {
    const idx = TABS.indexOf(tab);
    const el  = tabRefs.current[idx];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  };
 
  useEffect(() => { moveIndicator("All"); }, []);
  useEffect(() => { moveIndicator(activeTab); }, [activeTab]);
 
  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setAnimKey((k) => k + 1);
  };
 
  const totalEarned = transactions
    .filter((t) => t.type === "CREDIT" && t.transactionStatus === "SUCCESS")
    .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);
 
  // const totalWithdrawn = transactions
  //   .filter((t) => t.type === "DEBIT" && t.transactionStatus === "SUCCESS")
  //   .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);

  // totalwithdrawn = totalWithdrawn;
 
  return (
    <>
      <style>{STYLES}</style>
 
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
 
        <div className="fixed inset-0 flex justify-end font-['DM_Sans',sans-serif]">
          <DialogPanel
            transition
            className="w-full max-w-[28rem] bg-slate-50 h-full shadow-2xl flex flex-col transform transition duration-300 ease-in-out data-closed:translate-x-full"
          >
            <div className="px-6 pt-6 pb-5 bg-white border-b border-slate-100">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-[18px] font-bold text-slate-900 leading-tight">
                    Transaction History
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} total
                  </p>
                </div>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-500 mb-1">
                    Total Earned
                  </p>
                  <p className="text-[16px] font-bold text-emerald-700 font-['DM_Mono',monospace]">
                    +Rs {totalEarned.toLocaleString("en-PK")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">
                    Total Withdrawn
                  </p>
                  <p className="text-[16px] font-bold text-slate-700 font-['DM_Mono',monospace]">
                    −Rs {totalwithdrawn.toLocaleString("en-PK")}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex gap-1 px-6 pt-3 pb-0 bg-white border-b border-slate-100">
              {TABS.map((tab, idx) => {
                const count  = transactions.filter(TAB_FILTERS[tab]).length;
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    ref={(el) => { tabRefs.current[idx] = el; }}
                    onClick={() => handleTabChange(tab)}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-colors duration-150 ${
                      active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                        active
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
              <div
                className="absolute bottom-0 h-[2px] bg-slate-900 rounded-full transition-all duration-300"
                style={{
                  left:  indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl text-slate-300">
                      receipt_long
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold text-slate-500">No transactions found</p>
                  <p className="text-[12px] text-slate-400 mt-1">
                    {activeTab === "Earnings" ? "No earnings recorded yet" : "No withdrawals made yet"}
                  </p>
                </div>
              ) : (
                <div className="relative pl-6">
                  <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-200" />
 
                  <div key={animKey} className="space-y-3">
                    {filtered.map((tx, index) => {
                      const dotColor =
                        (STATUS[tx.transactionStatus] ?? STATUS["PENDING"]).dot;
                      return (
                        <div key={tx.transactionId} className="relative flex gap-3 items-start">
                          {/* Timeline dot */}
                          <div className="absolute -left-6 mt-[18px] w-6 flex justify-center z-10">
                            <div
                              className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${dotColor}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <TransactionCard tx={tx} index={index} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[12px] text-slate-400">
                {filtered.length} of {transactions.length} shown
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-[13px] font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}