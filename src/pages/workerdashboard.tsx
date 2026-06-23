import React from "react";
import WorkerHeader from "./Worker/WorkerHeader";
import WorkerSidebar from "./Worker/WorkerSidebar";
import { useAuthContext } from "../context/authContext";
import { Outlet } from "react-router-dom";
 
export default function WorkerDashboard() {
  const { user } = useAuthContext();
 
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f4f2] font-display">
      <WorkerHeader user={user} />
      <div className="flex flex-1 overflow-hidden">
        <WorkerSidebar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}