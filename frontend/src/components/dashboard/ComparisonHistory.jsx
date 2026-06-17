import { useNavigate } from 'react-router-dom';
import { GitCompare, ArrowRight } from 'lucide-react';

const name = (l) => l?.originalFileName || l?.name || 'Lease';

/**
 * Recent saved lease comparisons. `items` from GET /api/comparisons.
 */
const ComparisonHistory = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <GitCompare className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Comparison history
          </h3>
        </div>
        <button
          onClick={() => navigate('/compare')}
          className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          New
        </button>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
          No comparisons yet. Compare two leases to see them here.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 5).map((c) => (
            <li key={c._id}>
              <button
                onClick={() => navigate('/compare')}
                className="group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {name(c.leaseA)} <span className="text-slate-400 dark:text-slate-500">vs</span>{' '}
                  {name(c.leaseB)}
                </p>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-brand-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComparisonHistory;
