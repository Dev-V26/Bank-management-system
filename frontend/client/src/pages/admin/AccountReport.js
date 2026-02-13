import React from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { api } from '../../services/api';

export default function AccountReport() {
  const [userId, setUserId] = React.useState('');
  const [report, setReport] = React.useState(null);
  const [error, setError] = React.useState('');

  const fetchReport = async () => {
    setError('');
    setReport(null);
    try {
      const { data } = await api.get(`/account/report/${userId}`);
      setReport(data);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to fetch report');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Account Report</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} fullWidth />
          <Button variant="contained" onClick={fetchReport}>Fetch</Button>
        </Stack>
      </Paper>

      {report ? (
        <Paper sx={{ p: 3 }}>
          <Typography fontWeight={700}>User</Typography>
          <Typography>Name: {report.user?.name}</Typography>
          <Typography>Email: {report.user?.email}</Typography>
          <Typography>Balance: {report.user?.balance}</Typography>

          <Typography fontWeight={700} sx={{ mt: 2 }}>Transactions</Typography>
          <Typography>{(report.transactions || []).length} items</Typography>

          <Typography fontWeight={700} sx={{ mt: 2 }}>Loans</Typography>
          <Typography>{(report.loans || []).length} items</Typography>

          <Typography fontWeight={700} sx={{ mt: 2 }}>Fixed Deposits</Typography>
          <Typography>{(report.fixedDeposits || []).length} items</Typography>

          <Typography fontWeight={700} sx={{ mt: 2 }}>ATM Cards</Typography>
          <Typography>{(report.atmCards || []).length} items</Typography>

          <Typography fontWeight={700} sx={{ mt: 2 }}>Credit Cards</Typography>
          <Typography>{(report.creditCards || []).length} items</Typography>
        </Paper>
      ) : null}
    </Stack>
  );
}
