// frontend/utils/api.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://127.0.0.1:8000
  headers: {
    'Content-Type': 'application/json',
  },
});

import Cookies from 'js-cookie';

// Optional: Add request interceptor to attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
