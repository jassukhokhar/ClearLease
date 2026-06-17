import { GitCompare, Loader2 } from 'lucide-react';
import Button from '../ui/Button.jsx';

const LeaseSelect = ({ label, value, onChange, leases, excludeId }) => (
  <div className="flex-1">
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
    >
      <option value="">Select a lease…</option>
      {leases
        .filter((l) => l._id !== excludeId)
        .map((l) => (
          <option key={l._id} value={l._id}>
            {l.originalFileName} ({l.overallRiskScore}/100)
          </option>
        ))}
    </select>
  </div>
);

/**
 * Pick two analyzed leases from history to compare.
 */
const LeasePicker = ({ leases, leaseA, leaseB, setLeaseA, setLeaseB, onCompare, creating }) => {
  const ready = leaseA && leaseB && leaseA !== leaseB;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <LeaseSelect
          label="Lease A"
          value={leaseA}
          onChange={setLeaseA}
          leases={leases}
          excludeId={leaseB}
        />
        <div className="hidden pb-2.5 sm:block">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <GitCompare className="h-4 w-4" />
          </span>
        </div>
        <LeaseSelect
          label="Lease B"
          value={leaseB}
          onChange={setLeaseB}
          leases={leases}
          excludeId={leaseA}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={onCompare} disabled={!ready || creating}>
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Comparing…
            </>
          ) : (
            <>
              <GitCompare className="h-4 w-4" /> Compare leases
            </>
          )}
        </Button>
      </div>

      {leases.length < 2 && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          You need at least two analyzed leases to compare. Upload more from the
          dashboard.
        </p>
      )}
    </div>
  );
};

export default LeasePicker;
