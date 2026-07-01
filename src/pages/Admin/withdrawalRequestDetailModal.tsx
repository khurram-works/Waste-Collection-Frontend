import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { approveWithdrawal, rejectWithdrawal } from "../../api/auth";
import { toast } from "react-toastify";
import { allWithdrawalsData } from "../../Types/types";

const formatAmount = (amount: number) =>
  `Rs ${amount?.toLocaleString("en-PK") ?? "0"}`;

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name: string) =>
  (name ?? "??")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const statusMeta: Record<string, { label: string; pill: string }> = {
  PENDING: { label: "Pending",  pill: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
  APPROVED: { label: "Approved", pill: "bg-blue-100 text-blue-800 border border-blue-200" },
  PAID:     { label: "Paid",     pill: "bg-green-100 text-green-800 border border-green-200" },
  REJECTED: { label: "Rejected", pill: "bg-red-100 text-red-800 border border-red-200" },
};

const payoutMeta: Record<string, { icon: string; label: string; colorClass: string }> = {
  EASYPAISA: { icon: "smartphone",            label: "EasyPaisa", colorClass: "bg-blue-50 text-blue-700 border border-blue-100" },
  JAZZCASH:  { icon: "account_balance_wallet", label: "JazzCash",  colorClass: "bg-red-50 text-red-700 border border-red-100"   },
  BANK:      { icon: "account_balance",        label: "Bank",      colorClass: "bg-slate-100 text-slate-700 border border-slate-200" },
};

const getPayoutMeta = (method: string) =>
  payoutMeta[method?.toUpperCase()] ?? {
    icon: "payments",
    label: method ?? "Unknown",
    colorClass: "bg-gray-100 text-gray-700 border border-gray-200",
  };

const getStatusMeta = (status: string) =>
  statusMeta[status?.toUpperCase()] ?? { label: status ?? "Unknown", pill: "bg-gray-100 text-gray-700 border border-gray-200" };

type TimelineStep = {
  key: string;
  label: string;
  icon: string;
  state: "done" | "active" | "pending" | "rejected";
  timestamp?: string | Date | null;
};

function buildTimeline(request: allWithdrawalsData): TimelineStep[] {
  const status = request?.status?.toUpperCase();

  const steps: TimelineStep[] = [
    {
      key: "requested",
      label: "Requested",
      icon: "send",
      state: "done",
      timestamp: request?.createdAt,
    },
    {
      key: "approved",
      label: status === "REJECTED" ? "Rejected" : "Approved",
      icon: status === "REJECTED" ? "cancel" : "task_alt",
      state:
        status === "APPROVED" || status === "PAID"
          ? "done"
          : status === "REJECTED"
          ? "rejected"
          : "pending",
      timestamp: status === "APPROVED" || status === "PAID" || status === "REJECTED"
        ? request?.updatedAt
        : null,
    },
    {
      key: "paid",
      label: "Paid",
      icon: "payments",
      state: status === "PAID" ? "done" : status === "REJECTED" ? "pending" : "pending",
      timestamp: request?.processedAt,
    },
  ];

  if (status === "PENDING") {
    steps[0].state = "done";
    steps[1].state = "active";
  }
  if (status === "APPROVED") {
    steps[2].state = "active";
  }

  return steps;
}

const stepStyle: Record<string, { circle: string; text: string; sub: string }> = {
  done:     { circle: "bg-[#2e8a57] text-white ring-4 ring-[#f0faf4]",        text: "text-[#121614] font-semibold", sub: "text-[#6a8174]" },
  active:   { circle: "bg-white border-2 border-[#2e8a57] text-[#2e8a57] ring-4 ring-[#f0faf4]", text: "text-[#2e8a57] font-semibold", sub: "text-[#6a8174] italic" },
  pending:  { circle: "bg-[#f0f2f1] border-2 border-[#dde3e0] text-[#9ab0a3] ring-4 ring-[#f9fbfa]", text: "text-[#9ab0a3]",              sub: "text-[#bec9be] italic" },
  rejected: { circle: "bg-red-100 border-2 border-red-300 text-red-500 ring-4 ring-[#fff5f5]",       text: "text-red-600 font-semibold",   sub: "text-red-400" },
};

function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[#6a8174] mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-[#121614] ${mono ? "font-mono bg-background-light px-2 py-0.5 rounded inline-block" : ""}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function WithDrawDetails({
  open,
  onClose,
  request,
}: {
  open: boolean;
  onClose: () => void;
  request: allWithdrawalsData;
}) {
  const [adminNote, setAdminNote] = useState("");

  if (!request) return null;

  const sm = getStatusMeta(request.status);
  const pm = getPayoutMeta(request.paymentMethod);
  const timeline = buildTimeline(request);
  const user = request.user ?? {};
  const displayName = user.name ?? request.accountTitle ?? `User #${request.userId}`;
  const isRejected = request.status === "REJECTED";
  const isPaid     = request.status === "PAID";
  const isPending  = request.status === "PENDING";
  const isApproved = request.status === "APPROVED";

  const handleApprove = async (id: number) => {
    try {
      await approveWithdrawal(id);
      toast.success("Withdrawal approved successfully");
      onClose(); 
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error("Failed to approve withdrawal");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectWithdrawal(id);
      onClose();
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
    }
  };  

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <DialogPanel
            transition
            className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl duration-300 ease-out data-closed:translate-y-4 data-closed:opacity-0 overflow-hidden flex flex-col max-h-[95vh]"
          >
            <div className="px-5 py-4 md:px-6 md:py-5 border-b border-[#dde3e0] flex justify-between items-start shrink-0 bg-white">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-lg md:text-xl font-bold font-['Public_Sans'] text-[#121614] tracking-tight">
                    Withdrawal #WDL-{request.id}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${sm.pill}`}>
                    {sm.label}
                  </span>
                </div>
                <p className="text-xs text-[#6a8174]">
                  Requested on {formatDate(request.createdAt)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#6a8174] hover:text-[#121614] transition-colors p-1.5 rounded-full hover:bg-[#f0f2f1] shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 bg-background-light">
              <div className="p-4 md:p-6 space-y-5">
                <section>
                  <h3 className="text-[10px] font-bold text-[#6a8174] uppercase tracking-widest mb-3 font-['Public_Sans']">
                    Citizen Profile
                  </h3>
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e4eae6] shadow-sm">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#f0f2f1]">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#c7ecce] to-[#90d4a3] flex items-center justify-center text-[#2e8a57] font-bold text-base shrink-0 shadow-sm">
                        {getInitials(displayName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-[#121614] truncate">{displayName}</p>
                        <p className="text-xs text-[#6a8174] truncate">{user.email ?? "—"}</p>
                      </div>
                      {user.status && (
                        <span className={`ml-auto shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {user.status}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <InfoRow label="Phone" value={user.phone ?? request.accountNumber} />
                      <InfoRow label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"} />
                      <InfoRow label="Total Earnings" value={user.totalEarnings != null ? formatAmount(user.totalEarnings) : "—"} />
                      {/* <InfoRow label="Available Balance" value={user.availableBalance != null ? formatAmount(user.availableBalance) : "—"} />
                      <InfoRow label="Pending Balance" value={user.pendingBalance != null ? formatAmount(user.pendingBalance) : "—"} /> */}
                      <InfoRow label="Role" value={user.role ?? "—"} />
                      {user.address && (
                        <div className="col-span-2">
                          <p className="text-xs text-[#6a8174] mb-0.5">Address</p>
                          <p className="text-sm font-semibold text-[#121614] leading-relaxed">{user.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-[10px] font-bold text-[#6a8174] uppercase tracking-widest mb-3 font-['Public_Sans']">
                    Financial Details
                  </h3>
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e4eae6] shadow-sm relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#dcfce7] rounded-full opacity-30 pointer-events-none" />
                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div>
                        <p className="text-xs text-[#6a8174] mb-1">Requested Amount</p>
                        <p className="text-3xl md:text-4xl font-bold font-['Public_Sans'] text-[#2e8a57] tracking-tight">
                          {formatAmount(request.amount)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${pm.colorClass}`}>
                        <span className="material-symbols-outlined text-[15px]">{pm.icon}</span>
                        {pm.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-[#f0f2f1] relative z-10">
                      <InfoRow label="Account Title" value={request.accountTitle} />
                      <InfoRow label="Bank / Wallet" value={request.bankName} />
                      <InfoRow label="Account Number" value={request.accountNumber} mono />
                      {request.iban && <InfoRow label="IBAN" value={request.iban} mono />}
                      {request.paymentReference && (
                        <InfoRow label="Payment Reference" value={request.paymentReference} mono />
                      )}
                      <InfoRow
                        label={request.processedAt ? "Processed At" : "Requested On"}
                        value={formatDate(request.processedAt ?? request.createdAt)}
                      />
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-[10px] font-bold text-[#6a8174] uppercase tracking-widest mb-3 font-['Public_Sans']">
                    Processing Timeline
                  </h3>
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-[#e4eae6] shadow-sm">
                    <div className="relative pl-4">
                      <div className="absolute left-[1.85rem] top-3 bottom-3 w-0.5 bg-linear-to-b from-[#2e8a57] via-[#dde3e0] to-[#dde3e0]" />

                      {timeline.map((step, i) => {
                        const st = stepStyle[step.state];
                        return (
                          <div key={step.key} className={`flex gap-4 relative ${i < timeline.length - 1 ? "mb-6" : ""}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${st.circle}`}>
                              <span className="material-symbols-outlined text-[15px]">{step.icon}</span>
                            </div>
                            <div className="pt-0.5 min-w-0">
                              <p className={`text-sm ${st.text}`}>{step.label}</p>
                              <p className={`text-xs mt-0.5 ${st.sub}`}>
                                {step.state === "done" && step.timestamp
                                  ? formatDate(step.timestamp)
                                  : step.state === "active"
                                  ? "In progress..."
                                  : step.state === "rejected"
                                  ? formatDate(step.timestamp)
                                  : "Awaiting..."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
                <section>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold text-[#6a8174] uppercase tracking-widest font-['Public_Sans']" htmlFor="admin-notes">
                      Internal Admin Notes
                    </label>
                    <span className="text-[10px] text-[#6a8174] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">visibility_off</span>
                      Visible to admins only
                    </span>
                  </div>
                  <textarea
                    id="admin-notes"
                    className="w-full bg-white border border-[#dde3e0] rounded-xl p-3.5 text-sm text-[#121614] placeholder:text-[#9ab0a3] focus:ring-2 focus:ring-[#2e8a57] focus:border-[#2e8a57] outline-none transition-all resize-none shadow-sm"
                    placeholder="Add optional notes about this request..."
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </section>

              </div>
            </div>
            <div className="px-5 py-4 md:px-6 md:py-5 border-t border-[#dde3e0] bg-white shrink-0">
              {isPending && (
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <button onClick={() => handleReject(request.id)} className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm text-[#ef4444] bg-white border border-[#ef4444] hover:bg-[#fff5f5] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    Reject Withdrawal
                  </button>
                  <button onClick={() => handleApprove(request.id)} className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#2e8a57] text-white shadow-md hover:bg-[#246e47] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve Withdrawal
                  </button>
                </div>
              )}

              {isApproved && (
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <button className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm text-[#ef4444] bg-white border border-[#ef4444] hover:bg-[#fff5f5] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">undo</span>
                    Cancel Approval
                  </button>
                  <button className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#2e8a57] text-white shadow-md hover:bg-[#246e47] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    Mark as Paid
                  </button>
                </div>
              )}

              {isPaid && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 px-5 py-2.5 rounded-xl text-sm bg-green-50 text-[#2e8a57] border border-green-200 flex items-center justify-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    This request has been paid
                  </div>
                  <button className="px-4 py-2.5 rounded-xl text-sm border border-[#dde3e0] text-[#6a8174] hover:bg-background-light transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                    Receipt
                  </button>
                </div>
              )}

              {isRejected && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 px-5 py-2.5 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200 flex items-center justify-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    This request was rejected
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-[#6a8174]">
                <button onClick={onClose} className="font-semibold hover:text-[#121614] transition-colors uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  Close
                </button>
                <p className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">shield</span>
                  All changes are audit-logged
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}