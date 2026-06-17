import { cn } from '../../utils/helpers.js';

/**
 * Segmented filter for clause risk levels.
 */
const RiskFilter = ({ filter, setFilter, counts, total }) => {
  const options = [
    { key: 'ALL', label: 'All', count: total, active: 'bg-slate-900 text-white' },
    { key: 'HIGH', label: 'High', count: counts.HIGH, active: 'bg-rose-600 text-white' },
    { key: 'MEDIUM', label: 'Medium', count: counts.MEDIUM, active: 'bg-amber-500 text-white' },
    { key: 'LOW', label: 'Low', count: counts.LOW, active: 'bg-emerald-600 text-white' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = filter === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? cn('border-transparent', opt.active)
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            {opt.label}
            <span
              className={cn(
                'rounded-full px-1.5 text-xs',
                isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              )}
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RiskFilter;
