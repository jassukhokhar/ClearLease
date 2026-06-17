import { useCallback, useEffect, useRef } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import { useChatStore } from '../../store/chatStore.js';
import { SUGGESTED_QUESTIONS } from '../../utils/constants.js';

/**
 * The AI Lease Assistant panel: persona header, scrollable thread, suggested
 * questions, typing indicator and composer. Used both as the 3rd desktop
 * column and inside the mobile/tablet slide-over.
 */
const ChatPanel = ({ leaseId, className = '' }) => {
  const {
    messagesByLease,
    loadingByLease,
    sending,
    error,
    fetchConversation,
    send,
  } = useChatStore();

  const messages = messagesByLease[leaseId] || [];
  const loading = loadingByLease[leaseId];
  const scrollRef = useRef(null);

  useEffect(() => {
    if (leaseId && messagesByLease[leaseId] === undefined) {
      fetchConversation(leaseId);
    }
  }, [leaseId, messagesByLease, fetchConversation]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, sending, scrollToBottom]);

  const handleSend = (text) => send(leaseId, text);

  const isEmpty = !loading && messages.length === 0;

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            AI Lease Assistant
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Ask anything about this lease</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
              Chat with your lease
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
              Get plain-English answers grounded in this document and its risk
              report.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} onTick={scrollToBottom} />
        ))}

        {sending && (
          <div className="flex items-center gap-2 pl-9 text-slate-400 dark:text-slate-500">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 dark:bg-slate-600" />
            </span>
            <span className="text-xs">Assistant is thinking…</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {!loading && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 px-4 py-3">
          {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={sending}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 disabled:opacity-60"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
};

export default ChatPanel;
