import { motion } from 'framer-motion';
import { RISK_LABEL_STYLES } from '../../utils/constants.js';
import { cn } from '../../utils/helpers.js';

/**
 * Circular risk gauge (0-100) with the risk label beneath.
 */
const RiskScore = ({ score = 0, label = 'SAFE', size = 140 }) => {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color the arc by score band.
  const color =
    score >= 60 ? '#e11d48' : score >= 25 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{score}</span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">/ 100</span>
        </div>
      </div>

      <span
        className={cn(
          'mt-4 inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold',
          RISK_LABEL_STYLES[label] || RISK_LABEL_STYLES.SAFE
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default RiskScore;
