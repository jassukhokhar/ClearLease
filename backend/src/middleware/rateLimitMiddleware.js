import rateLimit from 'express-rate-limit';

/**
 * Stricter limiter for the AI-backed endpoints (chat, comparison, negotiation,
 * report export). These are expensive (Gemini / PDF generation) so we cap them
 * tighter than the general API limiter.
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests, please slow down and try again shortly.',
  },
});
