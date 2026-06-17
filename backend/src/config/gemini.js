import { GoogleGenAI } from '@google/genai';

/**
 * Centralized Gemini client factory using the official @google/genai SDK.
 *
 * The newer SDK supports current Gemini auth keys (the "AQ." prefixed keys
 * that Google AI Studio now issues by default). The client is created lazily
 * so the app can boot even if the key is missing — uploads will fail loudly
 * instead of crashing on startup.
 */
let client = null;

export const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return client;
};

/** The model id to use; configurable via env, defaults to gemini-2.5-flash. */
export const getGeminiModelName = () =>
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';
