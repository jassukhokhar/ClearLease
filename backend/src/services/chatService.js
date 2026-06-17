import { getGeminiClient, getGeminiModelName } from '../config/gemini.js';

const DISCLAIMER = 'This is informational guidance and not legal advice.';

// Keep the lease text within a sane prompt budget.
const MAX_LEASE_CHARS = 12000;
// Only feed the last N turns back to the model to bound prompt size.
const MAX_HISTORY = 10;

/**
 * Summarize the existing AI analysis into a compact, readable block.
 */
const formatAnalysis = (results = []) => {
  if (!results.length) return 'No risky clauses were flagged in the analysis.';
  return results
    .slice(0, 40)
    .map(
      (r, i) =>
        `${i + 1}. [${(r.riskLevel || 'LOW').toUpperCase()}] (p.${
          r.pageNumber || 1
        }) "${r.quote}" — ${r.translation}${
          r.recommendation ? ` Recommendation: ${r.recommendation}` : ''
        }`
    )
    .join('\n');
};

/**
 * Build the full prompt: persona + lease context + prior turns + new question.
 */
const buildPrompt = (lease, history, question) => {
  const leaseText = (lease.extractedText || '').slice(0, MAX_LEASE_CHARS);

  const priorTurns = history
    .slice(-MAX_HISTORY)
    .map((m) => `${m.role === 'user' ? 'Tenant' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `You are ClearLease's Tenant Rights Legal Assistant. You help renters understand their lease in clear, plain English.

Rules:
- Answer ONLY using the lease text, the AI risk analysis, and general tenant-rights knowledge.
- Be concise, practical and friendly. Use short paragraphs or bullet points.
- If the lease does not cover something, say so plainly.
- You are NOT a lawyer. Never claim to give legal advice.
- End every answer with: "${DISCLAIMER}"

LEASE RISK SUMMARY:
- Overall risk score: ${lease.overallRiskScore}/100 (${lease.riskLabel})
- Total flagged clauses: ${lease.totalFlags}

FLAGGED CLAUSES:
${formatAnalysis(lease.analysisResults)}

LEASE TEXT (may be truncated):
"""
${leaseText}
"""
${priorTurns ? `\nCONVERSATION SO FAR:\n${priorTurns}\n` : ''}
Tenant's question: ${question}

Answer:`;
};

/**
 * Ask Gemini a question about a specific lease, with conversation memory.
 *
 * @param {object} lease - the LeaseDocument (needs extractedText, analysisResults, score, label)
 * @param {Array} history - prior messages [{ role, content }]
 * @param {string} question
 * @returns {Promise<string>} the assistant's answer
 */
export const askLeaseQuestion = async (lease, history, question) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: getGeminiModelName(),
    contents: buildPrompt(lease, history, question),
    config: { temperature: 0.4 },
  });

  let answer = (response.text || '').trim();
  if (!answer) {
    throw new Error('The assistant could not generate a response. Please try again.');
  }

  // Guarantee the disclaimer is present.
  if (!answer.includes(DISCLAIMER)) {
    answer = `${answer}\n\n${DISCLAIMER}`;
  }

  return answer;
};
