import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Global Axios API Client instance.
 * Automatically injects JWT tokens and handles global exceptions (401 session expiry, server unreachable).
 */
const api = axios.create({
  baseURL: import.meta.env.DEV
    ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    : ''
});

// 1. Request Interceptor: Attach bearer authorization header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Catch authorization and network exceptions globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, code } = error;

    // Handle session expiration or unauthorized requests (401)
    if (response && response.status === 401) {
      localStorage.removeItem('crm-token');
      if (window.location.pathname !== '/login') {
        // Force redirect to login page
        window.location.href = '/login';
      }
    }
    
    // Handle offline server or network failures
    else if (!response || code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
