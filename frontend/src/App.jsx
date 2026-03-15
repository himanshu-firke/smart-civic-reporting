import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { getAuth } from "./auth/authStorage";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

import { CitizenDashboardPage } from "./pages/dashboards/CitizenDashboardPage";
import { ReportIssuePage } from "./pages/dashboards/ReportIssuePage";
import { SuperAdminDashboardPage } from "./pages/dashboards/SuperAdminDashboardPage";
import { DepartmentManagementPage } from "./pages/dashboards/DepartmentManagementPage";
import { DepartmentAdminDashboardPage } from "./pages/dashboards/DepartmentAdminDashboardPage";
import { WorkerDashboardPage } from "./pages/dashboards/WorkerDashboardPage";

function RoleIndex() {
  const auth = getAuth();
  if (!auth?.token || !auth?.role) return <Navigate to="/login" replace />;

  switch (auth.role) {
    case "Citizen":
      return <Navigate to="/citizen" replace />;
    case "SuperAdmin":
      return <Navigate to="/super-admin" replace />;
    case "DepartmentAdmin":
    case "Department Admin":
      return <Navigate to="/department-admin" replace />;
    case "Worker":
      return <Navigate to="/worker" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/app" element={<RoleIndex />} />

        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <CitizenDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/report-issue"
          element={
            <ProtectedRoute allowedRoles={["Citizen"]}>
              <ReportIssuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/departments"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <DepartmentManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department-admin"
          element={
            <ProtectedRoute allowedRoles={["DepartmentAdmin", "Department Admin"]}>
              <DepartmentAdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/department-admin"
          element={
            <ProtectedRoute allowedRoles={["Department Admin"]}>
              <DepartmentAdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/super-admin"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRoles={["Worker"]}>
              <WorkerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
