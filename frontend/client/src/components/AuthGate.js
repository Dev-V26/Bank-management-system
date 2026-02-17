import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getRole, isAuthed } from '../services/auth';

export default function AuthGate({ allow = ['user', 'admin'] }) {
  const loc = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  const role = getRole();
  if (!allow.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;
  }
  return <Outlet />;
}
