import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import RiskScore from './RiskScore.jsx';
import { cn } from '../../utils/helpers.js';

/**
 * Top-of-panel summary: risk gauge + flag count breakdown.
 */
const LeaseSummary = ({ lease, counts }) => {
  const stats = [
    {
      label: 'High',
      value: counts.HIGH,
      icon: ShieldAlert,
      className: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Medium',
      value: counts.MEDIUM,
      icon: ShieldQuestion,
      className: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Low',
      value: counts.LOW,
      icon: ShieldCheck,
      className: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <RiskScore score={lease.overallRiskScore} label={lease.riskLabel} />

        <div className="grid w-full grid-cols-3 gap-3 sm:max-w-xs">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3"
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  s.className
                )}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <span className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                {s.value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
        We reviewed{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {lease.totalFlags}
        </span>{' '}
        clauses worth your attention in{' '}
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {lease.originalFileName}
        </span>
        .
      </div>
    </div>
  );
};

export default LeaseSummary;
