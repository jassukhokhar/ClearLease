import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  ScanLine,
  FileText,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  MessageSquare,
  GitCompare,
  Mail,
  Download,
  Quote,
  Star,
} from 'lucide-react';
import Container from '../components/layout/Container.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAuth } from '../hooks/useAuth.js';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const ctaTarget = isAuthenticated ? '/dashboard' : '/register';

  return (
    <div id="top" className="overflow-hidden">
      {/* ===== Hero ===== */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950" />
        <Container className="py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge tone="brand" className="mb-5">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered lease analysis
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
              Understand Your Lease{' '}
              <span className="text-brand-600 dark:text-brand-400">
                Before You Sign
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Upload your lease, then chat with it, compare options, and generate
              negotiation letters — AI reveals hidden fees and unfair clauses in
              plain English, in under a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={ctaTarget}>
                <Button size="lg">
                  Analyze My Lease <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="secondary">
                  See how it works
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit
                card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-emerald-500" /> Private &amp; secure
              </span>
            </div>
          </motion.div>

          {/* Hero mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-950">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Risk score', value: '72', tone: 'text-rose-600 dark:text-rose-400' },
                    { label: 'High-risk flags', value: '4', tone: 'text-amber-600 dark:text-amber-400' },
                    { label: 'Clauses reviewed', value: '11', tone: 'text-brand-600 dark:text-brand-400' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <p className="text-xs text-slate-400 dark:text-slate-500">{s.label}</p>
                      <p className={`mt-1 text-3xl font-bold ${s.tone}`}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-rose-200 bg-white p-4 text-left shadow-sm dark:border-rose-900/50 dark:bg-slate-900">
                  <Badge tone="danger" className="mb-2">
                    HIGH RISK
                  </Badge>
                  <p className="text-sm italic text-slate-600 dark:text-slate-300">
                    “Tenant shall repaint the entire unit at their own cost upon
                    vacating.”
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    You'd have to pay to repaint the whole apartment when you
                    move out — normal wear and tear is usually the landlord's
                    responsibility.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-20">
        <Container>
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Everything you need before you sign
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              From risk detection to negotiation — ClearLease is your full tenant
              toolkit.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Risk detection & scoring',
                desc: 'Hidden fees, lock-ins, painting penalties and unfair clauses — flagged with a 0-100 risk score.',
              },
              {
                icon: ScanLine,
                title: 'Plain-English translation',
                desc: 'Every risky clause is explained in language you can actually understand.',
              },
              {
                icon: MessageSquare,
                title: 'AI lease assistant',
                desc: 'Chat directly with your lease — ask what a clause means or whether to negotiate it.',
              },
              {
                icon: GitCompare,
                title: 'Lease comparison',
                desc: 'Put two leases side by side and let AI tell you which is the safer choice.',
              },
              {
                icon: Mail,
                title: 'Negotiation letters',
                desc: 'Generate ready-to-send emails to negotiate risky clauses, in the tone you choose.',
              },
              {
                icon: Download,
                title: 'Professional PDF report',
                desc: 'Export a clean, shareable risk report with recommendations and a final verdict.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="bg-slate-50 py-20 dark:bg-slate-900">
        <Container>
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Three steps to clarity
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              No legal background required.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Upload your lease',
                desc: 'Drag and drop your lease agreement PDF — up to 10 MB.',
              },
              {
                step: '02',
                title: 'AI analyzes every clause',
                desc: 'Our tenant-rights model reads the document and flags risks.',
              },
              {
                step: '03',
                title: 'Review, ask & act',
                desc: 'Read the report, chat with the assistant, compare, and export.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="text-4xl font-extrabold text-brand-100 dark:text-brand-900">
                  {s.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== Testimonials ===== */}
      <section id="testimonials" className="py-20">
        <Container>
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Renters love the peace of mind
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Maya R.',
                role: 'First-time renter',
                quote:
                  'ClearLease caught an auto-renewal clause I completely missed. Saved me from being locked in for another year.',
              },
              {
                name: 'Devon K.',
                role: 'Graduate student',
                quote:
                  'The AI assistant answered every question I had about my lease. I finally understood what I was signing.',
              },
              {
                name: 'Priya S.',
                role: 'Young professional',
                quote:
                  'Generated a negotiation letter for a hidden painting fee and got it removed. Worth every minute.',
              },
            ].map((t, i) => (
              <motion.figure
                key={t.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="mt-4 h-5 w-5 text-slate-200 dark:text-slate-700" />
                <blockquote className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</span>
                  <span className="text-slate-500 dark:text-slate-400"> · {t.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== Pricing placeholder ===== */}
      <section id="pricing" className="bg-slate-50 py-20 dark:bg-slate-900">
        <Container>
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Start free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['3 lease analyses', 'Full risk report', 'AI lease assistant', 'PDF report export'],
                cta: 'Get started',
                highlight: false,
              },
              {
                name: 'Pro',
                price: 'Coming soon',
                features: ['Unlimited analyses', 'Lease comparison', 'Negotiation letters', 'Priority AI processing'],
                cta: 'Join waitlist',
                highlight: true,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border bg-white p-8 shadow-sm dark:bg-slate-950 ${
                  p.highlight
                    ? 'border-brand-300 ring-1 ring-brand-200 dark:border-brand-700 dark:ring-brand-800'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {p.highlight && (
                  <Badge tone="brand" className="mb-3">
                    Most popular
                  </Badge>
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{p.price}</p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={ctaTarget} className="mt-8 block">
                  <Button
                    className="w-full"
                    variant={p.highlight ? 'primary' : 'secondary'}
                  >
                    {p.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20">
        <Container>
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 dark:divide-slate-800">
            {[
              {
                q: 'Is ClearLease legal advice?',
                a: 'No. ClearLease provides informational analysis to help you understand your lease. For binding legal advice, consult a licensed attorney.',
              },
              {
                q: 'What file formats are supported?',
                a: 'Currently we support PDF files up to 10 MB. The PDF must contain selectable text (not a scanned image).',
              },
              {
                q: 'Can I chat with my lease?',
                a: 'Yes. After analysis, the AI assistant answers questions grounded in your document and its risk report.',
              },
              {
                q: 'Is my lease kept private?',
                a: 'Yes. Your documents are tied to your account and protected behind authentication. They are never shared publicly.',
              },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-slate-900 dark:text-slate-100">
                  {item.q}
                  <span className="ml-4 text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="pb-24">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-brand-600 px-8 py-16 text-center shadow-card dark:bg-brand-700">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Don't sign blind.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Get a clear, AI-powered risk report on your lease in minutes.
            </p>
            <Link to={ctaTarget} className="mt-8 inline-block">
              <Button size="lg" variant="secondary">
                Analyze My Lease <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
