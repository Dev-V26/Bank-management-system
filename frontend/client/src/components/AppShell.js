import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { clearRole, clearToken, getRole } from '../services/auth';
import { useColorMode } from '../theme/ColorModeContext';

const drawerWidth = 260;

function NavItem({ to, icon, label }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        '&.active': {
          fontWeight: 700,
        },
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

export default function AppShell() {
  const navigate = useNavigate();
  const role = getRole();
  const { mode, toggle } = useColorMode();

  const onLogout = () => {
    clearToken();
    clearRole();
    navigate('/login', { replace: true });
  };

  const userItems = [
    { to: '/', icon: <DashboardIcon />, label: 'Dashboard' },
    { to: '/transfer', icon: <SwapHorizIcon />, label: 'Transfer' },
    { to: '/transactions', icon: <ReceiptLongIcon />, label: 'Transactions' },
    { to: '/loan', icon: <AccountBalanceIcon />, label: 'Loan' },
    { to: '/fixed-deposits', icon: <SavingsIcon />, label: 'Fixed Deposits' },
    { to: '/cards', icon: <CreditCardIcon />, label: 'Cards' },
    { to: '/settings', icon: <SettingsIcon />, label: 'Settings' },
  ];

  const adminItems = [
    { to: '/admin', icon: <AdminPanelSettingsIcon />, label: 'Admin Home' },
    { to: '/admin/users', icon: <DashboardIcon />, label: 'Users' },
    { to: '/admin/loans', icon: <AccountBalanceIcon />, label: 'Loan Requests' },
    { to: '/admin/atm', icon: <CreditCardIcon />, label: 'ATM Requests' },
    { to: '/admin/credit-cards', icon: <CreditCardIcon />, label: 'Credit Card Requests' },
    { to: '/settings', icon: <SettingsIcon />, label: 'Settings' },
  ];

  const items = role === 'admin' ? adminItems : userItems;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            FinSight Bank
          </Typography>

          <IconButton color="inherit" onClick={toggle} aria-label="toggle theme">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton color="inherit" onClick={onLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {items.map((i) => (
              <NavItem key={i.to} to={i.to} icon={i.icon} label={i.label} />
            ))}
          </List>

          <Divider />
          <List>
            <ListItemButton onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
