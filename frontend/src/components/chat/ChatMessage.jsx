import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/**
 * A single chat bubble. Assistant messages flagged `fresh` reveal with a
 * lightweight typewriter effect (client-side streaming feel).
 */
const ChatMessage = ({ message, onTick }) => {
  const isUser = message.role === 'user';
  const full = message.content || '';
  const [shown, setShown] = useState(message.fresh && !isUser ? '' : full);

  useEffect(() => {
    if (isUser || !message.fresh) {
      setShown(full);
      return;
    }
    let i = 0;
    // Reveal a few chars per tick for a smooth, fast stream.
    const id = setInterval(() => {
      i += 3;
      setShown(full.slice(0, i));
      onTick?.();
      if (i >= full.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [full, isUser, message.fresh, onTick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          isUser ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-brand-600 text-white'
            : 'rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
        )}
      >
        {shown}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
