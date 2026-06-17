import { create } from 'zustand';
import { leaseService } from '../services/leaseService.js';
import { getErrorMessage } from '../utils/helpers.js';

/**
 * Holds lease history and the currently viewed lease.
 */
export const useLeaseStore = create((set, get) => ({
  leases: [],
  current: null,
  loadingHistory: false,
  loadingLease: false,
  error: null,

  fetchHistory: async () => {
    set({ loadingHistory: true, error: null });
    try {
      const { leases } = await leaseService.history();
      set({ leases, loadingHistory: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loadingHistory: false });
    }
  },

  fetchLease: async (id) => {
    set({ loadingLease: true, error: null, current: null });
    try {
      const { lease } = await leaseService.getById(id);
      set({ current: lease, loadingLease: false });
      return { ok: true, lease };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loadingLease: false });
      return { ok: false, message };
    }
  },

  addLease: (lease) => {
    set({ leases: [lease, ...get().leases] });
  },

  deleteLease: async (id) => {
    try {
      await leaseService.remove(id);
      set({ leases: get().leases.filter((l) => l._id !== id) });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    }
  },

  clearCurrent: () => set({ current: null }),
}));
