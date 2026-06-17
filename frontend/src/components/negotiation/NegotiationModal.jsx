import { useEffect, useState } from 'react';
import { Loader2, Copy, Download, RefreshCw, Check, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { leaseService } from '../../services/leaseService.js';
import { NEGOTIATION_TONES } from '../../utils/constants.js';
import { cn, getErrorMessage } from '../../utils/helpers.js';

/**
 * Generates an AI negotiation letter for a single clause. Tone selector,
 * copy / download / regenerate actions.
 */
const NegotiationModal = ({ open, onClose, leaseId, clause }) => {
  const [tone, setTone] = useState('email');
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState(null); // { subject, body }
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async (selectedTone) => {
    if (clause?.clauseIndex == null || clause.clauseIndex < 0) {
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

  // Generate on open / when tone changes.
  useEffect(() => {
    if (open && clause) generate(tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tone]);

  // Reset transient state when closed.
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
      description="AI-drafted message to negotiate this clause. Review and edit before sending."
      className="max-w-2xl"
    >
      {/* Tone selector */}
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

      {/* Body */}
      <div className="min-h-[16rem] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4">
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

      {/* Actions */}
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
