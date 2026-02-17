import React from 'react';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { api } from '../../services/api';

export default function ATMRequests() {
  const [items, setItems] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const load = React.useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get('/admin/atm');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to load ATM requests');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const decide = async (id, status) => {
    setMessage('');
    setError('');
    try {
      const { data } = await api.post(`/admin/atm/${id}`, { status });
      setMessage(data.msg || `ATM ${status}`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Action failed');
    }
  };

  const pending = items.filter((i) => i.status === 'applied');

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>ATM Requests</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 2 }}>
        {pending.length === 0 ? (
          <Typography>No pending ATM requests.</Typography>
        ) : (
          <Stack spacing={1}>
            {pending.map((c) => (
              <Paper key={c._id} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700}>{c.userId?.name || 'User'}</Typography>
                <Typography>{c.userId?.email || '-'}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="contained" onClick={() => decide(c._id, 'issued')}>Issue</Button>
                  <Button variant="outlined" onClick={() => decide(c._id, 'rejected')}>Reject</Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
