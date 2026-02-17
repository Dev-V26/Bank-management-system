import React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { api } from "../services/api";

// ---------- helpers ----------
const currencySymbol = (code) => {
  const map = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };
  return map[String(code || "INR").toUpperCase()] || "₹";
};

const formatMoney = (amount, currency = "INR") => {
  const sym = currencySymbol(currency);
  const n = Number(amount || 0);
  const locale = String(currency).toUpperCase() === "INR" ? "en-IN" : "en-US";
  return `${sym} ${n.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
};

export default function Dashboard() {
  const [account, setAccount] = React.useState(null);
  const [error, setError] = React.useState("");

  // Currency state (works even if backend doesn't return currency)
  const [currency, setCurrency] = React.useState("INR");
  const [savingCurrency, setSavingCurrency] = React.useState(false);

  // Add Balance dialog state
  const [addOpen, setAddOpen] = React.useState(false);
  const [addAmount, setAddAmount] = React.useState("");
  const [adding, setAdding] = React.useState(false);

  const load = React.useCallback(async () => {
    setError("");
    try {
      const { data } = await api.get("/account");

      // ✅ Support different response shapes
      const acct = data?.account || data?.user || data;

      setAccount(acct);

      // ✅ If backend provides currency, use it, else fallback to existing currency
      if (acct?.currency) setCurrency(String(acct.currency).toUpperCase());
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err?.response?.data?.msg || "Failed to load account");
      setAccount(null);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const currentCurrency = String(account?.currency || currency || "INR").toUpperCase();

  const handleAddBalance = async () => {
    setError("");

    const amount = Number(addAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    try {
      setAdding(true);
      const { data } = await api.post("/balance/add", { amount });

      // Update balance locally
      setAccount((prev) => ({
        ...(prev || {}),
        balance: data?.balance ?? (prev?.balance ?? 0),
        currency: data?.currency ? String(data.currency).toUpperCase() : prev?.currency,
      }));

      if (data?.currency) setCurrency(String(data.currency).toUpperCase());

      setAddOpen(false);
      setAddAmount("");
    } catch (err) {
      console.error("Add balance error:", err);
      setError(err?.response?.data?.msg || "Failed to add balance");
    } finally {
      setAdding(false);
    }
  };

  const handleSaveCurrency = async () => {
    setError("");
    const nextCurrency = String(currency || "INR").toUpperCase();

    try {
      setSavingCurrency(true);
      const { data } = await api.put("/settings/currency", { currency: nextCurrency });

      const saved = String(data?.currency || nextCurrency).toUpperCase();
      setCurrency(saved);

      // Keep account in sync too
      setAccount((prev) => (prev ? { ...prev, currency: saved } : prev));
    } catch (err) {
      console.error("Save currency error:", err);
      setError(err?.response?.data?.msg || "Failed to save currency");
    } finally {
      setSavingCurrency(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Dashboard
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            Account Details
          </Typography>

          <Typography>Name: {account?.name || "-"}</Typography>
          <Typography>Email: {account?.email || "-"}</Typography>

          <Typography>
            Balance:{" "}
            {account?.balance == null ? "-" : formatMoney(account.balance, currentCurrency)}
          </Typography>

          <Typography>Loan Status: {account?.loanStatus || "none"}</Typography>
          <Typography>ATM Card Status: {account?.atmCardStatus || "none"}</Typography>
          <Typography>Credit Card Status: {account?.creditCardStatus || "none"}</Typography>

          {/* Buttons */}
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Button onClick={load} variant="outlined" sx={{ width: "fit-content" }}>
              Refresh
            </Button>

            <Button
              onClick={() => setAddOpen(true)}
              variant="contained"
              sx={{ width: "fit-content" }}
            >
              Add Balance
            </Button>
          </Stack>

          {/* Currency Settings */}
          <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Typography sx={{ minWidth: 80 }}>Currency:</Typography>

            <Select
              size="small"
              value={currency}
              onChange={(e) => setCurrency(String(e.target.value).toUpperCase())}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="INR">INR (₹)</MenuItem>
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
              <MenuItem value="CAD">CAD (C$)</MenuItem>
              <MenuItem value="AUD">AUD (A$)</MenuItem>
            </Select>

            <Button
              onClick={handleSaveCurrency}
              variant="outlined"
              disabled={savingCurrency}
              sx={{ width: "fit-content" }}
            >
              {savingCurrency ? "Saving..." : "Save Currency"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Add Balance Dialog */}
      <Dialog open={addOpen} onClose={() => !adding && setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Balance</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1, opacity: 0.8 }}>
            Currency: {currentCurrency} ({currencySymbol(currentCurrency)})
          </Typography>

          <TextField
            autoFocus
            fullWidth
            type="number"
            label="Amount"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            margin="dense"
            inputProps={{ min: 0, step: "0.01" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} disabled={adding}>
            Cancel
          </Button>
          <Button onClick={handleAddBalance} variant="contained" disabled={adding}>
            {adding ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}