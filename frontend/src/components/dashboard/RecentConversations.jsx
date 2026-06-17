import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/helpers.js';

/**
 * Recent AI Lease Assistant conversations. `items` from GET /api/chat.
 */
const RecentConversations = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
          <MessageSquare className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Recent AI conversations
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
          No conversations yet. Open a lease and ask the assistant a question.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c._id}>
              <button
                onClick={() => navigate(`/lease/${c.leaseId}`)}
                className="group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                    {c.leaseName}
                  </p>
                  <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                    {c.lastMessage || `${c.messageCount} messages`}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-brand-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentConversations;
