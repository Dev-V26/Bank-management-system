import React from 'react';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { api } from '../../services/api';

export default function LoanRequests() {
  const [items, setItems] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const load = React.useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/admin/loans');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to load loan requests');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const decide = async (id, status) => {
    setMessage('');
    setError('');
    try {
      const { data } = await api.post(`/admin/loan/${id}`, { status });
      setMessage(data.msg || `Loan ${status}`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Action failed');
    }
  };

  const pending = items.filter((l) => l.status === 'pending');

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Loan Requests</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 2 }}>
        {pending.length === 0 ? (
          <Typography>No pending loan requests.</Typography>
        ) : (
          <Stack spacing={1}>
            {pending.map((l) => (
              <Paper key={l._id} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700}>{l.userId?.name || 'User'}</Typography>
                <Typography>{l.userId?.email || '-'}</Typography>
                <Typography>Amount: {l.amount}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="contained" onClick={() => decide(l._id, 'approved')}>Approve</Button>
                  <Button variant="outlined" onClick={() => decide(l._id, 'rejected')}>Reject</Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
