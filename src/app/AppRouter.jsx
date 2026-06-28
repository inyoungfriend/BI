import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/dashboard/ui/DashboardPage";
import AttendancePage from "../pages/attendance/ui/AttendancePage";
import Sidebar from "../widgets/sidebar/ui/Sidebar";

function AppRouter() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRouter;
