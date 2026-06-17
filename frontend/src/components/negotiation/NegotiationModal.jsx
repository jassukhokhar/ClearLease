import { useEffect, useState } from 'react';
import { Loader2, Copy, Download, RefreshCw, Check, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { leaseService } from '../../services/leaseService.js';
import { NEGOTIATION_TONES } from '../../utils/constants.js';
import { cn, getErrorMessage } from '../../utils/helpers.js';

const NegotiationModal = ({ open, onClose, leaseId, clause }) => {
  const [tone, setTone] = useState('email');
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async (selectedTone) => {
    if (clause?.clauseIndex == null || clause.clauseIndex < -1) {
      setError('This clause could not be located. Please reopen and retry.');
      return;
    }
    setLoading(true);
    setError(null);
    setLetter(null);
    try {
      const { letter: result } = await leaseService.negotiationLetter(leaseId, {
        clauseIndex: clause.clauseIndex,
        tone: selectedTone,
      });
      setLetter(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && clause) generate(tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tone]);

  useEffect(() => {
    if (!open) {
      setLetter(null);
      setError(null);
      setCopied(false);
    }
  }, [open]);

  const fullText = letter ? `Subject: ${letter.subject}\n\n${letter.body}` : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not copy to clipboard.');
    }
  };

  const download = () => {
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'negotiation-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Negotiation Letter"
      description="AI-drafted message to negotiate this lease. Review and edit before sending."
      className="max-w-2xl"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {NEGOTIATION_TONES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTone(t.key)}
            disabled={loading}
            title={t.hint}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60',
              tone === t.key
                ? 'border-brand-300 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[16rem] max-h-[380px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4">
        {loading && (
          <div className="flex h-56 flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <p className="mt-3 text-sm">Drafting your letter…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!loading && letter && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {clause?.isCombined ? 'Lease-wide Letter' : 'Clause Negotiation'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1 rounded bg-white dark:bg-slate-900 px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={download}
                  className="inline-flex items-center gap-1 rounded bg-white dark:bg-slate-900 px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                  title="Download Text File"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Subject
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {letter.subject}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Body
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {letter.body}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => generate(tone)}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={download}
          disabled={!letter || loading}
        >
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button size="sm" onClick={copy} disabled={!letter || loading}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </Modal>
  );
};

export default NegotiationModal;
