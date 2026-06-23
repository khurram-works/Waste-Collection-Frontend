import React, { useState, useRef, useEffect, useCallback } from "react";
import { updateNotificationStatus } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { getNotifications, getUnreadNotifications } from "../../api/auth";

interface WorkerHeaderProps {
  user: { name: string; avatar?: string; userId?: number; [key: string]: any };
}

interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  metadata: any;
  isRead: boolean;
  createdAt: Date;
}

// ─── Notification type config ─────────────────────────────────────────────────
type NotificationTypeConfig = {
  icon: string;
  colorClass: string;
  bgClass: string;
  label: string;
};

const NOTIFICATION_TYPES: Record<string, NotificationTypeConfig> = {
  PICKUP_ASSIGNED: {
    icon: "assignment_ind",
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    label: "Assigned",
  },
  PICKUP_UPDATED: {
    icon: "edit_location",
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    label: "Updated",
  },
  PICKUP_CANCELLED: {
    icon: "cancel",
    colorClass: "text-red-500",
    bgClass: "bg-red-50",
    label: "Cancelled",
  },
  ROUTE_CHANGED: {
    icon: "alt_route",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-50",
    label: "Route",
  },
  DEFAULT: {
    icon: "notifications",
    colorClass: "text-gray-500",
    bgClass: "bg-gray-100",
    label: "Notice",
  },
};

