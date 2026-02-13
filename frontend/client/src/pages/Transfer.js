import React from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { api } from '../services/api';

export default function Transfer() {
  const [toEmail, setToEmail] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        setError('Amount must be a positive number');
        return;
      }
      const { data } = await api.post('/transfer', { toEmail, amount: amt });
      setMessage(`Transfer successful. New balance: ${data.balance}`);
      setToEmail('');
      setAmount('');
    } catch (err) {
      setError(err?.response?.data?.msg || 'Transfer failed');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Transfer Money</Typography>

      <Paper sx={{ p: 3, maxWidth: 520 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            {message ? <Alert severity="success">{message}</Alert> : null}
            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField label="Receiver Email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} required />
            <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Button type="submit" variant="contained">Send</Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
