import { motion } from 'framer-motion';
import { Check, Loader2, FileText } from 'lucide-react';
import { ANALYSIS_STEPS } from '../../utils/constants.js';
import { cn, formatFileSize } from '../../utils/helpers.js';

/**
 * Animated upload + AI-processing experience.
 *
 * @param {number} progress       0-100 upload percentage
 * @param {number} activeStep     index into ANALYSIS_STEPS (-1 = none)
 * @param {string} status         uploading | processing | success | error
 * @param {File}   file           the file being processed (for the header)
 */
const UploadProgress = ({ progress = 0, activeStep = -1, status, file }) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      {/* File header */}
      {file && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {file.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
          </div>
        </div>
      )}

      {/* Upload progress bar */}
      {status === 'uploading' && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">Uploading…</span>
            <span className="text-slate-500 dark:text-slate-400">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-brand-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Step checklist */}
      <ol className="space-y-3">
        {ANALYSIS_STEPS.map((step, i) => {
          const done = i < activeStep || status === 'success';
          const current = i === activeStep && status !== 'success';

          return (
            <motion.li
              key={step.key}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                  done
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : current
                      ? 'border-brand-200 bg-brand-50 text-brand-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600'
                )}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : current ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={cn(
                  'text-sm',
                  done
                    ? 'font-medium text-slate-900 dark:text-slate-100'
                    : current
                      ? 'font-medium text-brand-700 dark:text-brand-300'
                      : 'text-slate-400 dark:text-slate-500'
                )}
              >
                {step.label}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export default UploadProgress;
