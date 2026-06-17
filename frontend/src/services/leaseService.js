import api from './api.js';

export const leaseService = {
  /**
   * Upload a lease PDF with progress reporting.
   * @param {File} file
   * @param {(percent:number)=>void} onProgress
   */
  upload: (file, onProgress) => {
    const formData = new FormData();
    formData.append('lease', file);

    return api
      .post('/leases/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      })
      .then((r) => r.data);
  },

  history: () => api.get('/leases/history').then((r) => r.data),
  stats: () => api.get('/leases/stats').then((r) => r.data),
  getById: (id) => api.get(`/leases/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/leases/${id}`).then((r) => r.data),

  /** Generate an AI negotiation letter for a specific clause. */
  negotiationLetter: (leaseId, { clauseIndex, tone }) =>
    api
      .post(`/leases/${leaseId}/negotiation-letter`, { clauseIndex, tone })
      .then((r) => r.data),

  /** Download the professional PDF report as a Blob. */
  exportReport: (id) =>
    api.get(`/leases/${id}/export`, { responseType: 'blob' }).then((r) => r.data),
};
