import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

// Inject Bearer Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global Error Handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Access denied or token expired
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
