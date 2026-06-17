import { useMemo, useState } from 'react';

/**
 * Derives filtered clause lists and aggregate counts from a lease's
 * analysisResults, plus the active risk filter state.
 */
export const useAnalysis = (analysisResults = []) => {
  const [filter, setFilter] = useState('ALL'); // ALL | HIGH | MEDIUM | LOW

  const counts = useMemo(() => {
    const c = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const r of analysisResults) {
      const level = (r.riskLevel || 'LOW').toUpperCase();
      c[level] = (c[level] || 0) + 1;
    }
    return c;
  }, [analysisResults]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return analysisResults;
    return analysisResults.filter(
      (r) => (r.riskLevel || 'LOW').toUpperCase() === filter
    );
  }, [analysisResults, filter]);

  return { filter, setFilter, counts, filtered, total: analysisResults.length };
};
