import { create } from 'zustand';
import { authService } from '../services/authService.js';
import { getErrorMessage } from '../utils/helpers.js';

/**
 * Global auth state. The source of truth is the HTTP-only cookie on the
 * backend; this store mirrors the current user for the UI.
 */
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // true until the first /me check resolves
  error: null,

  /** Hydrate the session on app load. */
  init: async () => {
    const token = localStorage.getItem('clearlease_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    try {
      const { user } = await authService.me();
      set({ user, isAuthenticated: true, loading: false });
    } catch {
      localStorage.removeItem('clearlease_token');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  register: async (payload) => {
    set({ error: null });
    try {
      const { user, token } = await authService.register(payload);
      if (token) {
        localStorage.setItem('clearlease_token', token);
      }
      set({ user, isAuthenticated: true });
      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      return { ok: false, message };
    }
  },

  login: async (payload) => {
    set({ error: null });
    try {
      const { user, token } = await authService.login(payload);
      if (token) {
        localStorage.setItem('clearlease_token', token);
      }
      set({ user, isAuthenticated: true });
      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      return { ok: false, message };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('clearlease_token');
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
