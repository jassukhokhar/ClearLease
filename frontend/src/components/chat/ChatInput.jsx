import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/**
 * Chat composer. Enter sends, Shift+Enter adds a newline.
 */
const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask anything about this lease…"
        className="max-h-32 flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors',
          disabled || !value.trim()
            ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-600'
            : 'bg-brand-600 hover:bg-brand-700'
        )}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatInput;
