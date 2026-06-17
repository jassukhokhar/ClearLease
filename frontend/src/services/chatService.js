import api from './api.js';

export const chatService = {
  /** Send a question about a lease; returns { success, answer, conversationId }. */
  send: (leaseId, message) =>
    api.post(`/chat/${leaseId}`, { message }).then((r) => r.data),

  /** Get the stored conversation thread for a lease. */
  getConversation: (leaseId) =>
    api.get(`/chat/${leaseId}`).then((r) => r.data),

  /** Recent conversations across all leases (dashboard widget). */
  recent: () => api.get('/chat').then((r) => r.data),
};
