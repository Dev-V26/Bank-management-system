import React from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { api } from '../services/api';
import { useColorMode } from '../theme/ColorModeContext';

export default function Settings() {
  const { mode, toggle } = useColorMode();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/account');
        setName(data.name || '');
        setEmail(data.email || '');
      } catch {}
    })();
  }, []);

  const save = async () => {
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/account', { name, email });
      setMessage(data.msg || 'Saved');
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to save');
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 720 }}>
      <Typography variant="h4" fontWeight={800}>Settings</Typography>

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography fontWeight={700}>Appearance</Typography>
          <Typography>Current Theme: {mode}</Typography>
          <Button variant="outlined" onClick={toggle} sx={{ width: 'fit-content' }}>
            Toggle Theme
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography fontWeight={700}>Profile</Typography>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button variant="contained" onClick={save} sx={{ width: 'fit-content' }}>
            Save
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
