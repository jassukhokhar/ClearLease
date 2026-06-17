import { cn } from '../../utils/helpers.js';

export const Card = ({ className = '', children, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children }) => (
  <div className={cn('px-6 pt-6', className)}>{children}</div>
);

export const CardTitle = ({ className = '', children }) => (
  <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children }) => (
  <p className={cn('mt-1 text-sm text-slate-500 dark:text-slate-400', className)}>{children}</p>
);

export const CardContent = ({ className = '', children }) => (
  <div className={cn('px-6 py-6', className)}>{children}</div>
);

export const CardFooter = ({ className = '', children }) => (
  <div
    className={cn(
      'flex items-center gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800',
      className
    )}
  >
    {children}
  </div>
);

export default Card;
