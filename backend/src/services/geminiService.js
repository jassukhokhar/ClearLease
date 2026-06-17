import { getGeminiClient, getGeminiModelName } from '../config/gemini.js';

/**
 * The system prompt that turns Gemini into a tenant-rights legal analyst.
 * It must return ONLY valid JSON — no markdown, no prose.
 */
const buildPrompt = (leaseText) => `You are a professional tenant-rights legal analyst.

Analyze the following residential lease agreement and identify clauses that are risky, unfair, or disadvantageous to the tenant.

Specifically look for:
- Hidden fees
- Lock-in clauses
- Maintenance responsibilities unfairly shifted to the tenant
- Painting penalties
- Security deposit risks
- Unfair termination clauses
- Automatic renewal clauses
- Tenant liability clauses
- Excessive penalties
- Landlord-favored language

For each issue you find, return an object with:
- "quote": the exact text from the lease (keep it short, max 2 sentences)
- "translation": a simple plain-English explanation of what it means for the tenant
- "riskLevel": one of "HIGH", "MEDIUM", or "LOW"
- "pageNumber": your best estimate of the page number (integer, default 1)
- "recommendation": concrete advice for the tenant

Return ONLY a valid JSON array. No markdown. No explanations. No extra text.
If there are no risky clauses, return an empty array [].

Example output:
[
  {
    "quote": "Tenant shall repaint the entire unit at their own cost upon vacating.",
    "translation": "You must pay to repaint the whole apartment when you move out.",
    "riskLevel": "HIGH",
    "pageNumber": 3,
    "recommendation": "Negotiate to remove this or cap the painting cost. Normal wear and tear is usually the landlord's responsibility."
  }
]

LEASE AGREEMENT:
"""
${leaseText}
"""`;

/**
 * Strip accidental markdown fences and parse the model output into an array
 * of normalized analysis result objects.
 */
const parseAnalysis = (raw) => {
  let cleaned = (raw || '').trim();

  // Remove ```json ... ``` fences if the model added them.
  cleaned = cleaned
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  // Best-effort: grab the outermost JSON array if there's surrounding noise.
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned an unparseable response. Please try again.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('AI returned an unexpected format.');
  }

  const allowedLevels = ['HIGH', 'MEDIUM', 'LOW'];

  return parsed
    .filter((item) => item && item.quote && item.translation)
    .map((item) => ({
      quote: String(item.quote).trim(),
      translation: String(item.translation).trim(),
      riskLevel: allowedLevels.includes(String(item.riskLevel).toUpperCase())
        ? String(item.riskLevel).toUpperCase()
        : 'LOW',
      pageNumber: Number.isFinite(Number(item.pageNumber))
        ? Math.max(1, parseInt(item.pageNumber, 10))
        : 1,
      recommendation: String(item.recommendation || '').trim(),
    }));
};

/**
 * Send extracted lease text to Gemini and return the parsed analysis results.
 *
 * @param {string} leaseText
 * @returns {Promise<Array>}
 */
export const analyzeLease = async (leaseText) => {
  // Gemini has generous context, but trim absurdly large inputs defensively.
  const MAX_CHARS = 60000;
  const input =
    leaseText.length > MAX_CHARS ? leaseText.slice(0, MAX_CHARS) : leaseText;

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: getGeminiModelName(),
    contents: buildPrompt(input),
    config: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  return parseAnalysis(response.text);
};
