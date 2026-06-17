import { useAuthStore } from '../store/authStore.js';

/**
 * Convenience hook exposing the auth store.
 */
export const useAuth = () => useAuthStore();
