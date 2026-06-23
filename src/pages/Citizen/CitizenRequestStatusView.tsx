import React, { useState, useEffect } from "react";
import RequestDetailsModal from "./CitizenRequestStatusViewDetail";
import { pickuprequests } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { PickupRequests } from "../../Types/types";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    label: "Pending",
  },
  ASSIGNED: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
    label: "Assigned",
  },
  COLLECTED: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
    label: "Collected",
  },
  VERIFIED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    label: "Verified",
  },
  PAID: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
    label: "Paid",
  },
  CANCELLED: {
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
    label: "Cancelled",
  },
};

function CitizenRequestStatusView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pickupRequestData, setPickupRequestData] =
    useState<PickupRequests | null>(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pickuprequests();
        setPickupRequestData(data.AllPickups);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f6f8f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 font-medium tracking-wide">
            Loading your requests…
          </p>
        </div>
      </div>
    );
  }

  const requests = pickupRequestData?.requests ?? [];

  const filtered = requests.filter((req) => {
    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      String(req.requestId).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const summary = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    verified: requests.filter(
      (r) => r.status === "VERIFIED" || r.status === "PAID",
    ).length,
    earnings: requests.reduce((sum, r) => sum + (r.estimatedEarnings || 0), 0),
  };

  return (
    <>
      <main className="flex-1 flex flex-col bg-[#f6f8f7] min-h-screen">
        {/* ── Page Header ── */}
        <div className="bg-white border-b border-zinc-100 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                My Pickup Requests
              </h1>
              <p className="text-sm text-zinc-400 mt-0.5">
                Track and manage all your waste collection requests
              </p>
            </div>
            <button
              onClick={() => navigate("/citizen/request")}
              className="inline-flex items-center gap-2 mt-1 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-[0.97] transition-all"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
              }}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Request
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-8 py-8 flex flex-col gap-6">
          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Requests",
                value: summary.total,
                icon: "inventory_2",
                color: "text-zinc-700",
                bg: "bg-zinc-100",
              },
              {
                label: "Pending",
                value: summary.pending,
                icon: "schedule",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Completed",
                value: summary.verified,
                icon: "verified",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Est. Earnings",
                value: `Rs ${summary.earnings}`,
                icon: "payments",
                color: "text-primary",
                bg: "bg-primary/10",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-zinc-100 p-5 flex items-center gap-4 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined ${card.color}`}
                    style={{ fontSize: 20 }}
                  >
                    {card.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-medium">
                    {card.label}
                  </p>
                  <p className={`text-lg font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="ALL">All Statuses</option>
                {Object.keys(STATUS_CONFIG).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Search
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                  style={{ fontSize: 18 }}
                >
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Request ID…"
                  className="h-10 w-full pl-9 pr-4 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-zinc-300"
                />
              </div>
            </div>
            {(statusFilter !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setSearchQuery("");
                }}
                className="h-10 px-4 text-sm text-zinc-500 hover:text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span
                  className="material-symbols-outlined text-zinc-200"
                  style={{ fontSize: 48 }}
                >
                  inbox
                </span>
                <p className="text-zinc-400 font-medium text-sm">
                  No requests match your filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/70">
                      {[
                        "Request ID",
                        "Waste Type",
                        "Submitted",
                        "Scheduled",
                        "Status",
                        "Est. Earnings",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((req, i) => {
                      const cfg = STATUS_CONFIG[req.status];
                      return (
                        <tr
                          key={req.requestId}
                          onClick={() => setSelectedRequest(req)}
                          className="border-b border-zinc-50 last:border-0 hover:bg-primary/[0.03] transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-semibold text-zinc-800">
                              {req.requestId}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-zinc-600">
                              {req.wasteType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap">
                            {new Date(req.requestDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            <span className="block text-[11px] text-zinc-350">
                              {new Date(req.requestDate).toLocaleTimeString(
                                "en-GB",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap">
                            {new Date(req.scheduledDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {cfg ? (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                />
                                {cfg.label}
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-400">
                                {req.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-zinc-800">
                              Rs {req.estimatedEarnings || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(req);
                              }}
                              className="text-xs font-semibold text-primary hover:text-primary/70 transition-colors inline-flex items-center gap-1 group-hover:underline"
                            >
                              View
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 14 }}
                              >
                                arrow_forward
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="px-6 py-3 border-t border-zinc-50 bg-zinc-50/50">
                <p className="text-xs text-zinc-400">
                  Showing{" "}
                  <span className="font-semibold text-zinc-600">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-zinc-600">
                    {requests.length}
                  </span>{" "}
                  requests
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <RequestDetailsModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        totalearnings={pickupRequestData?.totalEarnings}
      />
    </>
  );
}

export default CitizenRequestStatusView;
