import React from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { api } from '../services/api';

export default function Loan() {
  const [status, setStatus] = React.useState(null);
  const [applyAmount, setApplyAmount] = React.useState('');
  const [payAmount, setPayAmount] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const load = React.useCallback(async () => {
    try {
      const { data } = await api.get('/loan/status');
      setStatus(data);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to load loan status');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const apply = async () => {
    setError('');
    setMessage('');
    try {
      const amt = Number(applyAmount);
      if (!Number.isFinite(amt) || amt <= 0) {
        setError('Loan amount must be a positive number');
        return;
      }
      const { data } = await api.post('/loan/apply', { amount: amt });
      setMessage(data.msg || 'Loan application submitted');
      setApplyAmount('');
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Loan apply failed');
    }
  };

  const pay = async () => {
    setError('');
    setMessage('');
    try {
      const amt = Number(payAmount);
      if (!Number.isFinite(amt) || amt <= 0) {
        setError('Payment amount must be a positive number');
        return;
      }
      const { data } = await api.post('/loan/pay', { amount: amt });
      setMessage(`Payment done. Balance: ${data.balance}, Loan remaining: ${data.loanAmount}`);
      setPayAmount('');
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Loan payment failed');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Loan</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Typography fontWeight={700} gutterBottom>Current Status</Typography>
        <Typography>Loan Status: {status?.loanStatus || 'none'}</Typography>
        <Typography>Loan Amount: {status?.loanAmount ?? 0}</Typography>
      </Paper>

      <Paper sx={{ p: 3, maxWidth: 520 }}>
        <Typography fontWeight={700} gutterBottom>Apply for Loan</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Amount" value={applyAmount} onChange={(e) => setApplyAmount(e.target.value)} fullWidth />
          <Button variant="contained" onClick={apply}>Apply</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, maxWidth: 520 }}>
        <Typography fontWeight={700} gutterBottom>Pay Loan</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Amount" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} fullWidth />
          <Button variant="contained" onClick={pay}>Pay</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
