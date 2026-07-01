import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setCitizenInactive } from "../../api/auth";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/authContext";
 
interface CitizenSidebarProps {
  onClose?: () => void;
  co2SavedKg?: number;
  co2GoalKg?: number;
}
 
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "Dashboard",     path: "/citizen",          icon: "grid_view",              label: "Dashboard",     exact: true },
      { id: "RequestStatus", path: "/citizen/status",   icon: "format_list_bulleted",   label: "My Requests"               },
    ],
  },
  {
    label: "Actions",
    items: [
      { id: "Request",  path: "/citizen/request",  icon: "add_circle",         label: "New Request" },
      { id: "Earnings", path: "/citizen/earnings", icon: "account_balance_wallet", label: "Earnings"    },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "Guidelines", path: "/citizen/guidelines", icon: "menu_book", label: "Guidelines" },
      { id: "Profile",    path: "/citizen/profile",    icon: "person",    label: "My Profile" },
    ],
  },
];
 
const CitizenSidebar: React.FC<CitizenSidebarProps> = ({
  onClose,
  co2SavedKg = 12,
  co2GoalKg = 20,
}) => {
  const navigate = useNavigate();
  const _progressPercent = Math.min(Math.round((co2SavedKg / co2GoalKg) * 100), 100);
  const { logout } = useAuthContext();
  const handleLogout = async() => {
    await setCitizenInactive();
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };
 
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col overflow-y-auto shadow-sm">

      {onClose && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Navigation
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}
 

      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 select-none">
              {group.label}
            </p>
 

            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>

                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full bg-emerald-500" />
                      )}
 

                      <span
                        className={[
                          "material-symbols-outlined text-[20px] shrink-0 transition-colors duration-200",
                          isActive
                            ? "text-emerald-600"
                            : "text-gray-400 group-hover:text-gray-600",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>
 
                      <span className="leading-none">{item.label}</span>
 

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
 

      <div className="px-3 pb-4 space-y-3 shrink-0">
 
        {/* Eco Impact Card
        <div className="relative mx-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white overflow-hidden shadow-lg shadow-emerald-600/20">
\
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-6 -left-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-3 right-6 w-6 h-6 rounded-full bg-white/10 pointer-events-none" />
 
          <div className="relative z-10 space-y-3">
      
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-200 text-[15px]">eco</span>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-emerald-100">
                Your Impact
              </p>
            </div>
 

            <div>
              <p className="text-3xl font-extrabold leading-none tracking-tight">
                {co2SavedKg}
                <span className="text-base font-semibold text-emerald-200 ml-1">kg</span>
              </p>
              <p className="text-xs text-emerald-100/80 mt-0.5">CO₂ saved this month</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] text-emerald-100/70 mb-1">
                <span>Monthly goal</span>
                <span className="font-semibold text-white">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/70 transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-emerald-100/60 mt-1">
                {co2GoalKg - co2SavedKg} kg remaining to goal
              </p>
            </div>
          </div>
        </div> */}
 

        <div className="border-t border-gray-100 mx-1" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <span className="material-symbols-outlined text-[20px] transition-colors group-hover:text-red-500">
            logout
          </span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
 
export default CitizenSidebar;
