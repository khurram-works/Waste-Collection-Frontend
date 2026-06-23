// import React, { useState, useEffect } from "react";
// import TaskHistoryDrawer from "./taskHistoryDrawer";
// import WithdrawalModal from "./withdrawal";
// import { transactionHistory } from "../../api/auth";
// import { useAuthContext } from "../../context/authContext";
// import { allTransactions, UserBalance } from "../../Types/types";
 
// /* ─── Font import ─────────────────────────────────────────────── */
// const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');`;
 
// /* ─── Status config ───────────────────────────────────────────── */
// const statusConfig: Record<
//   string,
//   { dot: string; pill: string; icon: string; label: string }
// > = {
//   PENDING: {
//     dot: "bg-amber-400",
//     pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
//     icon: "schedule",
//     label: "Pending",
//   },
//   AUTHORIZED: {
//     dot: "bg-violet-500",
//     pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
//     icon: "checklist",
//     label: "Authorized",
//   },
//   SUCCESS: {
//     dot: "bg-emerald-500",
//     pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
//     icon: "check_circle",
//     label: "Completed",
//   },
//   FAILED: {
//     dot: "bg-red-500",
//     pill: "bg-red-50 text-red-600 ring-1 ring-red-200",
//     icon: "cancel",
//     label: "Failed",
//   },
//   REFUNDED: {
//     dot: "bg-orange-400",
//     pill: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
//     icon: "currency_exchange",
//     label: "Refunded",
//   },
// };
 
// /* ─── Skeleton row ────────────────────────────────────────────── */
// const SkeletonRow = ({ delay = 0 }: { delay?: number }) => (
//   <tr
//     className="animate-pulse"
//     style={{ animationDelay: `${delay}ms` }}
//   >
//     {[40, 60, 30, 20, 25, 28].map((w, i) => (
//       <td key={i} className="px-6 py-4">
//         <div
//           className="h-3 bg-slate-200 rounded-full"
//           style={{ width: `${w}%` }}
//         />
//       </td>
//     ))}
//   </tr>
// );
 
// /* ─── Stat card ───────────────────────────────────────────────── */
// const StatCard = ({
//   icon,
//   label,
//   value,
//   accent,
//   delay,
// }: {
//   icon: string;
//   label: string;
//   value: string | number;
//   accent: string;
//   delay: number;
// }) => (
//   <div
//     className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
//     style={{
//       animation: "fadeUp 0.4s ease both",
//       animationDelay: `${delay}ms`,
//     }}
//   >
//     <div
//       className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
//     >
//       <span
//         className="material-symbols-outlined text-[20px]"
//         style={{ fontVariationSettings: "'FILL' 1" }}
//       >
//         {icon}
//       </span>
//     </div>
//     <div className="min-w-0">
//       <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1">
//         {label}
//       </p>
//       <p className="text-[22px] font-bold text-slate-900 leading-none tracking-tight font-['DM_Sans',sans-serif]">
//         Rs {value}
//       </p>
//     </div>
//   </div>
// );
 
