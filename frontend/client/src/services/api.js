import axios from 'axios';

// Get backend URL from environment variable (required)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error(
    'VITE_BACKEND_URL is not set. Set VITE_BACKEND_URL in frontend/client/.env or in your deployment environment.'
  );
}

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 20000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bank_token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});
