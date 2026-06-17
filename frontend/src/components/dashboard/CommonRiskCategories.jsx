import { PieChart } from 'lucide-react';

/**
 * Horizontal bar list of the most common flagged risk categories.
 * `categories` = [{ key, count }] sorted desc.
 */
const CommonRiskCategories = ({ categories = [] }) => {
  const max = categories.reduce((m, c) => Math.max(m, c.count), 0) || 1;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <PieChart className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Most common risk categories
        </h3>
      </div>

      {categories.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
          No categories yet — analyze a lease to populate this.
        </p>
      ) : (
        <ul className="space-y-3">
          {categories.slice(0, 6).map((c) => (
            <li key={c.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-200">{c.key}</span>
                <span className="text-slate-400 dark:text-slate-500">{c.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${(c.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommonRiskCategories;