function getTypeConfig(type: string): NotificationTypeConfig {
  return NOTIFICATION_TYPES[type] ?? NOTIFICATION_TYPES.DEFAULT;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "WK"
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const WorkerHeader: React.FC<WorkerHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const userName = user?.name || "Worker";
  const userAvatar = user?.avatar || "";
  const initials = getInitials(userName);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const isPollingRef = useRef<boolean>(true);
  const lastIdRef = useRef<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasNotifications = notifications.length > 0;

  // ── Long-poll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.userId) return;
    isPollingRef.current = true;

    // async function poll() {
    //   while (isPollingRef.current) {
    //     try {
    //       // const res = await fetch(
    //       //   `http://localhost:3000/worker/notifications/long-poll?lastId=${lastIdRef.current}`,
    //       //   { credentials: "include", headers: { "Cache-Control": "no-cache" } }
    //       // );
    //       // if (!res.ok) throw new Error(`${res.status}`);

    //       const data = await getNotifications(lastIdRef.current);
    //       if (!isPollingRef.current) break;

    //       if (data.notifications?.length) {
    //         lastIdRef.current = Math.max(
    //           ...data.notifications.map((n: Notification) => n.id)
    //         );
    //         setNotifications((prev) => [...data.notifications, ...prev]);
    //       }
    //       await new Promise((r) => setTimeout(r, 200));
    //     } catch {
    //       if (!isPollingRef.current) break;
    //       await new Promise((r) => setTimeout(r, 5000));
    //     }
    //   }
    // }

    // poll();

    async function startNotifications() {
      // ── PHASE 1: Initial fetch ──────────────────────────────────────────
      // This is a plain one-shot REST call. We ask the server for all
      // currently unread notifications. This runs ONCE when the page loads.
      try {
        // const res = await fetch("http://localhost:3000/worker/notifications", {
        //   credentials: "include",
        //   headers: { "Cache-Control": "no-cache" },
        // });
        const resdata = await getUnreadNotifications();
        console.log(resdata);

        if (resdata) {
          const initial: Notification[] = resdata.notifications ?? [];

          if (initial.length > 0) {
            setNotifications(initial);
            lastIdRef.current = Math.max(...initial.map((n) => n.id));
          }
        }
      } catch (err) {
        // The poll will pick up unread items since lastId=0 anyway.
        console.error("Initial notification fetch failed:", err);
      }

      // ── PHASE 2: Long-poll loop ─────────────────────────────────────────
      // Now we enter the real-time loop. Notice that lastIdRef.current is
      // already set from Phase 1. So this loop will ONLY receive notifications
      // that are NEWER than what we already loaded. No duplicates possible.
      while (isPollingRef.current) {
        try {
          // const res = await fetch(
          //   `http://localhost:3000/worker/notifications/long-poll?lastId=${lastIdRef.current}`,
          //   {
          //     credentials: "include",
          //     headers: { "Cache-Control": "no-cache" },
          //   },
          // );

          // if (!res.ok) throw new Error(`Server error: ${res.status}`);

          // Check if we're still mounted before doing anything with the response.
          // The component could have unmounted while the fetch was in-flight.
          const data = await getNotifications(lastIdRef.current);
          if (!isPollingRef.current) break;
          // const data = await res.json();

          if (data.notifications?.length) {
            // Advance our cursor so the next poll request asks for even newer data
            lastIdRef.current = Math.max(
              ...data.notifications.map((n: Notification) => n.id),
            );

            // Prepend new notifications to the top of the list.
            // These are guaranteed to be unread since they just arrived.
            setNotifications((prev) => [...data.notifications, ...prev]);
          }

          // Short pause before immediately reconnecting.
          // This prevents hammering the server if the long-poll returns instantly.
          await new Promise((r) => setTimeout(r, 200));
        } catch {
          if (!isPollingRef.current) break;
          // On error, wait longer before retrying to avoid flooding the server
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }

    startNotifications();
    return () => {
      isPollingRef.current = false;
    };
  }, [user?.userId]);

  // ── Close on outside click / Escape ──────────────────────────────────────
  useEffect(() => {
    if (!showNotifications) return;

    function handleOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowNotifications(false);
        bellRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showNotifications]);

  // ── Mark single read ──────────────────────────────────────────────────────
  const markAsRead = useCallback((id: number) => {
    updateNotificationStatus(id)
      .then(() =>
        setNotifications((prev) =>
          // prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          prev.filter((n) => n.id !== id)
        ),
      )
      .catch(console.error);
  }, []);

  // ── Mark all read ─────────────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (!unread.length || markingAllRead) return;
    setMarkingAllRead(true);
    try {
      await Promise.all(unread.map((n) => updateNotificationStatus(n.id)));
      // setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotifications([]);
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAllRead(false);
    }
  }, [notifications, markingAllRead]);

  // ── Notification click ────────────────────────────────────────────────────
  function handleNotificationClick(n: Notification) {
    if (!n.isRead) markAsRead(n.id);
    setShowNotifications(false);
    switch (n.type) {
      case "PICKUP_ASSIGNED":
        navigate("/worker");
        break;
      default:
        break;
    }
  }

  // ── Sorted: unread first ──────────────────────────────────────────────────
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      {/* Mobile backdrop */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] sm:hidden"
          aria-hidden="true"
          onClick={() => setShowNotifications(false)}
        />
      )}

      <header className="flex-shrink-0 sticky top-0 z-40 w-full">
        {/* Glass layer */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border-b border-gray-100/80" />
        {/* Brand accent strip — blue tint for Worker portal differentiation */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/35 to-transparent" />

        <div className="relative flex items-center justify-between px-5 md:px-8 h-[60px] gap-3">
          {/* ── Left: Brand + Greeting ─────────────────────────────────── */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25">
                <span className="material-symbols-outlined text-white text-[16px] leading-none">
                  recycling
                </span>
                <div className="absolute top-[3px] left-[3px] w-2 h-1 rounded-full bg-white/30" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13.5px] font-bold text-gray-900 tracking-[-0.02em]">
                  Smart<span className="text-emerald-600">Waste</span>
                </span>
                <span className="text-[9.5px] text-gray-400 tracking-[0.12em] uppercase font-semibold mt-0.5">
                  Worker Portal
                </span>
              </div>
            </div>

            {/* Greeting — large screens */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-px h-4 bg-gray-200" />
              <p className="text-[13px] text-gray-500 whitespace-nowrap">
                {getGreeting()},&nbsp;
                <span className="font-semibold text-gray-800">
                  {userName.split(" ")[0]}
                </span>
                &nbsp;👋
              </p>
            </div>
          </div>

          {/* ── Right: Actions ─────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {/* Online status pill — visible sm+ */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full pl-2 pr-3 py-1 shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-[0.01em]">
                On Duty
              </span>
            </div>

            <div className="w-px h-4 bg-gray-200" aria-hidden="true" />

            {/* ── Notification Bell ──────────────────────────────────── */}
            <div className="relative">
              <button
                ref={bellRef}
                type="button"
                onClick={() => setShowNotifications((p) => !p)}
                aria-haspopup="true"
                aria-expanded={showNotifications}
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                className={`
                  relative w-8 h-8 flex items-center justify-center rounded-lg
                  text-gray-500 transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60
                  ${
                    showNotifications
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100 hover:text-gray-700"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px] leading-none">
                  {showNotifications ? "notifications_active" : "notifications"}
                </span>

                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-[3px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* ── Notification Panel ─────────────────────────────── */}
              {showNotifications && (
                <div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Notifications"
                  className="
                    absolute right-0 mt-2.5
                    w-[340px] sm:w-[380px]
                    bg-white rounded-2xl
                    shadow-[0_8px_30px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]
                    border border-gray-100
                    overflow-hidden z-50
                  "
                  style={{
                    animation:
                      "slideDown 0.18s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  <style>{`
                    @keyframes slideDown {
                      from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                  `}</style>

                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-500 text-[18px] leading-none">
                        notifications_active
                      </span>
                      <h2 className="text-[13.5px] font-semibold text-gray-800 leading-none">
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-semibold leading-none">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        disabled={markingAllRead}
                        className="
                          text-[12px] text-emerald-600 font-medium
                          hover:text-emerald-800 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed
                          focus-visible:outline-none focus-visible:underline
                        "
                      >
                        {markingAllRead ? "Marking…" : "Mark all read"}
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div
                    className="overflow-y-auto overscroll-contain"
                    style={{ maxHeight: "420px" }}
                    role="list"
                  >
                    {!hasNotifications ? (
                      /* Empty state */
                      <div className="flex flex-col items-center justify-center py-12 px-6 gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400 text-[24px] leading-none">
                            notifications_off
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-700">
                            All caught up
                          </p>
                          <p className="text-[12px] text-gray-400 mt-0.5">
                            New assignments will appear here
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {unreadCount > 0 && (
                          <div className="px-4 pt-3 pb-1">
                            <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-gray-400">
                              Unread
                            </span>
                          </div>
                        )}

                        {sortedNotifications.map((n, idx) => {
                          const cfg = getTypeConfig(n.type);
                          const isFirstRead =
                            n.isRead &&
                            idx > 0 &&
                            !sortedNotifications[idx - 1].isRead;

                          return (
                            <React.Fragment key={n.id}>
                              {isFirstRead && (
                                <div className="px-4 pt-3 pb-1 border-t border-gray-100 mt-1">
                                  <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-gray-400">
                                    Earlier
                                  </span>
                                </div>
                              )}

                              <div
                                role="listitem"
                                onClick={() => handleNotificationClick(n)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleNotificationClick(n);
                                  }
                                }}
                                className={`
                                  group relative flex items-start gap-3 px-4 py-3
                                  cursor-pointer transition-colors duration-100
                                  focus-visible:outline-none focus-visible:bg-blue-50/60
                                  ${
                                    !n.isRead
                                      ? "bg-blue-50/50 hover:bg-blue-50"
                                      : "hover:bg-gray-50"
                                  }
                                `}
                              >
                                {/* Type icon */}
                                <div
                                  className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bgClass}`}
                                >
                                  <span
                                    className={`material-symbols-outlined text-[17px] leading-none ${cfg.colorClass}`}
                                  >
                                    {cfg.icon}
                                  </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p
                                      className={`text-[13px] leading-snug truncate ${
                                        !n.isRead
                                          ? "font-semibold text-gray-900"
                                          : "font-medium text-gray-700"
                                      }`}
                                    >
                                      {n.title}
                                    </p>
                                    {!n.isRead && (
                                      <span
                                        aria-hidden="true"
                                        className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"
                                      />
                                    )}
                                  </div>

                                  <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                                    {n.message}
                                  </p>

                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span
                                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${cfg.bgClass} ${cfg.colorClass}`}
                                    >
                                      {cfg.label}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                      {formatTime(n.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                {/* Hover cue */}
                                <span className="material-symbols-outlined text-[14px] text-gray-300 group-hover:text-gray-400 shrink-0 mt-1.5 transition-colors leading-none">
                                  chevron_right
                                </span>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  {hasNotifications && (
                    <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/50 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {notifications.length} notification
                        {notifications.length !== 1 ? "s" : ""}
                      </span>
                      {/* <button
                        type="button"
                        className="text-[12px] text-emerald-600 font-medium hover:text-emerald-800 transition-colors focus-visible:outline-none focus-visible:underline"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/worker/notifications");
                        }}
                      >
                        View all
                      </button> */}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-gray-200" aria-hidden="true" />

            {/* ── Avatar button ─────────────────────────────────────── */}
            <button
              type="button"
              aria-label={`User menu for ${userName}`}
              className="
                group flex items-center gap-2 pl-1 pr-2.5 py-1
                rounded-lg hover:bg-gray-100 active:bg-gray-200
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60
              "
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-200 group-hover:ring-emerald-300 transition-all">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={`${userName}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold leading-none">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden md:flex flex-col text-left min-w-0">
                <span className="text-[13px] font-semibold text-gray-800 leading-tight truncate max-w-[110px] group-hover:text-gray-900 transition-colors">
                  {userName}
                </span>
                <span className="text-[10.5px] text-gray-400 leading-tight tracking-[0.02em]">
                  Worker
                </span>
              </div>

              <span className="material-symbols-outlined text-[14px] text-gray-400 group-hover:text-gray-600 transition-colors leading-none hidden md:block">
                keyboard_arrow_down
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default WorkerHeader;
