import { Trophy, ShieldCheck, DollarSign, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/**
 * Resolve an 'A' | 'B' | 'TIE' verdict to a lease name.
 */
const sideName = (side, a, b) =>
  side === 'A' ? a.name : side === 'B' ? b.name : 'Tie';

const VerdictCard = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg',
          tone
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
    </div>
    <p className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-slate-100" title={value}>
      {value}
    </p>
  </div>
);

/**
 * Verdict cards (winner / safer / most expensive / highest risk) + AI summary.
 */
const ComparisonSummary = ({ summary, leaseA, leaseB }) => (
  <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <VerdictCard
        icon={Trophy}
        label="Recommended"
        value={sideName(summary.winner, leaseA, leaseB)}
        tone="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
      />
      <VerdictCard
        icon={ShieldCheck}
        label="Safer lease"
        value={sideName(summary.saferLease, leaseA, leaseB)}
        tone="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
      />
      <VerdictCard
        icon={DollarSign}
        label="Most expensive"
        value={sideName(summary.mostExpensive, leaseA, leaseB)}
        tone="bg-amber-50 text-amber-600"
      />
      <VerdictCard
        icon={AlertTriangle}
        label="Highest risk"
        value={sideName(summary.highestRisk, leaseA, leaseB)}
        tone="bg-rose-50 text-rose-600"
      />
    </div>

    {summary.aiSummary && (
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 dark:bg-brand-900/30 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-300">AI Verdict</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {summary.aiSummary}
        </p>
      </div>
    )}
  </div>
);

export default ComparisonSummary;
