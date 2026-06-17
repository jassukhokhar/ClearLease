import { cn } from '../../utils/helpers.js';

/**
 * Shimmering skeleton placeholder.
 */
const Skeleton = ({ className = '' }) => (
  <div
    className={cn(
      'shimmer rounded-lg bg-slate-100 dark:bg-slate-800',
      className
    )}
  />
);

export default Skeleton;
