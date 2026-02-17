import React from 'react';
import { Alert, Paper, Stack, Typography } from '@mui/material';
import { api } from '../services/api';

export default function Transactions() {
  const [items, setItems] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    (async () => {
      setError('');
      try {
        const { data } = await api.get('/transactions');
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.msg || 'Failed to load transactions');
      }
    })();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Transactions</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 2 }}>
        {items.length === 0 ? (
          <Typography>No transactions found.</Typography>
        ) : (
          <Stack spacing={1}>
            {items.map((t) => (
              <Paper key={t._id} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700}>{String(t.type).toUpperCase()}</Typography>
                <Typography>Amount: {t.amount}</Typography>
                {t.toUserId ? <Typography>To: {String(t.toUserId)}</Typography> : null}
                <Typography>Date: {t.date ? new Date(t.date).toLocaleString() : '-'}</Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
