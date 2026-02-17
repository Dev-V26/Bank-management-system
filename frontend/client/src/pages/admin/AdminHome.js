import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';

export default function AdminHome() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Admin Dashboard</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Use the sidebar to manage users and requests.</Typography>
      </Paper>
    </Stack>
  );
}
