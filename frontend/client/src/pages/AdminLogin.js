import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { api } from '../services/api';
import { setRole, setToken } from '../services/auth';

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/admin/login', { email, password });
      setToken(data.token);
      setRole('admin');
      nav('/admin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.msg || 'Admin login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Admin Login
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
          Default admin: admin@example.com / admin123
        </Typography>

        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Admin Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="contained" size="large">
              Login
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login">User login</Link>
        </Stack>
      </Paper>
    </Container>
  );
}
