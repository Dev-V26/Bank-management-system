import React from "react";

const Card = ({ title, subtitle }) => (
  <div
    style={{
      padding: 16,
      borderRadius: 12,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div style={{ fontSize: 14, opacity: 0.85 }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 16, fontWeight: 600 }}>{subtitle}</div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Admin Dashboard</h1>

      <div
        style={{
          padding: 16,
          borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxWidth: 900,
        }}
      >
        <p style={{ margin: 0, opacity: 0.9 }}>
          Use the sidebar to manage users and requests.
        </p>
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <Card title="Users" subtitle="Manage all users" />
        <Card title="Loan Requests" subtitle="Review & approve loans" />
        <Card title="ATM Requests" subtitle="Handle ATM services" />
        <Card title="Credit Card Requests" subtitle="Approve card requests" />
      </div>
    </div>
  );
}
