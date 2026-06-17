import { Check } from 'lucide-react';
import { COMPARISON_DIMENSIONS } from '../../utils/constants.js';
import { cn } from '../../utils/helpers.js';

const sideCell = (text, isBetter) => (
  <td
    className={cn(
      'align-top px-4 py-3 text-sm',
      isBetter ? 'bg-emerald-50/60 dark:bg-emerald-900/15 text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300'
    )}
  >
    <div className="flex items-start gap-1.5">
      {isBetter && (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      )}
      <span>{text}</span>
    </div>
  </td>
);

/**
 * Side-by-side dimension table. `summary` is the structured comparison result.
 * leaseA/leaseB are normalized { name, score, label }.
 */
const ComparisonTable = ({ summary, leaseA, leaseB }) => {
  const dims = summary?.dimensions || [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
            <th className="w-40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Dimension
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
              {leaseA.name}
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
              {leaseB.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Risk score row */}
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              Overall Risk Score
            </td>
            {sideCell(`${leaseA.score}/100 · ${leaseA.label}`, leaseA.score < leaseB.score)}
            {sideCell(`${leaseB.score}/100 · ${leaseB.label}`, leaseB.score < leaseA.score)}
          </tr>

          {COMPARISON_DIMENSIONS.map(({ key, label }) => {
            const d = dims.find((x) => x.key === key) || {};
            return (
              <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {label}
                </td>
                {sideCell(d.leaseA || '—', d.better === 'A')}
                {sideCell(d.leaseB || '—', d.better === 'B')}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
