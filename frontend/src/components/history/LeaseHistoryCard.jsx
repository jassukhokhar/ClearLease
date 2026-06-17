import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Calendar, Flag, ArrowRight, Trash2 } from 'lucide-react';
import { RISK_LABEL_STYLES } from '../../utils/constants.js';
import { cn, formatDate } from '../../utils/helpers.js';
import Button from '../ui/Button.jsx';

const LeaseHistoryCard = ({ lease, onDelete, index = 0 }) => {
  const scoreColor =
    lease.overallRiskScore >= 60
      ? 'text-rose-600'
      : lease.overallRiskScore >= 25
        ? 'text-amber-600'
        : 'text-emerald-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-shadow hover:shadow-card"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
          <FileText className="h-5 w-5" />
        </span>
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
            RISK_LABEL_STYLES[lease.riskLabel] || RISK_LABEL_STYLES.SAFE
          )}
        >
          {lease.riskLabel}
        </span>
      </div>

      <h3
        className="mt-4 truncate text-sm font-semibold text-slate-900 dark:text-slate-100"
        title={lease.originalFileName}
      >
        {lease.originalFileName}
      </h3>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(lease.uploadDate || lease.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Flag className="h-3.5 w-3.5" />
          {lease.totalFlags} flags
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Risk score</span>
          <p className={cn('text-2xl font-bold', scoreColor)}>
            {lease.overallRiskScore}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500">/100</span>
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Link to={`/lease/${lease._id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(lease)}
          className="text-slate-400 dark:text-slate-500 hover:bg-rose-50 hover:text-rose-600"
          aria-label="Delete lease"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LeaseHistoryCard;
