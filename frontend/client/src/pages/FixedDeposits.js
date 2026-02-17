import React from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { api } from '../services/api';

export default function FixedDeposits() {
  const [items, setItems] = React.useState([]);
  const [amount, setAmount] = React.useState('');
  const [interestRate, setInterestRate] = React.useState('7');
  const [duration, setDuration] = React.useState('12'); // months
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const load = React.useCallback(async () => {
    try {
      const { data } = await api.get('/fixed-deposits');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to load fixed deposits');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const apply = async () => {
    setMessage('');
    setError('');
    try {
      const a = Number(amount);
      const r = Number(interestRate);
      const d = Number(duration);
      if (!Number.isFinite(a) || a <= 0) return setError('Amount must be positive');
      if (!Number.isFinite(r) || r <= 0) return setError('Interest rate must be positive');
      if (!Number.isFinite(d) || d <= 0) return setError('Duration must be positive (months)');
      const { data } = await api.post('/fixed-deposit/apply', { amount: a, interestRate: r, duration: d });
      setMessage(data.msg || 'Application submitted');
      setAmount('');
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Application failed');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Fixed Deposits</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <Typography fontWeight={700} gutterBottom>Apply</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
          <TextField label="Interest Rate (%)" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} fullWidth />
          <TextField label="Duration (months)" value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth />
          <Button variant="contained" onClick={apply}>Submit</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {items.length === 0 ? (
          <Typography>No fixed deposits found.</Typography>
        ) : (
          <Stack spacing={1}>
            {items.map((fd) => (
              <Paper key={fd._id} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700}>Amount: {fd.amount}</Typography>
                <Typography>Rate: {fd.interestRate}%</Typography>
                <Typography>Duration: {fd.duration} months</Typography>
                <Typography>Maturity: {fd.maturityDate ? new Date(fd.maturityDate).toLocaleDateString() : '-'}</Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
