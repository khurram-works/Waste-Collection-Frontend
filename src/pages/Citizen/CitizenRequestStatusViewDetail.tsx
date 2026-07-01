import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import CancelRequestModal from "./CitizenCancelRequest";
import { PickupRequestItem } from "@/Types/types";

const STATUS_ORDER = [
  "PENDING",
  "ASSIGNED",
  "COLLECTED",
  "VERIFIED",
  "PAID",
] as const;

const STEP_META: Record<string, { icon: string; label: string }> = {
  PENDING: { icon: "schedule", label: "Pending" },
  ASSIGNED: { icon: "local_shipping", label: "Assigned" },
  COLLECTED: { icon: "inventory", label: "Collected" },
  VERIFIED: { icon: "verified", label: "Verified" },
  PAID: { icon: "payments", label: "Paid" },
};

const getStepState = (
  currentStatus: typeof STATUS_ORDER[number],
  stepName: typeof STATUS_ORDER[number],
) => {
  const stepIndex = STATUS_ORDER.indexOf(stepName);
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex > stepIndex) return "completed";
  if (currentIndex === stepIndex) return "active";
  return "upcoming";
};

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PickupRequestItem;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontSize: 16 }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-zinc-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-zinc-100 p-3">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
        {label}
      </p>
      <p
        className={`text-sm font-bold mt-1 ${highlight ? "text-primary" : "text-zinc-800"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  request,
}: RequestDetailsModalProps) {
  const [cancelled, setcancelled] = useState(false);
  if (!request) return null;

  const {
    requestId,
    wasteType,
    requestDate,
    scheduledDate,
    status,
    estimatedWeight,
    estimatedEarnings,
    pickupAddress,
    citizenNote,
    photoUrl,
    actualWeight,
    rateApplied,
    condition,
    workerId,
    workerName,
    workerPhone,
    routeSchedule,
  } = request;

  const isPostCollection =
    status === "COLLECTED" || status === "VERIFIED" || status === "PAID";
  const currentIdx = STATUS_ORDER.indexOf(status);
  const progressPct =
    currentIdx >= 0 ? (currentIdx / (STATUS_ORDER.length - 1)) * 100 : 0;

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 data-closed:opacity-0"
          aria-hidden="true"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden
                         duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
              <div className="px-7 pt-7 pb-6 border-b border-zinc-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    Request{" "}
                    <span className="font-mono text-primary">{requestId}</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Submitted{" "}
                    {new Date(requestDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    close
                  </span>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-220px)] px-7 py-6 space-y-7">
                <div>
                  <div className="relative flex items-start justify-between">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-zinc-100 -z-10" />
                    <div
                      className="absolute top-4 left-0 h-0.5 bg-primary -z-10 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />

                    {STATUS_ORDER.map((step) => {
                      const state = getStepState(status, step);
                      const meta = STEP_META[step];
                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div
                            className={`
                            relative w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all
                            ${state === "completed" ? "bg-primary shadow-sm shadow-primary/30" : ""}
                            ${state === "active" ? "bg-primary ring-4 ring-primary/15 shadow-sm shadow-primary/30" : ""}
                            ${state === "upcoming" ? "bg-white border-2 border-zinc-200" : ""}
                          `}
                          >
                            <span
                              className={`material-symbols-outlined
                                ${state === "completed" ? "text-white" : ""}
                                ${state === "active" ? "text-white" : ""}
                                ${state === "upcoming" ? "text-zinc-300" : ""}
                              `}
                              style={{ fontSize: 16 }}
                            >
                              {state === "completed" ? "check" : meta.icon}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-center uppercase tracking-wider leading-tight
                            ${state === "active" ? "text-primary" : ""}
                            ${state === "completed" ? "text-zinc-500" : ""}
                            ${state === "upcoming" ? "text-zinc-300" : ""}
                          `}
                          >
                            {meta.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-1">
                  <div className="space-y-4">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                      Request Info
                    </p>
                    <InfoRow
                      icon="recycling"
                      label="Waste Type"
                      value={wasteType}
                    />
                    <InfoRow
                      icon="weight"
                      label="Estimated Weight"
                      value={estimatedWeight}
                    />
                    <InfoRow
                      icon="calendar_today"
                      label="Scheduled Date"
                      value={
                        scheduledDate
                          ? new Date(scheduledDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Not scheduled yet"
                      }
                    />
                    <InfoRow
                      icon="location_on"
                      label="Pickup Address"
                      value={pickupAddress}
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                      Notes & Media
                    </p>
                    <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-4">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
                        Citizen Note
                      </p>
                      <p className="text-sm text-zinc-600 italic leading-relaxed">
                        {citizenNote ? (
                          `"${citizenNote}"`
                        ) : (
                          <span className="not-italic text-zinc-300">
                            No notes provided
                          </span>
                        )}
                      </p>
                    </div>

                    {photoUrl && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
                          Photo
                        </p>
                        <div className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-zinc-100 hover:border-primary transition-all cursor-pointer shadow-sm">
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span
                              className="material-symbols-outlined text-white"
                              style={{ fontSize: 20 }}
                            >
                              zoom_in
                            </span>
                          </div>
                          <img
                            src={photoUrl}
                            alt="Waste"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {isPostCollection && (
                  <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-primary"
                          style={{ fontSize: 18 }}
                        >
                          fact_check
                        </span>
                        <h3 className="text-sm font-bold text-zinc-800">
                          Verification Details
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full
                      ${isPostCollection ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`}
                      >
                        {isPostCollection ? "Collected" : "Pending Collection"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <StatCell
                        label="Actual Weight"
                        value={isPostCollection ? `${actualWeight} kg` : "—"}
                      />
                      <StatCell
                        label="Condition"
                        value={
                          isPostCollection && condition
                            ? condition.toLowerCase()
                            : "—"
                        }
                        highlight
                      />
                      <StatCell
                        label="Rate Applied"
                        value={isPostCollection ? `Rs ${rateApplied}/kg` : "—"}
                      />
                      <StatCell
                        label="Est. Earnings"
                        value={`Rs ${estimatedEarnings}`}
                      />
                      <StatCell
                        label="Final Earnings"
                        value={
                          status === "VERIFIED"
                            ? `Rs ${estimatedEarnings}`
                            : "—"
                        }
                        highlight
                      />
                    </div>

                    {!isPostCollection && (
                      <p className="mt-4 text-xs text-center text-zinc-350 italic">
                        Verification details will appear once waste is
                        collected.
                      </p>
                    )}
                  </div>
                )}

                {workerId !== null && (
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-300 mb-3">
                      Assigned Worker
                    </p>
                    <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100 rounded-xl p-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontSize: 20 }}
                          >
                            person
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-800">
                            {workerName ?? "—"}
                            <span className="text-zinc-400 font-normal text-xs ml-1">
                              ({workerId ?? "—"})
                            </span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="material-symbols-outlined text-zinc-400"
                              style={{ fontSize: 13 }}
                            >
                              call
                            </span>
                            <p className="text-xs text-zinc-500">
                              {workerPhone ?? "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isPostCollection && (
                        <div className="text-right shrink-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                            Est. Arrival
                          </p>
                          <p className="text-sm font-bold text-zinc-800 mt-0.5">
                            {routeSchedule
                              ? new Date(
                                  routeSchedule.scheduleDate,
                                ).toLocaleString()
                              : "—"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>


              <div className="px-7 py-5 border-t border-zinc-100 flex items-center justify-between gap-3 bg-zinc-50/60">
                {status === "PENDING" || status === "ASSIGNED" ? (
                  <button
                    onClick={() => setcancelled(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16 }}
                    >
                      cancel
                    </span>
                    Cancel Request
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-semibold text-zinc-600 border border-zinc-200 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <CancelRequestModal
        isopen={cancelled}
        onclose={() => setcancelled(false)}
      />
    </>
  );
}
