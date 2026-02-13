import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { ColorModeProvider, useColorMode } from "./theme/ColorModeContext";

import AuthGate from "./components/AuthGate";
import AppShell from "./components/AppShell";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Loan from "./pages/Loan";
import FixedDeposits from "./pages/FixedDeposits";
import Cards from "./pages/Cards";
import Settings from "./pages/Settings";

// Existing admin pages
import AdminUsers from "./pages/admin/Users";
import AdminLoanRequests from "./pages/admin/LoanRequests";
import AdminATMRequests from "./pages/admin/ATMRequests";
import AdminCreditCardRequests from "./pages/admin/CreditCardRequests";
import AdminAccountReport from "./pages/admin/AccountReport";

// New admin layout + pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";

function ThemedApp() {
  const { theme } = useColorMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* ---------------- Public ---------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ---------------- User Area ---------------- */}
          <Route element={<AuthGate allow={["user"]} />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/loan" element={<Loan />} />
              <Route path="/fixed-deposits" element={<FixedDeposits />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* ---------------- Admin Area ---------------- */}
          <Route element={<AuthGate allow={["admin"]} />}>
            {/* Redirect /admin to the real dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* IMPORTANT: AdminLayout already contains the sidebar.
                We do NOT wrap admin routes with AppShell, otherwise you will see 2 sidebars. */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="loan-requests" element={<AdminLoanRequests />} />
              <Route path="atm-requests" element={<AdminATMRequests />} />
              <Route path="credit-card-requests" element={<AdminCreditCardRequests />} />
              <Route path="report" element={<AdminAccountReport />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ColorModeProvider>
      <ThemedApp />
    </ColorModeProvider>
  );
}
