import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import {toast} from "react-toastify";

const navItems = [
  {
    id: "dashboard",
    path: "/admin",
    icon: "grid_view",
    label: "Dashboard",
    exact: true,
  },
  {
    id: "manage",
    path: "/admin/manage",
    icon: "task_alt",
    label: "Request Mgmt",
  },
  {
    id: "worker",
    path: "/admin/worker",
    icon: "engineering",
    label: "Workers",
  },
  {
    id: "withdrawal",
    path: "/admin/withdrawal",
    icon: "account_balance_wallet",
    label: "Withdrawals",
  },
  {
    id: "report",
    path: "/admin/report",
    icon: "bar_chart_4_bars",
    label: "Reports",
  },
  {
    id: "audit",
    path: "/admin/audit",
    icon: "history_edu",
    label: "Audit Log",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const { logout } = useAuthContext();
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <aside className="w-[220px] fixed top-16 left-0 h-[calc(100vh-64px)] hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-[1px_0_12px_rgba(0,0,0,0.03)] z-40 overflow-y-auto">
      {/* ── Nav Section Label ── */}
      <div className="px-4 pt-5 pb-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Main Menu
        </span>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 group
              ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active left stripe */}
                {!isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-5 bg-emerald-500 rounded-r-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
                )}
                <span
                  className={`material-symbols-outlined text-[19px] flex-shrink-0 transition-colors duration-150
                    ${isActive ? "text-white" : "text-gray-400 group-hover:text-emerald-600"}`}
                  style={{
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 500"
                      : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[13px] tracking-tight ${isActive ? "font-semibold" : ""}`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 my-3 border-t border-gray-100" />

      {/* ── Logout ── */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
        >
          <span
            className="material-symbols-outlined text-[19px] text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            logout
          </span>
          Log Out
        </button>
      </div>

      {/* ── Status Badge ── */}
      <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center gap-2.5">
        <div className="relative w-2.5 h-2.5 flex-shrink-0">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <span className="relative block w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest leading-none">
            System Online
          </p>
          <p className="text-[9px] text-emerald-600/80 mt-0.5 leading-none">
            All services running
          </p>
        </div>
        <span
          className="material-symbols-outlined text-[14px] text-emerald-500 flex-shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
