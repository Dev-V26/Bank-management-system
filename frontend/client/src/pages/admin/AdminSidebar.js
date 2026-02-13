import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    color: "white",
    textDecoration: "none",
    borderLeft: isActive ? "4px solid #ffffff" : "4px solid transparent",
    background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
    opacity: isActive ? 1 : 0.9,
  });

  return (
    <aside
      style={{
        width: 260,
        background: "#0f0f10",
        borderRight: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          fontWeight: 700,
        }}
      >
        Admin Panel
      </div>

      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        <NavLink to="/admin/dashboard" style={linkStyle}>🏠 <span>Admin Dashboard</span></NavLink>
        <NavLink to="/admin/users" style={linkStyle}>👤 <span>Users</span></NavLink>
        <NavLink to="/admin/loan-requests" style={linkStyle}>💳 <span>Loan Requests</span></NavLink>
        <NavLink to="/admin/atm-requests" style={linkStyle}>🏧 <span>ATM Requests</span></NavLink>
        <NavLink to="/admin/credit-card-requests" style={linkStyle}>💳 <span>Credit Card Requests</span></NavLink>
        <NavLink to="/admin/report" style={linkStyle}>📄 <span>Account Report</span></NavLink>
        <NavLink to="/admin/settings" style={linkStyle}>⚙️ <span>Settings</span></NavLink>
      </div>

      <div style={{ marginTop: "auto", padding: 10, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/admin-login");
          }}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
