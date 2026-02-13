import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bank_token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});
