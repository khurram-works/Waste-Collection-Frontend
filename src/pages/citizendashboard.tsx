import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CitizenHeader from "./Citizen/CitizenHeader";
import CitizenSidebar from "./Citizen/CitizenSidebar";
import { useAuthContext } from "../context/authContext";
 
export default function CitizenDashboard() {
  const { user } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
 
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);
 
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
 
      <CitizenHeader
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">

        <div
          className={[
            "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden",
            "transition-opacity duration-300",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
 
        <div
          className={[
            "fixed inset-y-0 left-0 z-40 flex flex-col",
            "lg:static lg:z-auto lg:translate-x-0 lg:flex",
            "transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "pt-0",
          ].join(" ")}
          style={{ top: 0 }}
        >
          <CitizenSidebar
            onClose={() => setSidebarOpen(false)}
          />
        </div>
 
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}