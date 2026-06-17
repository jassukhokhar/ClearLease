import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore.js';
import { cn } from '../../utils/helpers.js';

/**
 * Light/dark theme switch. Icon reflects the theme you'll switch TO.
 */
const ThemeToggle = ({ className = '' }) => {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        className
      )}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
