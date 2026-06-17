import { CheckCircle2 } from 'lucide-react';
import { useAnalysis } from '../../hooks/useAnalysis.js';
import LeaseSummary from './LeaseSummary.jsx';
import RiskFilter from './RiskFilter.jsx';
import RiskCard from './RiskCard.jsx';

/**
 * The full right-hand analysis panel: summary, filters and clause cards.
 */
const AnalysisPanel = ({ lease, onJump, onNegotiate }) => {
  const results = lease.analysisResults || [];
  const { filter, setFilter, counts, filtered, total } = useAnalysis(results);

  return (
    <div className="space-y-6">
      <LeaseSummary lease={lease} counts={counts} />

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Flagged clauses
        </h2>
      </div>

      <RiskFilter
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        total={total}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 py-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
            {total === 0
              ? 'No risky clauses detected'
              : 'No clauses match this filter'}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {total === 0
              ? 'This lease looks clean — but always read carefully.'
              : 'Try a different risk level.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((result, i) => (
            <RiskCard
              key={i}
              result={result}
              index={i}
              clauseIndex={results.indexOf(result)}
              onJump={onJump}
              onNegotiate={onNegotiate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
