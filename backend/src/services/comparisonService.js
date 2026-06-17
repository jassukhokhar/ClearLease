import { getGeminiClient, getGeminiModelName } from '../config/gemini.js';

// The dimensions compared (must match the frontend COMPARISON_DIMENSIONS keys).
const DIMENSION_KEYS = [
  'securityDeposit',
  'maintenance',
  'termination',
  'hiddenFees',
  'renewal',
  'penalties',
  'tenantObligations',
];

/**
 * Compact a lease into a prompt-friendly block.
 */
const leaseBlock = (label, lease) => {
  const clauses = (lease.analysisResults || [])
    .slice(0, 30)
    .map(
      (r) =>
        `- [${(r.riskLevel || 'LOW').toUpperCase()}] ${r.quote} (${r.translation})`
    )
    .join('\n');
  return `${label}: "${lease.originalFileName}"
Risk score: ${lease.overallRiskScore}/100 (${lease.riskLabel}); ${lease.totalFlags} flags
Flagged clauses:
${clauses || '- none'}`;
};

const parseJson = (raw) => {
  let cleaned = (raw || '').trim();
  cleaned = cleaned
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return JSON.parse(cleaned);
};

const buildPrompt = (a, b) => `You are a tenant-rights legal analyst comparing two residential leases for a renter deciding which to sign.

${leaseBlock('LEASE A', a)}

${leaseBlock('LEASE B', b)}

Compare the two leases across these dimensions: securityDeposit, maintenance, termination, hiddenFees, renewal, penalties, tenantObligations.

For each dimension, briefly describe each lease's terms and which is better for the tenant.

Return ONLY valid JSON (no markdown) in exactly this shape:
{
  "dimensions": [
    { "key": "securityDeposit", "leaseA": "short description", "leaseB": "short description", "better": "A" | "B" | "TIE" }
  ],
  "saferLease": "A" | "B" | "TIE",
  "mostExpensive": "A" | "B" | "TIE",
  "highestRisk": "A" | "B" | "TIE",
  "winner": "A" | "B" | "TIE",
  "aiSummary": "2-4 sentence plain-English verdict explaining which lease is the better choice and why"
}
Include exactly one object per dimension listed above, using those exact keys.`;

/**
 * Generate a structured comparison of two lease documents.
 *
 * @param {object} leaseA
 * @param {object} leaseB
 * @returns {Promise<object>} structured summary
 */
export const compareLeases = async (leaseA, leaseB) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: getGeminiModelName(),
    contents: buildPrompt(leaseA, leaseB),
    config: { temperature: 0.3, responseMimeType: 'application/json' },
  });

  let parsed;
  try {
    parsed = parseJson(response.text);
  } catch {
    throw new Error('AI returned an unparseable comparison. Please try again.');
  }

  const normSide = (v) => {
    const s = String(v || 'TIE').toUpperCase();
    return ['A', 'B', 'TIE'].includes(s) ? s : 'TIE';
  };

  const dimsIn = Array.isArray(parsed.dimensions) ? parsed.dimensions : [];
  const dimensions = DIMENSION_KEYS.map((key) => {
    const found = dimsIn.find((d) => d && d.key === key) || {};
    return {
      key,
      leaseA: String(found.leaseA || '—'),
      leaseB: String(found.leaseB || '—'),
      better: normSide(found.better),
    };
  });

  return {
    dimensions,
    saferLease: normSide(parsed.saferLease),
    mostExpensive: normSide(parsed.mostExpensive),
    highestRisk: normSide(parsed.highestRisk),
    winner: normSide(parsed.winner),
    aiSummary: String(parsed.aiSummary || '').trim(),
  };
};
