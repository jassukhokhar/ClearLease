import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clock, Upload, GitCompare } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/compare', label: 'Compare', icon: GitCompare },
];

/**
 * App sidebar for authenticated pages. Hidden on small screens (the navbar
 * handles mobile navigation).
 */
const Sidebar = () => (
  <aside className="hidden w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:block">
    <div className="sticky top-16 p-4">
      <NavLink
        to="/dashboard"
        className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        <Upload className="h-4 w-4" /> New analysis
      </NavLink>

      <nav className="space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  </aside>
);

export default Sidebar;
