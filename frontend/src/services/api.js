import axios from 'axios';
import { API_URL } from '../utils/constants.js';

/**
 * Shared Axios instance.
 * withCredentials ensures the HTTP-only auth cookie is sent on every request.
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject Authorization header from localStorage as a fallback for cross-site deployments
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clearlease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
