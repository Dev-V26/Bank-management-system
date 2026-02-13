import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            background: "#2b2b2b",
            color: "white",
          }}
        >
          <div style={{ fontWeight: 700 }}>FinSight Bank</div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ opacity: 0.85, fontSize: 14 }}>Admin</span>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
