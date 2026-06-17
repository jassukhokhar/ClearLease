import { FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import LeaseHistoryCard from './LeaseHistoryCard.jsx';
import Skeleton from '../ui/Skeleton.jsx';
import Button from '../ui/Button.jsx';

const LeaseHistoryGrid = ({ leases, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
          >
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="mt-4 h-4 w-3/4" />
            <Skeleton className="mt-3 h-3 w-1/2" />
            <Skeleton className="mt-5 h-8 w-1/3" />
            <Skeleton className="mt-5 h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!leases?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 shadow-sm">
          <FileSearch className="h-7 w-7" />
        </span>
        <p className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          No analyses yet
        </p>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Upload your first lease agreement to see hidden fees and unfair
          clauses revealed in plain English.
        </p>
        <Link to="/dashboard#upload" className="mt-5">
          <Button>Analyze a lease</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {leases.map((lease, i) => (
        <LeaseHistoryCard
          key={lease._id}
          lease={lease}
          index={i}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default LeaseHistoryGrid;
