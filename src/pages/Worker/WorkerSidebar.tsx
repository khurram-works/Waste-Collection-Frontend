import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setWorkerInactive } from "../../api/auth";
import {toast} from "react-toastify";
import { useAuthContext } from "../../context/authContext";
 
const navItems = [
  {
    id: "task",
    path: "/worker",
    icon: "task_alt",
    label: "My Tasks",
    exact: true,
    badge: null,
  },
  {
    id: "taskhistory",
    path: "/worker/taskhistory",
    icon: "history",
    label: "Task History",
    badge: null,
  },
  {
    id: "profile",
    path: "/worker/profile",
    icon: "manage_accounts",
    label: "Profile",
    badge: null,
  },
];
 
function WorkerSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthContext();
 
  const handleLogout = async () => {
    await setWorkerInactive();
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };
 
  return (
    <aside
      className={`${
        collapsed ? "w-[68px]" : "w-64"
      } bg-white flex flex-col justify-between py-5 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r border-[#dde3e0]`}
    >
      {/* Top section */}
      <div className="flex flex-col gap-1 px-3">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-end mb-3 pr-1 text-gray-500 hover:text-gray-300 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
 
        {/* Section label */}
        {!collapsed && (
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.15em] px-3 mb-2">
            Navigation
          </p>
        )}
 
        {/* Nav items */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.exact}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:bg-gray-100 border border-transparent"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[20px] flex-shrink-0 transition-colors ${
                      isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
 
        {/* Divider */}
        <div className="my-2 border-t border-[#dde3e0] mx-1" />
 
        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Log Out" : undefined}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-150 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="material-symbols-outlined text-[20px] flex-shrink-0 group-hover:text-red-400 transition-colors">
            logout
          </span>
          {!collapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>
      </div>
 
      {/* Shift status */}
      <div className="px-3">
        {collapsed ? (
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        ) : (
          <div className="bg-emerald-500/15 border border-emerald-500/20 rounded-xl p-3 mx-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.12em]">
                Shift Status
              </p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-6 h-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute w-4 h-4 rounded-full bg-emerald-500/20 animate-ping" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400">Active Shift</span>
                <p className="text-[10px] text-gray-600 leading-none mt-0.5">On duty now</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
 
export default WorkerSidebar;
