import React from 'react';
import { Alert, Paper, Stack, Typography } from '@mui/material';
import { api } from '../../services/api';

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    (async () => {
      setError('');
      try {
        const { data } = await api.get('/admin/users');
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.msg || 'Failed to load users');
      }
    })();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Users</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Paper sx={{ p: 2 }}>
        {users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <Stack spacing={1}>
            {users.map((u) => (
              <Paper key={u._id} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700}>{u.name}</Typography>
                <Typography>{u.email}</Typography>
                <Typography>Balance: {u.balance}</Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
