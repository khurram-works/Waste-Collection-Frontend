import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { toast } from "react-toastify";
import { RequestDrawerProps } from "../../Types/types";
import { assignRequest, rejectRequest } from "../../api/auth";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const RECYCLABLE_TYPES = ["PET", "CARDBOARD", "PAPER", "METAL", "PLASTIC"];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> =
  {
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    ASSIGNED: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400" },
    COLLECTED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    VERIFIED: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
    PAID: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
    CANCELLED: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
  };

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10.5px] font-extrabold text-[#7a9e8a] uppercase tracking-[0.1em] mb-3">
    {children}
  </p>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-[#f0f4f2] last:border-0">
    <div className="size-7 rounded-lg bg-[#f0f4f2] flex items-center justify-center shrink-0 mt-0.5">
      <span className="material-symbols-outlined text-[#7a9e8a] text-[15px]">
        {icon}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-[#9ab3a4] uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-[#1a2e23] truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

const Avatar = ({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const colors = [
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizeClass = size === "lg" ? "size-11 text-sm" : "size-9 text-xs";
  return (
    <div
      className={`${sizeClass} rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}
    >
      {initials}
    </div>
  );
};
const StyledListbox = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  options: { id: number; label: string; sub?: string }[];
  placeholder: string;
}) => {
  const selected = options.find((o) => o.id === value);
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          className="
          relative w-full rounded-xl border-2 border-[#e4ebe7] bg-white
          py-2.5 pl-4 pr-10 text-left text-[13px] text-[#1a2e23] font-medium
          shadow-none focus:outline-none focus:border-[#2e8a57] focus:ring-2 focus:ring-[#2e8a57]/10
          hover:border-[#2e8a57]/50 transition-all cursor-pointer
          data-open:border-[#2e8a57] data-open:ring-2 data-open:ring-[#2e8a57]/10
        "
        >
          {selected ? (
            <div className="flex flex-col">
              <span className="font-semibold text-[#1a2e23]">
                {selected.label}
              </span>
              {selected.sub && (
                <span className="text-[11px] text-[#9ab3a4] font-medium">
                  {selected.sub}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[#9ab3a4]">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-[#9ab3a4]"
            >
              <path
                d="M3 5.5L7 9L11 5.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          className="
           z-[9999] w-[var(--button-width)] overflow-auto rounded-xl
    border border-[#e4ebe7] bg-white py-1.5
    shadow-xl shadow-black/8 focus:outline-none
    max-h-52
        "
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-[12px] text-[#9ab3a4] font-medium text-center">
              No options available
            </div>
          ) : (
            options.map((opt) => (
              <ListboxOption
                key={opt.id}
                value={opt.id}
                className="
                  relative cursor-pointer select-none px-3 py-2.5
                  data-focus:bg-[#f6f9f7]
                  data-selected:bg-[#2e8a57]/5
                  transition-colors mx-1 rounded-lg
                "
              >
                {({ selected: sel }) => (
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p
                        className={`text-[13px] ${sel ? "font-bold text-[#2e8a57]" : "font-medium text-[#1a2e23]"}`}
                      >
                        {opt.label}
                      </p>
                      {opt.sub && (
                        <p className="text-[11px] text-[#9ab3a4] font-medium mt-0.5">
                          {opt.sub}
                        </p>
                      )}
                    </div>
                    {sel && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-[#2e8a57] shrink-0"
                      >
                        <path
                          d="M2.5 7.5L5.5 10.5L11.5 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </ListboxOption>
            ))
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

const RequestDrawer: React.FC<RequestDrawerProps> = ({
  isOpen,
  onClose,
  request,
  workersData,
  routesData,
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<number>(0);
  const [selectedRouteId, setSelectedRouteId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  if (!request) return null;

  const isRecyclable = RECYCLABLE_TYPES.includes(request.wasteType);
  const statusCfg = STATUS_CONFIG[request.status] ?? {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };
  const isPending = request.status === "PENDING";

  const availableWorkers = workersData.filter(
    (w) =>
      w.zoneId === request.citizen.zoneId &&
      (isRecyclable
        ? w.responsibleFor === "recycling"
        : w.responsibleFor === "landfill"),
  );

  const availableRoutes = routesData.filter(
    (r) =>
      (isRecyclable ? r.type === "recycling" : r.type === "landfill") &&
      r.zoneId === request.citizen.zoneId,
  );

  const workerOptions = availableWorkers.map((w) => ({
    id: w.userId,
    label: w.name,
    sub: w.phone ?? undefined,
  }));

  const routeOptions = availableRoutes.map((r) => ({
    id: r.routeId,
    label: r.name,
    sub: r.type,
  }));
  const handleAssign = async () => {
    if (!selectedWorkerId) {
      toast.error("Please select a worker before assigning.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: { workerId: number; routeId?: number } = {
        workerId: selectedWorkerId,
      };
      if (selectedRouteId) payload.routeId = selectedRouteId;

      const result = await assignRequest(Number(request.requestId), payload);
      if (!result.success)
        throw new Error(result.message || "Assignment failed");
      toast.success(result.message || "Request assigned successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const response = await rejectRequest(Number(request.requestId));
      if (!response.success)
        throw new Error(response.message || "Rejection failed");
      toast.success(response.message || "Request rejected.");
      setShowRejectConfirm(false);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className="
            w-[420px] max-w-full bg-[#f6f9f7] h-full shadow-2xl flex flex-col
            transform transition duration-300 ease-out
            data-closed:translate-x-full
          "
        >
          <div className="bg-white px-6 pt-5 pb-4 border-b border-[#e4ebe7]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${statusCfg.bg} ${statusCfg.text}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${statusCfg.dot}`}
                    />
                    {request.status}
                  </span>
                  <span className="text-[11px] font-bold text-[#9ab3a4] font-mono">
                    #{request.requestId}
                  </span>
                </div>
                <h2 className="text-[17px] font-extrabold text-[#0d1f18] leading-tight">
                  Manage Request
                </h2>
              </div>
              <button
                onClick={onClose}
                className="
                  size-8 rounded-xl bg-[#f6f9f7] hover:bg-[#e8edea]
                  flex items-center justify-center transition-colors ml-3 shrink-0
                "
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 2L12 12M12 2L2 12"
                    stroke="#6a8174"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div
              className={`
              inline-flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-xl
              ${isRecyclable ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-orange-50 text-orange-700 border border-orange-100"}
            `}
            >
              <span className="text-base">{isRecyclable ? "♻️" : "🗑️"}</span>
              {isRecyclable ? "Recycling Waste" : "Landfill Waste"}
              <span className="text-[10px] opacity-60 font-bold uppercase tracking-wide ml-0.5">
                · {request.wasteType}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#e4ebe7] overflow-hidden">
              <div className="px-4 pt-3.5 pb-1">
                <SectionLabel>Citizen</SectionLabel>
              </div>
              <div className="px-4 pb-1">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={request.citizen.name} size="lg" />
                  <div>
                    <p className="text-[14px] font-bold text-[#0d1f18]">
                      {request.citizen.name}
                    </p>
                    <p className="text-[12px] text-[#9ab3a4] font-medium">
                      {request.citizen.phone || "No phone on record"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-3 border-t border-[#f0f4f2] pt-2">
                <InfoRow
                  icon="location_on"
                  label="Pickup Address"
                  value={request.address}
                />
                {request.citizen.zoneId && (
                  <InfoRow
                    icon="map"
                    label="Zone ID"
                    value={`Zone ${request.citizen.zoneId}`}
                  />
                )}
              </div>
            </div>
            {(request.photoUrl || request.notes) && (
              <div className="mx-4 mt-3 bg-white rounded-2xl border border-[#e4ebe7] overflow-hidden">
                <div className="px-4 pt-3.5 pb-2">
                  <SectionLabel>Waste Verification</SectionLabel>
                </div>
                {request.photoUrl && (
                  <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-[#e4ebe7]">
                    <img
                      src={request.photoUrl}
                      alt="Submitted waste photo"
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}
                {request.notes && (
                  <div className="mx-4 mb-4">
                    <p className="text-[10.5px] font-extrabold text-[#7a9e8a] uppercase tracking-[0.1em] mb-1.5">
                      Notes
                    </p>
                    <p className="text-[13px] text-[#4a6e5a] italic leading-relaxed bg-[#f6f9f7] rounded-xl px-3 py-2.5 border border-[#e4ebe7]">
                      "{request.notes}"
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mx-4 mt-3 mb-4 bg-white rounded-2xl border border-[#e4ebe7] overflow-hidden">
              <div className="px-4 pt-3.5 pb-3">
                <SectionLabel>
                  {isPending ? "Assignment" : "Assignment Details"}
                </SectionLabel>

                {isPending ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#4a6e5a] mb-1.5">
                        Assign Worker
                        <span className="text-rose-400 ml-0.5">*</span>
                      </label>
                      {availableWorkers.length === 0 ? (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                          <span className="text-amber-500 text-sm">⚠️</span>
                          <p className="text-[12px] text-amber-700 font-medium">
                            No workers available for this zone &amp; waste type.
                          </p>
                        </div>
                      ) : (
                        <StyledListbox
                          value={selectedWorkerId}
                          onChange={setSelectedWorkerId}
                          options={workerOptions}
                          placeholder="Choose a worker…"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[12px] font-bold text-[#4a6e5a]">
                          Assign Route
                          <span className="text-[#9ab3a4] text-[11px] font-normal ml-1">
                            (optional)
                          </span>
                        </label>
                      </div>
                      {availableRoutes.length === 0 ? (
                        <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5">
                          <span className="text-rose-400 text-sm shrink-0">
                            ⚠️
                          </span>
                          <p className="text-[12px] text-rose-600 font-medium">
                            No routes found for this zone. Please add a route
                            first.
                          </p>
                        </div>
                      ) : (
                        <StyledListbox
                          value={selectedRouteId}
                          onChange={setSelectedRouteId}
                          options={routeOptions}
                          placeholder="Choose a route…"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0 rounded-xl border border-[#f0f4f2] overflow-hidden">
                    <InfoRow
                      icon="person"
                      label="Assigned Worker"
                      value={request.worker?.name?.toUpperCase() ?? null}
                    />
                    <InfoRow
                      icon="phone"
                      label="Worker Phone"
                      value={request.worker?.phone ?? null}
                    />
                    <InfoRow
                      icon="route"
                      label="Route"
                      value={request.route?.name ?? null}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-[#e4ebe7] px-5 py-4">
            {isPending ? (
              <>
                {showRejectConfirm ? (
                  <div className="mb-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    <p className="text-[13px] font-semibold text-rose-700 mb-3">
                      Are you sure you want to reject this request?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-bold py-2 rounded-lg transition-all disabled:opacity-60"
                      >
                        {isSubmitting ? "Rejecting…" : "Yes, Reject"}
                      </button>
                      <button
                        onClick={() => setShowRejectConfirm(false)}
                        disabled={isSubmitting}
                        className="flex-1 bg-white border border-[#e4ebe7] text-[#6a8174] text-[13px] font-semibold py-2 rounded-lg hover:bg-[#f6f9f7] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={handleAssign}
                  disabled={isSubmitting || availableWorkers.length === 0}
                  className="
                    w-full bg-[#2e8a57] hover:bg-[#267a4d] active:bg-[#1f6640]
                    text-white font-bold text-[14px] py-3.5 rounded-xl
                    shadow-md shadow-[#2e8a57]/15
                    transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeOpacity="0.25"
                          strokeWidth="3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[17px]">
                        check_circle
                      </span>
                      Approve & Assign
                    </>
                  )}
                </button>

                {!showRejectConfirm && (
                  <button
                    onClick={() => setShowRejectConfirm(true)}
                    disabled={isSubmitting}
                    className="
                      w-full mt-2 bg-transparent border border-[#e4ebe7]
                      text-[#9ab3a4] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50
                      font-semibold text-[13px] py-2.5 rounded-xl transition-all disabled:opacity-50
                    "
                  >
                    Reject Request
                  </button>
                )}
              </>
            ) : (
              /* Non-pending status display */
              <div
                className={`
                w-full flex items-center justify-center gap-2
                text-[13px] font-bold py-3.5 rounded-xl
                ${STATUS_CONFIG[request.status]?.bg ?? "bg-gray-50"}
                ${STATUS_CONFIG[request.status]?.text ?? "text-gray-600"}
                border border-current/10
              `}
              >
                <span
                  className={`size-2 rounded-full ${STATUS_CONFIG[request.status]?.dot ?? "bg-gray-400"}`}
                />
                This request is {request.status.toLowerCase()}
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RequestDrawer;
