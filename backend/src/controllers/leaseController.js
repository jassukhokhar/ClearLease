import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';
import LeaseDocument from '../models/LeaseDocument.js';
import { extractTextFromPdf, removeFile } from '../services/pdfService.js';
import { analyzeLease } from '../services/geminiService.js';
import { computeRiskScore } from '../services/riskScoringService.js';
import { generateNegotiationLetter } from '../services/negotiationService.js';
import { buildLeaseReport } from '../services/reportService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

/**
 * @desc    Upload a lease PDF, extract text, analyze with AI, score & store.
 * @route   POST /api/leases/upload
 * @access  Private
 */
export const uploadLease = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No PDF file uploaded');
  }

  const filePath = path.join(uploadDir, req.file.filename);

  let extractedText;
  try {
    const { text } = await extractTextFromPdf(filePath);
    extractedText = text;
  } catch (err) {
    await removeFile(filePath);
    res.status(422);
    throw new Error(err.message || 'Failed to read PDF');
  }

  let analysisResults;
  try {
    analysisResults = await analyzeLease(extractedText);
  } catch (err) {
    await removeFile(filePath);
    res.status(502);
    throw new Error(err.message || 'AI analysis failed. Please try again.');
  }

  const { overallRiskScore, riskLabel, totalFlags } =
    computeRiskScore(analysisResults);

  const lease = await LeaseDocument.create({
    user: req.user._id,
    originalFileName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    extractedText,
    overallRiskScore,
    riskLabel,
    totalFlags,
    analysisResults,
  });

  res.status(201).json({ success: true, lease });
});

/**
 * @desc    Get all leases for the current user (newest first, no heavy text).
 * @route   GET /api/leases/history
 * @access  Private
 */
export const getHistory = asyncHandler(async (req, res) => {
  const leases = await LeaseDocument.find({ user: req.user._id })
    .select('-extractedText -analysisResults')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: leases.length, leases });
});

// Keyword buckets for the "most common risk categories" widget.
const CATEGORY_RULES = [
  { key: 'Security Deposit', re: /deposit/i },
  { key: 'Maintenance & Repairs', re: /maintenance|repair/i },
  { key: 'Hidden Fees', re: /\bfee|charge|surcharge|cost\b/i },
  { key: 'Painting', re: /paint/i },
  { key: 'Termination', re: /terminat|vacat|move[- ]?out|notice period/i },
  { key: 'Auto-Renewal', re: /renew|auto-?renew/i },
  { key: 'Penalties', re: /penalt|fine|late fee|liquidated/i },
  { key: 'Lock-in', re: /lock[- ]?in|minimum term|lease term/i },
];

/**
 * @desc    Aggregate dashboard stats: risk trend + common risk categories.
 * @route   GET /api/leases/stats
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const leases = await LeaseDocument.find({ user: req.user._id })
    .select('originalFileName overallRiskScore createdAt analysisResults')
    .sort({ createdAt: 1 });

  const riskTrend = leases.map((l) => ({
    date: l.createdAt,
    score: l.overallRiskScore,
    name: l.originalFileName,
  }));

  const tally = Object.fromEntries(CATEGORY_RULES.map((c) => [c.key, 0]));
  for (const lease of leases) {
    for (const clause of lease.analysisResults || []) {
      const text = `${clause.quote || ''} ${clause.translation || ''}`;
      for (const rule of CATEGORY_RULES) {
        if (rule.re.test(text)) tally[rule.key] += 1;
      }
    }
  }

  const categories = Object.entries(tally)
    .map(([key, count]) => ({ key, count }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  res.json({ success: true, riskTrend, categories });
});

/**
 * @desc    Get a single lease by id (must belong to the user).
 * @route   GET /api/leases/:id
 * @access  Private
 */
export const getLeaseById = asyncHandler(async (req, res) => {
  const lease = await LeaseDocument.findById(req.params.id);

  if (!lease) {
    res.status(404);
    throw new Error('Lease not found');
  }

  if (lease.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this lease');
  }

  res.json({ success: true, lease });
});

/**
 * @desc    Delete a lease (and its file) — must belong to the user.
 * @route   DELETE /api/leases/:id
 * @access  Private
 */
export const deleteLease = asyncHandler(async (req, res) => {
  const lease = await LeaseDocument.findById(req.params.id);

  if (!lease) {
    res.status(404);
    throw new Error('Lease not found');
  }

  if (lease.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this lease');
  }

  // Remove the stored file (best-effort).
  if (lease.fileUrl) {
    const fileName = path.basename(lease.fileUrl);
    await removeFile(path.join(uploadDir, fileName));
  }

  await lease.deleteOne();

  res.json({ success: true, message: 'Lease deleted' });
});

/**
 * @desc    Generate an AI negotiation letter for one flagged clause.
 * @route   POST /api/leases/:leaseId/negotiation-letter
 * @access  Private
 */
export const generateLetter = asyncHandler(async (req, res) => {
  const { clauseIndex, tone } = req.body;

  const lease = await LeaseDocument.findById(req.params.leaseId);
  if (!lease) {
    res.status(404);
    throw new Error('Lease not found');
  }
  if (lease.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this lease');
  }

  let clause;
  if (clauseIndex === undefined || clauseIndex === null || Number(clauseIndex) === -1) {
    const highAndMed = (lease.analysisResults || []).filter(
      (r) => (r.riskLevel || '').toUpperCase() === 'HIGH' || (r.riskLevel || '').toUpperCase() === 'MEDIUM'
    );
    const targetList = highAndMed.length > 0 ? highAndMed : (lease.analysisResults || []);

    if (!targetList.length) {
      res.status(400);
      throw new Error('No flagged clauses found to negotiate');
    }

    clause = {
      quote: targetList.map((c) => `- [Page ${c.pageNumber || 1}]: "${c.quote}"`).join('\n'),
      translation: targetList.map((c) => `- Concern: ${c.translation}`).join('\n'),
      recommendation: targetList
        .filter((c) => c.recommendation)
        .map((c) => `- Recommendation: ${c.recommendation}`)
        .join('\n'),
      isCombined: true,
    };
  } else {
    clause = lease.analysisResults[clauseIndex];
    if (!clause) {
      res.status(400);
      throw new Error('Clause not found for the provided index');
    }
  }

  const letter = await generateNegotiationLetter(lease, clause, tone);
  res.json({ success: true, letter });
});

/**
 * @desc    Export a professional PDF report for a lease.
 * @route   GET /api/leases/:id/export
 * @access  Private
 */
export const exportReport = asyncHandler(async (req, res) => {
  const lease = await LeaseDocument.findById(req.params.id);
  if (!lease) {
    res.status(404);
    throw new Error('Lease not found');
  }
  if (lease.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this lease');
  }

  const safeName =
    (lease.originalFileName || 'lease').replace(/\.pdf$/i, '').replace(/[^\w.-]+/g, '_');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="ClearLease-Report-${safeName}.pdf"`
  );

  const doc = buildLeaseReport(lease);
  doc.pipe(res);
  doc.end();

  // Stamp last export time (best-effort, non-blocking).
  lease.lastExportedAt = new Date();
  lease.save().catch(() => {});
});
