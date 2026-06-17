import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/**
 * Minimal self-dismissing toast (no extra dependency). Render with an `open`
 * flag and a `message`; it auto-closes after `duration` ms.
 */
const Toast = ({ open, message, tone = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  const Icon = tone === 'error' ? AlertCircle : CheckCircle2;
  const styles =
    tone === 'error'
      ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300'
      : 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2"
        >
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-card',
              styles
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {message}
            <button
              onClick={onClose}
              className="ml-1 rounded p-0.5 text-current/60 hover:bg-black/5"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Toast;
