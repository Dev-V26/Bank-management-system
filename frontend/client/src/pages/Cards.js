import React from 'react';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { api } from '../services/api';

export default function Cards() {
  const [atm, setAtm] = React.useState(null);
  const [cc, setCc] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const load = React.useCallback(async () => {
    try {
      const a = await api.get('/atm/status');
      setAtm(a.data);
    } catch {}
    try {
      const c = await api.get('/credit-card/status');
      setCc(c.data);
    } catch {}
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const applyATM = async () => {
    setMessage('');
    setError('');
    try {
      const { data } = await api.post('/atm/apply');
      setMessage(data.msg || 'ATM request submitted');
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'ATM apply failed');
    }
  };

  const applyCC = async () => {
    setMessage('');
    setError('');
    try {
      const { data } = await api.post('/credit-card/apply');
      setMessage(data.msg || 'Credit card request submitted');
      await load();
    } catch (err) {
      setError(err?.response?.data?.msg || 'Credit card apply failed');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Cards</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography fontWeight={700}>ATM Card</Typography>
          <Typography>Status: {atm?.atmCardStatus || '-'}</Typography>
          <Button variant="contained" onClick={applyATM} sx={{ width: 'fit-content' }}>
            Apply ATM Card
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography fontWeight={700}>Credit Card</Typography>
          <Typography>Status: {cc?.creditCardStatus || '-'}</Typography>
          <Button variant="contained" onClick={applyCC} sx={{ width: 'fit-content' }}>
            Apply Credit Card
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
