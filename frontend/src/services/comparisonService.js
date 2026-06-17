import api from './api.js';

export const comparisonService = {
  /** Create a comparison between two leases. */
  create: (leaseAId, leaseBId) =>
    api.post('/comparisons', { leaseAId, leaseBId }).then((r) => r.data),

  /** List saved comparisons. */
  list: () => api.get('/comparisons').then((r) => r.data),

  /** Get one comparison by id. */
  getById: (id) => api.get(`/comparisons/${id}`).then((r) => r.data),

  /** Delete a comparison. */
  remove: (id) => api.delete(`/comparisons/${id}`).then((r) => r.data),
};
