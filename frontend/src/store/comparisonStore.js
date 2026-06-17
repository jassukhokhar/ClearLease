import { create } from 'zustand';
import { comparisonService } from '../services/comparisonService.js';
import { getErrorMessage } from '../utils/helpers.js';

/**
 * Holds saved comparisons and the result of the current comparison run.
 */
export const useComparisonStore = create((set, get) => ({
  comparisons: [],
  current: null,
  loadingList: false,
  creating: false,
  error: null,

  fetchComparisons: async () => {
    set({ loadingList: true, error: null });
    try {
      const { comparisons } = await comparisonService.list();
      set({ comparisons, loadingList: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loadingList: false });
    }
  },

  createComparison: async (leaseAId, leaseBId) => {
    set({ creating: true, error: null, current: null });
    try {
      const { comparison } = await comparisonService.create(leaseAId, leaseBId);
      set({
        creating: false,
        current: comparison,
        comparisons: [comparison, ...get().comparisons],
      });
      return { ok: true, comparison };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ creating: false, error: message });
      return { ok: false, message };
    }
  },

  loadComparison: async (id) => {
    set({ error: null, current: null });
    try {
      const { comparison } = await comparisonService.getById(id);
      set({ current: comparison });
      return { ok: true, comparison };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      return { ok: false, message };
    }
  },

  deleteComparison: async (id) => {
    try {
      await comparisonService.remove(id);
      set({ comparisons: get().comparisons.filter((c) => c._id !== id) });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    }
  },

  clearCurrent: () => set({ current: null }),
}));
