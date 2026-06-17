import { getGeminiClient, getGeminiModelName } from '../config/gemini.js';

const TONES = {
  email: 'a concise, polite email to the landlord',
  formal: 'a professional, formal written letter',
  friendly: 'a warm, friendly and cooperative message',
  strong: 'a firm, assertive negotiation message that still stays professional',
};

export const ALLOWED_TONES = Object.keys(TONES);

/**
 * Strip code fences and parse a single JSON object from model output.
 */
const parseLetter = (raw) => {
  let cleaned = (raw || '').trim();
  cleaned = cleaned
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: treat the whole thing as the body.
    return { subject: 'Request to Discuss a Lease Clause', body: (raw || '').trim() };
  }

  return {
    subject: String(parsed.subject || 'Request to Discuss a Lease Clause').trim(),
    body: String(parsed.body || '').trim(),
  };
};

const buildPrompt = (lease, clause, tone) => `You are helping a tenant negotiate a clause in their residential lease.

Write ${TONES[tone]} addressed to the landlord requesting a change or clarification to the clause below. Be specific, reference the concern in plain language, propose a reasonable alternative, and keep it respectful. Do NOT claim to provide legal advice.

LEASE: ${lease.originalFileName}

CLAUSE IN QUESTION:
"${clause.quote}"

WHY IT MATTERS FOR THE TENANT:
${clause.translation}
${clause.recommendation ? `SUGGESTED DIRECTION: ${clause.recommendation}` : ''}

Return ONLY valid JSON, no markdown, in exactly this shape:
{
  "subject": "a short subject line",
  "body": "the full letter/email body, with greeting and sign-off as 'Sincerely, [Your Name]'"
}`;

/**
 * Generate a negotiation letter for a single clause.
 *
 * @param {object} lease - LeaseDocument
 * @param {object} clause - one analysisResults entry { quote, translation, recommendation }
 * @param {string} tone - one of ALLOWED_TONES
 * @returns {Promise<{subject:string, body:string}>}
 */
export const generateNegotiationLetter = async (lease, clause, tone) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: getGeminiModelName(),
    contents: buildPrompt(lease, clause, tone),
    config: { temperature: 0.6, responseMimeType: 'application/json' },
  });

  return parseLetter(response.text);
};
