import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from './Container.jsx';

/**
 * Shared layout for the static legal pages (Privacy, Terms, Disclaimer).
 * `sections` = [{ heading, body }] where body is a string or array of strings.
 */
const LegalPage = ({ title, updated, intro, sections = [] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950">
      <Container className="max-w-3xl py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Last updated {updated}
          </p>
        )}
        {intro && (
          <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {intro}
          </p>
        )}

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {s.heading}
              </h2>
              {Array.isArray(s.body) ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.body.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.body}
                </p>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          ClearLease provides informational analysis, not legal advice. For
          binding legal decisions, consult a licensed attorney.
        </p>
      </Container>
    </div>
  );
};

export default LegalPage;
