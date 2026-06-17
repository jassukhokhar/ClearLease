import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
  Download,
  X,
} from 'lucide-react';
import Container from '../components/layout/Container.jsx';
import Logo from '../components/layout/Logo.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Toast from '../components/ui/Toast.jsx';
import PdfViewer from '../components/pdf/PdfViewer.jsx';
import AnalysisPanel from '../components/analysis/AnalysisPanel.jsx';
import ChatPanel from '../components/chat/ChatPanel.jsx';
import NegotiationModal from '../components/negotiation/NegotiationModal.jsx';
import { useLeaseStore } from '../store/leaseStore.js';
import { leaseService } from '../services/leaseService.js';
import { fileUrl, getErrorMessage } from '../utils/helpers.js';

const LeaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current, loadingLease, error, fetchLease, clearCurrent } =
    useLeaseStore();

  // PDF highlight target (set when a clause card is clicked).
  const [highlight, setHighlight] = useState(null);
  const [nonce, setNonce] = useState(0);

  // Mobile/tablet chat slide-over.
  const [chatOpen, setChatOpen] = useState(false);

  // Negotiation modal.
  const [negotiation, setNegotiation] = useState(null);

  // Export state + toast.
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null); // { message, tone }

  useEffect(() => {
    fetchLease(id);
    return () => clearCurrent();
  }, [id, fetchLease, clearCurrent]);

  const handleJump = (target) => {
    setHighlight(target);
    setNonce((n) => n + 1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await leaseService.exportReport(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const base = (current?.originalFileName || 'lease').replace(/\.pdf$/i, '');
      a.download = `ClearLease-Report-${base}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ message: 'Report downloaded', tone: 'success' });
    } catch (err) {
      setToast({ message: getErrorMessage(err), tone: 'error' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {/* Slim top bar (global chrome is hidden on this route) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="hidden sm:block">
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {current && (
              <p
                className="hidden max-w-[28vw] truncate text-sm font-medium text-slate-600 dark:text-slate-300 md:block"
                title={current.originalFileName}
              >
                {current.originalFileName}
              </p>
            )}
            {current && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                loading={exporting}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Report</span>
              </Button>
            )}
          </div>
        </Container>
      </header>

      <div className="flex-1">
        {loadingLease && <LoadingState />}

        {!loadingLease && error && (
          <Container className="py-20">
            <div className="mx-auto max-w-md rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
              <p className="mt-3 font-medium text-rose-800 dark:text-rose-300">{error}</p>
              <Link to="/history" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  Back to history
                </Button>
              </Link>
            </div>
          </Container>
        )}

        {!loadingLease && current && (
          <Container className="py-6">
            {/* PDF | analysis | chat. Chat is its own column on xl+, a
                slide-over below that. */}
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-12">
              {/* Left — PDF viewer (sticky on desktop) */}
              <div className="lg:sticky lg:top-[5.5rem] lg:h-[calc(100vh-7rem)] xl:col-span-5">
                <PdfViewer
                  fileUrl={fileUrl(current.fileUrl)}
                  highlight={highlight}
                  nonce={nonce}
                />
              </div>

              {/* Middle — analysis */}
              <div className="xl:col-span-4">
                <AnalysisPanel
                  lease={current}
                  onJump={handleJump}
                  onNegotiate={setNegotiation}
                />
              </div>

              {/* Right — chat (xl+ only) */}
              <div className="hidden xl:col-span-3 xl:block">
                <div className="sticky top-[5.5rem] h-[calc(100vh-7rem)]">
                  <ChatPanel leaseId={id} />
                </div>
              </div>
            </div>
          </Container>
        )}
      </div>

      {/* Floating "Ask AI" button — below xl, where chat is a slide-over */}
      {current && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-card transition-colors hover:bg-brand-700 xl:hidden"
        >
          <Sparkles className="h-4 w-4" /> Ask AI
        </button>
      )}

      {/* Chat slide-over (below xl) */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="fixed inset-0 z-50 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-slate-50 dark:bg-slate-800 shadow-xl sm:p-3"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
            >
              <div className="flex justify-end p-2 sm:hidden">
                <button
                  onClick={() => setChatOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <ChatPanel leaseId={id} className="h-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Negotiation letter generator */}
      <NegotiationModal
        open={!!negotiation}
        onClose={() => setNegotiation(null)}
        leaseId={id}
        clause={negotiation}
      />

      <Toast
        open={!!toast}
        message={toast?.message}
        tone={toast?.tone}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

const LoadingState = () => (
  <Container className="py-6">
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex h-[60vh] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </Container>
);

export default LeaseDetails;
