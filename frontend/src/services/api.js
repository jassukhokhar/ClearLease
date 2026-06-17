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

export default api;
