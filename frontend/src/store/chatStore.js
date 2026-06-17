import { create } from 'zustand';
import { chatService } from '../services/chatService.js';
import { getErrorMessage } from '../utils/helpers.js';

/**
 * Chat state keyed by leaseId so each lease keeps its own thread.
 * Message shape: { role: 'user'|'assistant', content, timestamp, pending? }
 */
export const useChatStore = create((set, get) => ({
  messagesByLease: {},
  loadingByLease: {},
  sending: false,
  error: null,

  /** Load the persisted conversation for a lease. */
  fetchConversation: async (leaseId) => {
    set((s) => ({ loadingByLease: { ...s.loadingByLease, [leaseId]: true } }));
    try {
      const { messages } = await chatService.getConversation(leaseId);
      set((s) => ({
        messagesByLease: { ...s.messagesByLease, [leaseId]: messages || [] },
        loadingByLease: { ...s.loadingByLease, [leaseId]: false },
      }));
    } catch (error) {
      set((s) => ({
        error: getErrorMessage(error),
        loadingByLease: { ...s.loadingByLease, [leaseId]: false },
      }));
    }
  },

  /** Optimistically push the user message, then append the AI answer. */
  send: async (leaseId, message) => {
    const text = message.trim();
    if (!text) return { ok: false };

    const current = get().messagesByLease[leaseId] || [];
    const userMsg = { role: 'user', content: text, timestamp: Date.now() };

    set((s) => ({
      sending: true,
      error: null,
      messagesByLease: {
        ...s.messagesByLease,
        [leaseId]: [...current, userMsg],
      },
    }));

    try {
      const { answer } = await chatService.send(leaseId, text);
      const aiMsg = {
        role: 'assistant',
        content: answer,
        timestamp: Date.now(),
        fresh: true, // triggers typewriter on first render
      };
      set((s) => ({
        sending: false,
        messagesByLease: {
          ...s.messagesByLease,
          [leaseId]: [...(s.messagesByLease[leaseId] || []), aiMsg],
        },
      }));
      return { ok: true };
    } catch (error) {
      const message = getErrorMessage(error);
      // Roll the optimistic user message back out and surface the error.
      set((s) => ({
        sending: false,
        error: message,
        messagesByLease: {
          ...s.messagesByLease,
          [leaseId]: (s.messagesByLease[leaseId] || []).filter(
            (m) => m !== userMsg
          ),
        },
      }));
      return { ok: false, message };
    }
  },

  clearError: () => set({ error: null }),
}));
