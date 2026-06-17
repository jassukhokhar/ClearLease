import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, AlertCircle, Clock, Trash2 } from 'lucide-react';
import Container from '../components/layout/Container.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import LeasePicker from '../components/compare/LeasePicker.jsx';
import ComparisonSummary from '../components/compare/ComparisonSummary.jsx';
import ComparisonTable from '../components/compare/ComparisonTable.jsx';
import { useLeaseStore } from '../store/leaseStore.js';
import { useComparisonStore } from '../store/comparisonStore.js';
import { formatDate } from '../utils/helpers.js';

// Normalize either response shape (fresh create vs populated fetch).
const norm = (l) => ({
  name: l?.name || l?.originalFileName || 'Lease',
  score: l?.score ?? l?.overallRiskScore ?? 0,
  label: l?.label || l?.riskLabel || 'SAFE',
});

const Compare = () => {
  const { leases, fetchHistory } = useLeaseStore();
  const {
    comparisons,
    current,
    creating,
    error,
    fetchComparisons,
    createComparison,
    loadComparison,
    deleteComparison,
    clearCurrent,
  } = useComparisonStore();

  const [leaseA, setLeaseA] = useState('');
  const [leaseB, setLeaseB] = useState('');

  useEffect(() => {
    fetchHistory();
    fetchComparisons();
    return () => clearCurrent();
  }, [fetchHistory, fetchComparisons, clearCurrent]);

  const handleCompare = () => createComparison(leaseA, leaseB);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/40">
        <Container className="py-8">
          <div className="mb-8">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              <GitCompare className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              Compare leases
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Put two analyzed leases side by side and let AI tell you which is
              the safer choice.
            </p>
          </div>

          <LeasePicker
            leases={leases}
            leaseA={leaseA}
            leaseB={leaseB}
            setLeaseA={setLeaseA}
            setLeaseB={setLeaseB}
            onCompare={handleCompare}
            creating={creating}
          />

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Result */}
          {current && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              <ComparisonSummary
                summary={current.summary}
                leaseA={norm(current.leaseA)}
                leaseB={norm(current.leaseB)}
              />
              <ComparisonTable
                summary={current.summary}
                leaseA={norm(current.leaseA)}
                leaseB={norm(current.leaseB)}
              />
            </motion.section>
          )}

          {/* Saved comparisons */}
          {comparisons.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Past comparisons
              </h2>
              <div className="space-y-3">
                {comparisons.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => loadComparison(c._id)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-left shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {norm(c.leaseA).name}{' '}
                        <span className="text-slate-400 dark:text-slate-500">vs</span>{' '}
                        {norm(c.leaseB).name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComparison(c._id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          deleteComparison(c._id);
                        }
                      }}
                      className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete comparison"
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Compare;
