import axios from 'axios';

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bank_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