// /* ─── Main component ──────────────────────────────────────────── */
// const CitizenEarningsView = () => {
//   const { user } = useAuthContext();
//   const [open, setOpen] = useState(false);
//   const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
//   const [transactions, setTransactions] = useState<allTransactions[]>([]);
//   const [Balance, setBalance] = useState<UserBalance | null>(null);
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     const getTransactions = async () => {
//       try {
//         const res = await transactionHistory(user.userId);
//         setTransactions(res.transaction);
//         setBalance(res.userBalance);
//       } catch (error) {
//         console.log("Error fetching transactions", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getTransactions();
//   }, []);
 
//   return (
//     <>
//       <style>{FONTS}</style>
//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -400px 0; }
//           100% { background-position: 400px 0; }
//         }
//         .wallet-card-bg {
//           background: linear-gradient(135deg, #0d2818 0%, #163824 50%, #0f3322 100%);
//         }
//         .wallet-card-pattern {
//           background-image: radial-gradient(circle at 80% 20%, rgba(52,211,153,0.08) 0%, transparent 50%),
//                             radial-gradient(circle at 10% 80%, rgba(16,185,129,0.06) 0%, transparent 50%);
//         }
//       `}</style>
 
//       <main className="flex-1 overflow-y-auto bg-gray-100 font-['DM_Sans',sans-serif]">
//         <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8">
 
//           {/* ── Page header ── */}
//           <div
//             style={{ animation: "fadeUp 0.35s ease both", animationDelay: "0ms" }}
//           >
//             <h1 className="text-[28px] md:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
//               Earnings Wallet
//             </h1>
//             <p className="text-sm text-slate-500 mt-1 font-medium">
//               Track your rewards and manage withdrawals.
//             </p>
//           </div>
 
//           {/* ── Hero wallet card ── */}
//           <div
//             className="wallet-card-bg wallet-card-pattern rounded-3xl overflow-hidden relative"
//             style={{ animation: "fadeUp 0.4s ease both", animationDelay: "60ms" }}
//           >
//             {/* Decorative ring */}
//             <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-emerald-700/20 pointer-events-none" />
//             <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-emerald-600/15 pointer-events-none" />
 
//             <div className="relative px-7 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
//                     <div className="w-2 h-2 rounded-full bg-emerald-400" />
//                   </div>
//                   <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300/90">
//                     Available Balance
//                   </span>
//                 </div>
 
//                 {loading ? (
//                   <div className="h-14 w-56 bg-white/5 rounded-xl animate-pulse" />
//                 ) : (
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-[13px] font-medium text-white/60 mb-1 self-start mt-3">
//                       Rs
//                     </span>
//                     <span className="text-[56px] md:text-[64px] font-black text-white leading-none tracking-tight font-['DM_Sans',sans-serif]">
//                       {Balance?.availableBalance ?? "—"}
//                     </span>
//                   </div>
//                 )}
 
//                 <p className="text-[13px] text-white/50 mt-3 font-medium">
//                   From verified waste pickups
//                 </p>
//               </div>
 
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button
//                   onClick={() => setIsWithdrawalOpen(true)}
//                   className="group bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-sm py-3.5 px-7 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
//                 >
//                   <span
//                     className="material-symbols-outlined text-[18px] group-hover:rotate-[-8deg] transition-transform"
//                     style={{ fontVariationSettings: "'FILL' 1" }}
//                   >
//                     account_balance
//                   </span>
//                   Withdraw Funds
//                 </button>
//                 <button
//                   onClick={() => setOpen(true)}
//                   className="bg-white/8 hover:bg-white/14 border border-white/12 text-white/80 hover:text-white font-semibold text-sm py-3.5 px-7 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm"
//                 >
//                   <span
//                     className="material-symbols-outlined text-[18px]"
//                     style={{ fontVariationSettings: "'FILL' 0" }}
//                   >
//                     history
//                   </span>
//                   All Transactions
//                 </button>
//               </div>
//             </div>
//           </div>
 
//           {/* ── Stat cards ── */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {loading ? (
//               [0, 1, 2].map((i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-2xl border border-slate-200 p-5 h-[82px] animate-pulse"
//                 />
//               ))
//             ) : (
//               <>
//                 <StatCard
//                   icon="payments"
//                   label="Total Earnings"
//                   value={Balance?.totalEarnings ?? "—"}
//                   accent="bg-emerald-50 text-emerald-600"
//                   delay={120}
//                 />
//                 <StatCard
//                   icon="arrow_upward"
//                   label="Total Withdrawn"
//                   value={Balance?.pendingBalance ?? "—"}
//                   accent="bg-slate-100 text-slate-500"
//                   delay={160}
//                 />
//                 <StatCard
//                   icon="account_balance_wallet"
//                   label="Available Balance"
//                   value={Balance?.availableBalance ?? "—"}
//                   accent="bg-emerald-50 text-emerald-600"
//                   delay={200}
//                 />
//               </>
//             )}
//           </div>
 
//           {/* ── Transaction table ── */}
//           <div
//             className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
//             style={{ animation: "fadeUp 0.4s ease both", animationDelay: "240ms" }}
//           >
//             {/* Table header */}
//             <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
//               <div>
//                 <h2 className="text-[16px] font-bold text-slate-900">
//                   Recent Transactions
//                 </h2>
//                 {!loading && (
//                   <p className="text-[12px] text-slate-500 mt-0.5">
//                     {transactions.length} record{transactions.length !== 1 ? "s" : ""} found
//                   </p>
//                 )}
//               </div>
//               <button
//                 onClick={() => setOpen(true)}
//                 className="group flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
//               >
//                 View all
//                 <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
//                   arrow_forward
//                 </span>
//               </button>
//             </div>
 
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200">
//                     {["Date", "Description", "Waste Type", "Weight", "Amount", "Status"].map(
//                       (h, i) => (
//                         <th
//                           key={h}
//                           className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ${
//                             i === 4 ? "text-right" : i === 5 ? "text-center" : ""
//                           }`}
//                         >
//                           {h}
//                         </th>
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {loading ? (
//                     [0, 1, 2, 3, 4].map((i) => (
//                       <SkeletonRow key={i} delay={i * 60} />
//                     ))
//                   ) : transactions.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="px-6 py-16 text-center">
//                         <span className="material-symbols-outlined text-4xl text-slate-300 block mb-3">
//                           receipt_long
//                         </span>
//                         <p className="text-[13px] text-slate-500 font-medium">
//                           No transactions yet
//                         </p>
//                       </td>
//                     </tr>
//                   ) : (
//                     transactions.map((tx, index) => {
//                       const cfg = statusConfig[tx.transactionStatus] ?? statusConfig["PENDING"];
//                       const isCredit = tx.type === "CREDIT";
//                       return (
//                         <tr
//                           key={index}
//                           className="hover:bg-slate-50 transition-colors duration-150 group"
//                           style={{
//                             animation: "fadeUp 0.3s ease both",
//                             animationDelay: `${index * 40}ms`,
//                           }}
//                         >
//                           {/* Date */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="text-[12px] font-['DM_Mono',monospace] text-slate-700">
//                               {new Date(tx.createdAt).toLocaleDateString("en-GB", {
//                                 day: "numeric",
//                                 month: "short",
//                               })}
//                             </span>
//                             <span className="block text-[11px] text-slate-500 font-['DM_Mono',monospace]">
//                               {new Date(tx.createdAt).toLocaleTimeString("en-GB", {
//                                 hour: "numeric",
//                                 minute: "2-digit",
//                                 hour12: true,
//                               })}
//                             </span>
//                           </td>
 
//                           {/* Description */}
//                           <td className="px-6 py-4">
//                             <span className="text-[13px] font-semibold text-slate-800">
//                               {tx.description}
//                             </span>
//                           </td>
 
//                           {/* Waste type */}
//                           <td className="px-6 py-4">
//                             {tx.request?.wasteType ? (
//                               <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
//                                 {tx.request.wasteType}
//                               </span>
//                             ) : (
//                               <span className="text-slate-400 text-[13px]">—</span>
//                             )}
//                           </td>
 
//                           {/* Weight */}
//                           <td className="px-6 py-4">
//                             {tx.request?.actualWeight != null ? (
//                               <span className="text-[13px] font-semibold text-slate-700">
//                                 {tx.request.actualWeight}
//                                 <span className="text-[11px] font-normal text-slate-500 ml-1">
//                                   kg
//                                 </span>
//                               </span>
//                             ) : (
//                               <span className="text-slate-400 text-[13px]">—</span>
//                             )}
//                           </td>
 
//                           {/* Amount */}
//                           <td className="px-6 py-4 text-right">
//                             <span
//                               className={`text-[14px] font-bold font-['DM_Mono',monospace] ${
//                                 isCredit ? "text-emerald-600" : "text-slate-700"
//                               }`}
//                             >
//                               {isCredit ? "+" : "-"}Rs {tx.amount}
//                             </span>
//                           </td>
 
//                           {/* Status */}
//                           <td className="px-6 py-4 text-center">
//                             <span
//                               className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${cfg.pill}`}
//                             >
//                               <span
//                                 className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
//                               />
//                               {cfg.label}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
 
//             {/* Table footer */}
//             {!loading && transactions.length > 0 && (
//               <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
//                 <p className="text-[12px] text-slate-500">
//                   Showing {Math.min(transactions.length, 10)} of {transactions.length} transactions
//                 </p>
//                 <button
//                   onClick={() => setOpen(true)}
//                   className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
//                 >
//                   View full history →
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
 
//       <TaskHistoryDrawer
//         open={open}
//         onClose={() => setOpen(false)}
//         transactions={transactions}
//       />
//       <WithdrawalModal
//         open={isWithdrawalOpen}
//         onClose={() => setIsWithdrawalOpen(false)}
//         availableBalance={Number(Balance?.availableBalance) || 0}
//       />
//     </>
//   );
// };
 
// export default CitizenEarningsView;


import React, { useState, useEffect } from "react";
import TaskHistoryDrawer from "./taskHistoryDrawer";
import WithdrawalModal from "./withdrawal";
import { transactionHistory } from "../../api/auth";
import { useAuthContext } from "../../context/authContext";
import { allTransactions, UserBalance } from "../../Types/types";
 
/* ─── Font import ─────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');`;
 
/* ─── Status config ───────────────────────────────────────────── */
const statusConfig: Record<
  string,
  { dot: string; pill: string; icon: string; label: string }
> = {
  PENDING: {
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: "schedule",
    label: "Pending",
  },
  AUTHORIZED: {
    dot: "bg-violet-500",
    pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    icon: "checklist",
    label: "Authorized",
  },
  SUCCESS: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: "check_circle",
    label: "Completed",
  },
  FAILED: {
    dot: "bg-red-500",
    pill: "bg-red-50 text-red-600 ring-1 ring-red-200",
    icon: "cancel",
    label: "Failed",
  },
  REFUNDED: {
    dot: "bg-orange-400",
    pill: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    icon: "currency_exchange",
    label: "Refunded",
  },
};
 
/* ─── Skeleton row ────────────────────────────────────────────── */
const SkeletonRow = ({ delay = 0 }: { delay?: number }) => (
  <tr
    className="animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    {[40, 60, 30, 20, 25, 28].map((w, i) => (
      <td key={i} className="px-6 py-4">
        <div
          className="h-3 bg-slate-200 rounded-full"
          style={{ width: `${w}%` }}
        />
      </td>
    ))}
  </tr>
);
 
