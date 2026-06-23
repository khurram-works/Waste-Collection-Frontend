import React from "react";
import Header from "./Admin/Header";
import Sidebar from "./Admin/Sidebar";
import { useAuthContext } from "../context/authContext";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuthContext();

  return (
    <div className="bg-[#f7f8fa] min-h-screen font-sans text-[#121614] antialiased">
      <Header user={user} />
      <div className="flex">
        <Sidebar />
        {/* Main content — offset for fixed sidebar on large screens */}
        <main className="flex-1 lg:ml-[220px] min-h-[calc(100vh-64px)] transition-all duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
