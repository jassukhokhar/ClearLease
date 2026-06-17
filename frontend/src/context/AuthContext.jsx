import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';

/**
 * Thin context wrapper over the Zustand auth store. It exists mainly to run
 * the one-time session hydration on mount and to offer a familiar
 * useContext-style API alongside the store.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const store = useAuthStore();

  useEffect(() => {
    store.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
