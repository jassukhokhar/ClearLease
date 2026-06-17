import { create } from 'zustand';

const STORAGE_KEY = 'clearlease-theme';

/**
 * Read the initial theme: saved preference → system preference → light.
 */
const getInitial = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Reflect the theme onto <html> and persist it.
 */
const apply = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem(STORAGE_KEY, theme);
};

export const useThemeStore = create((set, get) => ({
  theme: getInitial(),

  setTheme: (theme) => {
    apply(theme);
    set({ theme });
  },

  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    apply(next);
    set({ theme: next });
  },
}));
