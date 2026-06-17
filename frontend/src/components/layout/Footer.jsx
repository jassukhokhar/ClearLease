import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowUp } from 'lucide-react';
import Container from './Container.jsx';

/**
 * Scroll smoothly to the top of the page.
 */
const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: 'smooth' });

/**
 * A footer link that smoothly scrolls to an in-page section (#id). If we are
 * not on the landing page, it routes home first, then scrolls.
 */
const useScrollToSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else scrollToTop();
    };
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for the home page to mount before scrolling.
      setTimeout(doScroll, 120);
    } else {
      doScroll();
    }
  };
};

const Footer = () => {
  const scrollToSection = useScrollToSection();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            {/* Brand → back to top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2"
              aria-label="Back to top"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Clear<span className="text-brand-600 dark:text-brand-400">Lease</span>
              </span>
            </button>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Understand your lease before you sign. AI-powered lease risk
              analysis in plain English.
            </p>
            <button
              onClick={scrollToTop}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              <ArrowUp className="h-3.5 w-3.5" /> Back to top
            </button>
          </div>

          <FooterCol
            title="Product"
            items={[
              { label: 'Features', section: 'features' },
              { label: 'How it works', section: 'how' },
              { label: 'Pricing', section: 'pricing' },
              { label: 'FAQ', section: 'faq' },
            ]}
            onSection={scrollToSection}
          />
          <FooterCol
            title="Company"
            items={[
              { label: 'About', section: 'how' },
              { label: 'Reviews', section: 'testimonials' },
              { label: 'Pricing', section: 'pricing' },
              { label: 'Contact', href: 'mailto:hello@clearlease.app' },
            ]}
            onSection={scrollToSection}
          />
          <FooterCol
            title="Legal"
            items={[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
              { label: 'Disclaimer', to: '/disclaimer' },
            ]}
            onSection={scrollToSection}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ClearLease. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            ClearLease provides informational analysis, not legal advice.
          </p>
        </div>
      </Container>
    </footer>
  );
};

const linkClass =
  'text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100';

const FooterCol = ({ title, items, onSection }) => (
  <div>
    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
      {title}
    </h4>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item.label}>
          {item.to ? (
            <Link to={item.to} className={linkClass}>
              {item.label}
            </Link>
          ) : item.href ? (
            <a href={item.href} className={linkClass}>
              {item.label}
            </a>
          ) : (
            <button
              onClick={() => onSection(item.section)}
              className={linkClass}
            >
              {item.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
