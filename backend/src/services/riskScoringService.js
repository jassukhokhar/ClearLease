/**
 * Risk scoring engine.
 *
 * Points per flag:
 *   HIGH   = 10
 *   MEDIUM = 5
 *   LOW    = 1
 *
 * The raw score is normalized to a 0-100 scale so that documents of
 * different sizes are comparable, then bucketed into a label.
 */

const POINTS = { HIGH: 10, MEDIUM: 5, LOW: 1 };

/**
 * @param {Array<{riskLevel: string}>} flags
 * @returns {{ overallRiskScore: number, riskLabel: string, totalFlags: number, counts: object }}
 */
export const computeRiskScore = (flags = []) => {
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  let rawScore = 0;

  for (const flag of flags) {
    const level = (flag.riskLevel || 'LOW').toUpperCase();
    const points = POINTS[level] ?? POINTS.LOW;
    rawScore += points;
    counts[level] = (counts[level] || 0) + 1;
  }

  const totalFlags = flags.length;

  // Normalize: assume the "worst realistic" lease has ~12 HIGH-equivalent
  // flags (120 points) => 100. Cap at 100.
  const NORMALIZER = 120;
  const overallRiskScore = Math.min(
    100,
    Math.round((rawScore / NORMALIZER) * 100)
  );

  let riskLabel = 'SAFE';
  if (overallRiskScore >= 60) {
    riskLabel = 'HIGH RISK';
  } else if (overallRiskScore >= 25) {
    riskLabel = 'MODERATE RISK';
  }

  // A document with any HIGH flags is never "SAFE".
  if (riskLabel === 'SAFE' && counts.HIGH > 0) {
    riskLabel = 'MODERATE RISK';
  }

  return { overallRiskScore, riskLabel, totalFlags, counts };
};