/* ─── Stat card ───────────────────────────────────────────────── */
const StatCard = ({
  icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: string;
  label: string;
  value: string | number;
  accent: string;
  delay: number;
}) => (
  <div
    className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    style={{
      animation: "fadeUp 0.4s ease both",
      animationDelay: `${delay}ms`,
    }}
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-[22px] font-bold text-slate-900 leading-none tracking-tight font-['DM_Sans',sans-serif]">
        Rs {value}
      </p>
    </div>
  </div>
);
 
/* ─── Main component ──────────────────────────────────────────── */
const CitizenEarningsView = () => {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [transactions, setTransactions] = useState<allTransactions[]>([]);
  const [Balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await transactionHistory(user.userId);
        setTransactions(res.transaction);
        setBalance(res.userBalance);
      } catch (error) {
        console.log("Error fetching transactions", error);
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, []);

  const totalWithdrawn = transactions
  .filter(tx => tx.type === "DEBIT" && tx.transactionStatus === "SUCCESS")
  .reduce((sum, tx) => sum + parseFloat(String(tx.amount)), 0);

  const totalwithdrawn = totalWithdrawn.toLocaleString("en-PK")
 
  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wallet-card {
          background: linear-gradient(140deg, #0d2318 0%, #163d26 45%, #0f2e1e 100%);
          position: relative;
          overflow: hidden;
        }
        .wallet-card-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 55% at 90% 5%,  rgba(52,211,153,0.16) 0%, transparent 65%),
            radial-gradient(ellipse 45% 40% at 0%  95%, rgba(16,185,129,0.12) 0%, transparent 55%);
        }
        .wallet-card-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .wallet-ring {
          position: absolute; border-radius: 9999px; pointer-events: none;
          border: 1.5px solid rgba(110,231,183,0.18);
        }
        .wallet-balance-label {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;
        }
        .wallet-balance-label span {
          font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: #6ee7b7;
        }
        .wallet-balance-label .dot-ring {
          width: 20px; height: 20px; border-radius: 9999px;
          background: rgba(110,231,183,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .wallet-balance-label .dot-core {
          width: 8px; height: 8px; border-radius: 9999px; background: #6ee7b7;
        }
        .wallet-rs {
          font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.70);
          align-self: flex-start; margin-top: 14px;
        }
        .wallet-amount {
          font-size: 60px; font-weight: 900; color: #ffffff;
          line-height: 1; letter-spacing: -2px;
        }
        .wallet-subtitle {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.55); margin-top: 12px;
        }
        .btn-primary-card {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; padding: 14px 28px; border-radius: 12px;
          background: #34d399; color: #052e16;
          font-size: 14px; font-weight: 700; border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(16,185,129,0.45);
          transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-primary-card:hover  { background: #6ee7b7; box-shadow: 0 4px 28px rgba(16,185,129,0.60); }
        .btn-primary-card:active { transform: scale(0.96); }
        .btn-ghost-card {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; padding: 13px 28px; border-radius: 12px;
          background: rgba(255,255,255,0.10);
          border: 1.5px solid rgba(255,255,255,0.35);
          color: #ffffff; font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .btn-ghost-card:hover  { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.55); }
        .btn-ghost-card:active { transform: scale(0.96); }
        .skeleton-balance {
          height: 64px; width: 220px; border-radius: 12px;
          background: rgba(255,255,255,0.08); animation: pulse 1.5s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
 
      <main className="flex-1 overflow-y-auto bg-gray-100 font-['DM_Sans',sans-serif]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8">
 
          {/* ── Page header ── */}
          <div
            style={{ animation: "fadeUp 0.35s ease both", animationDelay: "0ms" }}
          >
            <h1 className="text-[28px] md:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
              Earnings Wallet
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Track your rewards and manage withdrawals.
            </p>
          </div>
 
          {/* ── Hero wallet card ── */}
          <div
            className="wallet-card rounded-3xl"
            style={{ animation: "fadeUp 0.4s ease both", animationDelay: "60ms" }}
          >
            {/* Layered visual effects */}
            <div className="wallet-card-glow" />
            <div className="wallet-card-dots" />
 
            {/* Decorative rings */}
            <div className="wallet-ring" style={{ width: 300, height: 300, top: -100, right: -100 }} />
            <div className="wallet-ring" style={{ width: 190, height: 190, top: -50, right: -50, borderColor: "rgba(110,231,183,0.15)" }} />
 
            {/* Card content */}
            <div className="relative px-7 py-9 md:px-10 md:py-11 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                {/* Label */}
                <div className="wallet-balance-label">
                  <div className="dot-ring"><div className="dot-core" /></div>
                  <span>Available Balance</span>
                </div>
 
                {/* Amount */}
                {loading ? (
                  <div className="skeleton-balance" />
                ) : (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span className="wallet-rs">Rs</span>
                    <span className="wallet-amount font-['DM_Sans',sans-serif]">
                      {Balance?.availableBalance ?? "—"}
                    </span>
                  </div>
                )}
 
                <p className="wallet-subtitle">From verified waste pickups</p>
              </div>
 
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-primary-card" onClick={() => setIsWithdrawalOpen(true)}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
                  >
                    account_balance
                  </span>
                  Withdraw Funds
                </button>
                <button className="btn-ghost-card" onClick={() => setOpen(true)}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, fontVariationSettings: "'FILL' 0" }}
                  >
                    history
                  </span>
                  All Transactions
                </button>
              </div>
            </div>
          </div>
 
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 h-[82px] animate-pulse"
                />
              ))
            ) : (
              <>
                <StatCard
                  icon="payments"
                  label="Total Earnings"
                  value={Balance?.totalEarnings ?? "—"}
                  accent="bg-emerald-50 text-emerald-600"
                  delay={120}
                />
                <StatCard
                  icon="arrow_upward"
                  label="Total Withdrawn"
                  value={totalwithdrawn ?? "—"}
                  accent="bg-slate-100 text-slate-500"
                  delay={160}
                />
                <StatCard
                  icon="account_balance_wallet"
                  label="Available Balance"
                  value={Balance?.availableBalance ?? "—"}
                  accent="bg-emerald-50 text-emerald-600"
                  delay={200}
                />
              </>
            )}
          </div>
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            style={{ animation: "fadeUp 0.4s ease both", animationDelay: "240ms" }}
          >
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">
                  Recent Transactions
                </h2>
                {!loading && (
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    {transactions.length} record{transactions.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>
              <button
                onClick={() => setOpen(true)}
                className="group flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View all
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
 
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Date", "Description", "Waste Type", "Weight", "Amount", "Status"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ${
                            i === 4 ? "text-right" : i === 5 ? "text-center" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    [0, 1, 2, 3, 4].map((i) => (
                      <SkeletonRow key={i} delay={i * 60} />
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 block mb-3">
                          receipt_long
                        </span>
                        <p className="text-[13px] text-slate-500 font-medium">
                          No transactions yet
                        </p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, index) => {
                      const cfg = statusConfig[tx.transactionStatus] ?? statusConfig["PENDING"];
                      const isCredit = tx.type === "CREDIT";
                      return (
                        <tr
                          key={index}
                          className="hover:bg-slate-50 transition-colors duration-150 group"
                          style={{
                            animation: "fadeUp 0.3s ease both",
                            animationDelay: `${index * 40}ms`,
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-[12px] font-['DM_Mono',monospace] text-slate-700">
                              {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span className="block text-[11px] text-slate-500 font-['DM_Mono',monospace]">
                              {new Date(tx.createdAt).toLocaleTimeString("en-GB", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-semibold text-slate-800">
                              {tx.description}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {tx.request?.wasteType ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                {tx.request.wasteType}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[13px]">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {tx.request?.actualWeight != null ? (
                              <span className="text-[13px] font-semibold text-slate-700">
                                {tx.request.actualWeight}
                                <span className="text-[11px] font-normal text-slate-500 ml-1">
                                  kg
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[13px]">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className={`text-[14px] font-bold font-['DM_Mono',monospace] ${
                                isCredit ? "text-emerald-600" : "text-slate-700"
                              }`}
                            >
                              {isCredit ? "+" : "-"}Rs {tx.amount}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${cfg.pill}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                              />
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
 
            {!loading && transactions.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">
                  Showing {Math.min(transactions.length, 10)} of {transactions.length} transactions
                </p>
                <button
                  onClick={() => setOpen(true)}
                  className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View full history →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
 
      <TaskHistoryDrawer
        open={open}
        onClose={() => setOpen(false)}
        transactions={transactions}
        totalwithdrawn={totalWithdrawn}
      />
      <WithdrawalModal
        open={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        availableBalance={Number(Balance?.availableBalance) || 0}
      />
    </>
  );
};
 
export default CitizenEarningsView;