import { VerifiedTaskData, WithdrawRequestData } from "@/Types/types";
import { apiRequest, publicApiRequest } from "./client";

const BASE_URL = "http://localhost:3000";

interface dataType {
  name: string;
  email: string;
  password: string;
  address: string;
  zoneId: number;
}

interface loginType {
  email: string;
  password: string;
}

interface workerType {
  name: string;
  email: string;
  phone: string;
  zoneId: number;
  vehicle: string;
  status: string;
  password: string;
}

export async function registerUser(data: dataType) {
  return publicApiRequest("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: loginType) {
  return publicApiRequest("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getZones() {
  return publicApiRequest("/zones", {
    method: "GET",
  });
}

export async function logoutUser() {
  return publicApiRequest("/logout", {
    method: "POST",
  });
}

export async function setCitizenInactive() {
  return apiRequest("/citizen/status", {
    method: "PUT",
    body: JSON.stringify({ status: "INACTIVE" }),
  });
}

export async function setWorkerInactive() {
  return apiRequest("/worker/status", {
    method: "PUT",
    body: JSON.stringify({ status: "INACTIVE" }),
  });
}

export async function RefreshAccessToken() {
  const res = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  });

  return res.json();
}

export async function registerWorker(data: workerType) {
  return apiRequest("/admin/worker", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getCitizenData() {
  return apiRequest("/citizen", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function pickuprequests() {
  return apiRequest("/citizen/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getSavedAddresses(userId: number) {
  return apiRequest(`/citizen/request/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function manageRequests() {
  return apiRequest("/admin/manage", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function assignRequest(
  requestId: number,
  data: { workerId: number; routeId?: number },
) {
  return apiRequest(`/admin/manage/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function rejectRequest(requestId: number) {
  return apiRequest(`/admin/manage/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "Rejected" }),
  });
}

export async function getworkerData() {
  return apiRequest("/admin/worker", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateWorker(
  workerId: number,
  data: { zoneId: number; vehicle: string; responsibleFor: string },
) {
  return apiRequest(`/admin/worker/${workerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deactivateWorker(workerId: number) {
  return apiRequest(`/admin/worker/${workerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "INACTIVE" }),
  });
}

export async function deleteWorker(workerId: number) {
  return apiRequest(`/admin/worker/${workerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getTasks() {
  return apiRequest("/worker", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function tasksHistory() {
  return apiRequest("/worker/taskhistory", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function verifiedTask(requestId: number, data: VerifiedTaskData) {
  return apiRequest(`/worker/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: data }),
  });
}


export async function transactionHistory(userId: number) {
  return apiRequest(`/citizen/transaction/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateTaskStatus(requestId: number, status: string) {
  return apiRequest(`/worker/status/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: status }),
  });
}

export async function withdrawRequest(data: WithdrawRequestData) {
  return apiRequest("/citizen/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function allWithdrawalRequests() {
  return apiRequest(`/admin/withdrawal`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function approveWithdrawal(id: number) {
  return apiRequest(`/admin/withdrawal/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function rejectWithdrawal(id: number) {
  return apiRequest(`/admin/withdrawal/reject/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updatedPassword(data: {
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiRequest(`/citizen/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updatedCitizenProfile(data: {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}) {
  return apiRequest(`/citizen/update/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}


export async function deleteCitizenAccount() {
  return apiRequest(`/citizen/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getAuditLogs() {
  return apiRequest(`/admin/audit-logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getSystemReport() {
  return apiRequest(`/admin/reports`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function adminDashboardData() {
  return apiRequest(`/admin/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateNotificationStatus(id: number) {
  return apiRequest(`/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updatedWorkerPassword(data: {
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiRequest(`/worker/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updatedWorkerProfile(data: {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}) {
  return apiRequest(`/worker/update/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteWorkerAccount() {
  return apiRequest(`/worker/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getNotifications(lastId: number) {
  return apiRequest(`/notifications/long-poll?lastId=${lastId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    credentials: "include",
  });
}

export async function getUnreadNotifications() {
  return apiRequest(`/unread/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    credentials: "include",
  });
}

