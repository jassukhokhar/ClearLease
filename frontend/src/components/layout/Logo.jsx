import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

/**
 * Brand wordmark used in the navbar and footer.
 */
const Logo = ({ className = '' }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
      <ShieldCheck className="h-5 w-5" />
    </span>
    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
      Clear<span className="text-brand-600 dark:text-brand-400">Lease</span>
    </span>
  </Link>
);

export default Logo;
