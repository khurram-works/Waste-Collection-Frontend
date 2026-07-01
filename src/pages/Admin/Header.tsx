import React, { useState, useRef, useEffect, useCallback } from "react";
import { updateNotificationStatus } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../api/auth";

interface AdminUser {
  name?: string;
  avatar?: string;
  userId?: number;
  [key: string]: unknown;
}

interface HeaderProps {
  user?: AdminUser;
}

interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}


type NotificationTypeConfig = {
  icon: string;
  colorClass: string;
  bgClass: string;
  label: string;
};

const NOTIFICATION_TYPES: Record<string, NotificationTypeConfig> = {
  PICKUP_SUBMITTED: {
    icon: "inbox",
    colorClass: "text-violet-600",
    bgClass: "bg-violet-50",
    label: "Pickup",
  },
  WITHDRAWAL_REQUESTED: {
    icon: "account_balance_wallet",
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    label: "Withdrawal",
  },
  PICKUP_FLAGGED: {
    icon: "flag",
    colorClass: "text-red-500",
    bgClass: "bg-red-50",
    label: "Flagged",
  },
  USER_REGISTERED: {
    icon: "person_add",
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    label: "New User",
  },
  SYSTEM_ALERT: {
    icon: "warning",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-50",
    label: "Alert",
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
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
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
      .slice(0, 2) || "AD"
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const userName = user?.name || "Admin";
  const userAvatar = user?.avatar || "/admin.png";
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
    if (!user?.userId) return undefined;
    isPollingRef.current = true;

    async function poll() {
      while (isPollingRef.current) {
        try {
          // const res = await fetch(
          //   `http://localhost:3000/admin/notifications/long-poll?lastId=${lastIdRef.current}`,
          //   { credentials: "include", headers: { "Cache-Control": "no-cache" } }
          // );
          // if (!res.ok) throw new Error(`${res.status}`);

          const data = await getNotifications(lastIdRef.current);
          if (!isPollingRef.current) break;
          if (data.notifications?.length) {
            lastIdRef.current = Math.max(
              ...data.notifications.map((n: Notification) => n.id)
            );
            setNotifications((prev) => [...data.notifications, ...prev]);
          }
          await new Promise((r) => setTimeout(r, 200));
        } catch {
          if (!isPollingRef.current) break;
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }

    poll();
    return () => { isPollingRef.current = false; };
  }, [user?.userId]);

  // ── Close on outside click / Escape ──────────────────────────────────────
  useEffect(() => {
    if (!showNotifications) return undefined;

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
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
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
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
      case "PICKUP_SUBMITTED":
        navigate("/admin/manage");
        break;
      case "WITHDRAWAL_REQUESTED":
        navigate("/admin/withdrawal");
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

      {showNotifications && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] sm:hidden"
          aria-hidden="true"
          onClick={() => setShowNotifications(false)}
        />
      )}

      <header className="sticky top-0 z-50 w-full shrink-0">

        <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border-b border-gray-100/80" />
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-violet-400/40 to-transparent" />

        <div className="relative flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto gap-3">


          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25">
                <span
                  className="material-symbols-outlined text-white text-[16px] leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  recycling
                </span>
                <div className="absolute top-0.75 left-0.75 w-2 h-1 rounded-full bg-white/30" />
              </div>

              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[13.5px] font-extrabold text-gray-900 tracking-[-0.02em]">
                  Smart<span className="text-emerald-600">Waste</span>
                </span>
                <span className="text-[9.5px] text-gray-400 tracking-[0.12em] uppercase font-semibold mt-0.5">
                  Admin Portal
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
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Super Admin role badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-full pl-2 pr-3 py-1 shrink-0">
              <span
                className="material-symbols-outlined text-violet-500 text-[13px] leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield
              </span>
              <span className="text-[11px] font-semibold text-violet-700 tracking-[0.01em]">
                Super Admin
              </span>
            </div>

            <div className="w-px h-4 bg-gray-200 mx-0.5" aria-hidden="true" />

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
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60
                  ${showNotifications
                    ? "bg-violet-50 text-violet-600"
                    : "hover:bg-gray-100 hover:text-gray-700"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px] leading-none">
                  {showNotifications ? "notifications_active" : "notifications"}
                </span>

                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-0.75 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

  
              {showNotifications && (
                <div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Notifications"
                  className="
                    absolute right-0 mt-2.5
                    w-85 sm:w-95
                    bg-white rounded-2xl
                    shadow-[0_8px_30px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]
                    border border-gray-100
                    overflow-hidden z-50
                  "
                  style={{
                    animation: "slideDown 0.18s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  <style>{`
                    @keyframes slideDown {
                      from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                  `}</style>


                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-violet-500 text-[18px] leading-none">
                        notifications_active
                      </span>
                      <h2 className="text-[13.5px] font-semibold text-gray-800 leading-none">
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[11px] font-semibold leading-none">
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


                  <div
                    className="overflow-y-auto overscroll-contain"
                    style={{ maxHeight: "420px" }}
                    role="list"
                  >
                    {!hasNotifications ? (
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
                            Incoming requests will appear here
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
                                  focus-visible:outline-none focus-visible:bg-violet-50/60
                                  ${!n.isRead
                                    ? "bg-violet-50/40 hover:bg-violet-50"
                                    : "hover:bg-gray-50"
                                  }
                                `}
                              >
                                <div
                                  className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bgClass}`}
                                >
                                  <span
                                    className={`material-symbols-outlined text-[17px] leading-none ${cfg.colorClass}`}
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    {cfg.icon}
                                  </span>
                                </div>

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
                                        className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-violet-500"
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


                  {hasNotifications && (
                    <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/50 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {notifications.length} notification
                        {notifications.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-gray-200 mx-0.5" aria-hidden="true" />

  
            <button
              type="button"
              aria-label={`User menu for ${userName}`}
              className="
                group flex items-center gap-2 pl-1 pr-2.5 py-1
                rounded-lg hover:bg-gray-100 active:bg-gray-200
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60
              "
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-violet-200 group-hover:ring-violet-300 transition-all">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={`${userName}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold leading-none">
                      {initials}
                    </span>
                  </div>
                )}
              </div>


              <div className="hidden sm:flex flex-col text-left min-w-0">
                <span className="text-[13px] font-semibold text-gray-800 leading-tight truncate max-w-27.5 group-hover:text-gray-900 transition-colors">
                  {userName}
                </span>
                <span className="text-[10.5px] text-gray-400 leading-tight tracking-[0.02em]">
                  Super Admin
                </span>
              </div>

            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
