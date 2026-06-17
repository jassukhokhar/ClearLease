import fs from 'fs/promises';
// Import the library directly to avoid pdf-parse's index.js debug harness,
// which tries to read a bundled test PDF when required at module load.
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

/**
 * Extract plain text from a PDF file on disk.
 *
 * @param {string} filePath absolute path to the uploaded PDF
 * @returns {Promise<{ text: string, numPages: number }>}
 */
export const extractTextFromPdf = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);

  const text = (data.text || '').trim();

  if (!text) {
    throw new Error(
      'No readable text found in the PDF. It may be a scanned image.'
    );
  }

  return {
    text,
    numPages: data.numpages || 1,
  };
};

/**
 * Safely delete a file from disk (best-effort, never throws).
 */
export const removeFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {
    // file already gone — ignore
  }
};
