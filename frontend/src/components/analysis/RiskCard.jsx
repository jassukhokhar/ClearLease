import { motion } from 'framer-motion';
import { Quote, Lightbulb, FileText, Crosshair, Mail } from 'lucide-react';
import { RISK_STYLES } from '../../utils/constants.js';
import { cn } from '../../utils/helpers.js';

/**
 * A single flagged clause card showing the quote, plain-English translation,
 * risk level, page number and recommendation.
 *
 * - `onJump`: jump to + highlight this clause inside the PDF.
 * - `onNegotiate`: open the negotiation-letter generator for this clause.
 * - `clauseIndex`: position in the lease's analysisResults array (for negotiation).
 */
const RiskCard = ({ result, index = 0, clauseIndex, onJump, onNegotiate }) => {
  const level = (result.riskLevel || 'LOW').toUpperCase();
  const style = RISK_STYLES[level] || RISK_STYLES.LOW;

  const jump = () =>
    onJump?.({
      pageNumber: result.pageNumber || 1,
      quote: result.quote,
      level,
    });

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-shadow hover:shadow-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
            style.bg,
            style.text,
            style.border
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
          {level} RISK
        </span>
        {onJump ? (
          <button
            onClick={jump}
            title="Find this clause in the PDF"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600"
          >
            <Crosshair className="h-3.5 w-3.5" />
            Page {result.pageNumber || 1}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <FileText className="h-3.5 w-3.5" />
            Page {result.pageNumber || 1}
          </span>
        )}
      </div>

      {/* Quote */}
      <blockquote
        className={cn(
          'relative cursor-pointer rounded-lg border-l-4 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm italic text-slate-700 dark:text-slate-200',
          style.border
        )}
        onClick={onJump ? jump : undefined}
        title={onJump ? 'Find this clause in the PDF' : undefined}
      >
        <Quote className="mb-1 h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        “{result.quote}”
      </blockquote>

      {/* Translation */}
      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {result.translation}
      </p>

      {/* Recommendation */}
      {result.recommendation && (
        <div className="mt-4 flex gap-2 rounded-lg bg-brand-50/60 dark:bg-brand-900/30 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
          <p className="text-sm text-slate-700 dark:text-slate-200">
            <span className="font-medium text-brand-700 dark:text-brand-300">Recommendation: </span>
            {result.recommendation}
          </p>
        </div>
      )}

      {onNegotiate && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onNegotiate({ result, clauseIndex })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/30"
          >
            <Mail className="h-3.5 w-3.5" />
            Generate Negotiation Letter
          </button>
        </div>
      )}
    </motion.article>
  );
};

export default RiskCard;
