import React, { useEffect, useState } from "react";

const SettingRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
    <div style={{ opacity: 0.85 }}>{label}</div>
    <div style={{ fontWeight: 600 }}>{value}</div>
  </div>
);

export default function AdminSettings() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Admin Settings</h1>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxWidth: 900,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700 }}>Theme</div>
            <div style={{ opacity: 0.85, fontSize: 14 }}>Switch between light and dark mode.</div>
          </div>

          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: "16px 0" }} />

        <div style={{ display: "grid", gap: 12 }}>
          <SettingRow label="Admin Panel Name" value="FinSight Bank" />
          <SettingRow label="Session Timeout" value="15 minutes (placeholder)" />
          <SettingRow label="Security Mode" value="Standard (placeholder)" />
        </div>
      </div>
    </div>
  );
}
