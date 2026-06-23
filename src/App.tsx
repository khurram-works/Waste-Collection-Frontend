import React from "react";
import "./App.css";
import SmartWastePlatform from "./pages/landingpage";
import SmartWasteLogin from "./pages/loginpage";
import SmartWasteRegister from "./pages/signuppage";
import SmartWasteCitizenDashboard from "./pages/citizendashboard";
import SmartWasteWorkerDashboard from "./pages/workerdashboard";
import AdminDashboard from "./pages/admindashboard";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SmartWasteunAuthorize from "./components/unauthorizeAccess";
import ProtectedRoute from "./components/protectedRoute";
import CitizenDashboardView from "./pages/Citizen/CitizenDashboardView";
import CitizenRequestView from "./pages/Citizen/CitizenRequestView";
import CitizenRequestStatusView from "./pages/Citizen/CitizenRequestStatusView";
import CitizenEarningsView from "./pages/Citizen/CitizenEarningsView";
import CitizenGuidelinesView from "./pages/Citizen/CitizenGuidelinesView";
import CitizenProfileView from "./pages/Citizen/CitizenProfileView";
import DashboardView from "./pages/Admin/DashboardView";
import ManageView from "./pages/Admin/ManageView";
import WorkerView from "./pages/Admin/WorkerView";
import ReportView from "./pages/Admin/ReportView";
import AuditLogs from "./pages/Admin/AuditLogs";
import TaskListView from "./pages/Worker/TasklistView";
import TaskHistory from "./pages/Worker/TaskHistory";
import Profile from "./pages/Worker/Profile";
import PublicRoute from "./pages/publicRoute";
import WithdrawalRequests from "./pages/Admin/withrawalRequests";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SmartWastePlatform />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<SmartWasteLogin />} />
          <Route path="/register" element={<SmartWasteRegister />} />
        </Route>

        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <SmartWasteCitizenDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<CitizenDashboardView />} />
          <Route path="request" element={<CitizenRequestView />} />
          <Route path="status" element={<CitizenRequestStatusView />} />
          <Route path="earnings" element={<CitizenEarningsView />} />
          <Route path="guidelines" element={<CitizenGuidelinesView />} />
          <Route path="profile" element={<CitizenProfileView />} />
        </Route>
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRoles={["WORKER"]}>
              <SmartWasteWorkerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<TaskListView />} />
          <Route path="taskhistory" element={<TaskHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardView />} />
          <Route path="manage" element={<ManageView />} />
          <Route path="worker" element={<WorkerView />} />
          <Route path="withdrawal" element={<WithdrawalRequests />} />
          <Route path="report" element={<ReportView />} />
          <Route path="audit" element={<AuditLogs />} />
        </Route>
        <Route path="/unauthorized" element={<SmartWasteunAuthorize />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
      />
    </>
  );
}

export default App;
