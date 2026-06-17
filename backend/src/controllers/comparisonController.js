import asyncHandler from '../utils/asyncHandler.js';
import LeaseDocument from '../models/LeaseDocument.js';
import Comparison from '../models/Comparison.js';
import { compareLeases } from '../services/comparisonService.js';

/**
 * Load a lease owned by the user (or throw an HTTP error).
 */
const getOwnedLease = async (leaseId, userId, res) => {
  const lease = await LeaseDocument.findById(leaseId);
  if (!lease) {
    res.status(404);
    throw new Error('Lease not found');
  }
  if (lease.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this lease');
  }
  return lease;
};

/**
 * @desc    Compare two of the user's leases and save the result.
 * @route   POST /api/comparisons
 * @access  Private
 */
export const createComparison = asyncHandler(async (req, res) => {
  const { leaseAId, leaseBId } = req.body;

  if (leaseAId === leaseBId) {
    res.status(400);
    throw new Error('Please choose two different leases to compare');
  }

  const [leaseA, leaseB] = await Promise.all([
    getOwnedLease(leaseAId, req.user._id, res),
    getOwnedLease(leaseBId, req.user._id, res),
  ]);

  const summary = await compareLeases(leaseA, leaseB);

  const comparison = await Comparison.create({
    user: req.user._id,
    leaseA: leaseA._id,
    leaseB: leaseB._id,
    summary,
  });

  res.status(201).json({
    success: true,
    comparison: {
      _id: comparison._id,
      leaseA: { _id: leaseA._id, name: leaseA.originalFileName, score: leaseA.overallRiskScore, label: leaseA.riskLabel },
      leaseB: { _id: leaseB._id, name: leaseB.originalFileName, score: leaseB.overallRiskScore, label: leaseB.riskLabel },
      summary,
      createdAt: comparison.createdAt,
    },
  });
});

/**
 * @desc    List the user's saved comparisons (newest first).
 * @route   GET /api/comparisons
 * @access  Private
 */
export const getComparisons = asyncHandler(async (req, res) => {
  const comparisons = await Comparison.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('leaseA', 'originalFileName overallRiskScore riskLabel')
    .populate('leaseB', 'originalFileName overallRiskScore riskLabel');

  res.json({ success: true, count: comparisons.length, comparisons });
});

/**
 * @desc    Get one comparison by id.
 * @route   GET /api/comparisons/:id
 * @access  Private
 */
export const getComparisonById = asyncHandler(async (req, res) => {
  const comparison = await Comparison.findById(req.params.id)
    .populate('leaseA', 'originalFileName overallRiskScore riskLabel')
    .populate('leaseB', 'originalFileName overallRiskScore riskLabel');

  if (!comparison) {
    res.status(404);
    throw new Error('Comparison not found');
  }
  if (comparison.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this comparison');
  }

  res.json({ success: true, comparison });
});

/**
 * @desc    Delete a comparison.
 * @route   DELETE /api/comparisons/:id
 * @access  Private
 */
export const deleteComparison = asyncHandler(async (req, res) => {
  const comparison = await Comparison.findById(req.params.id);
  if (!comparison) {
    res.status(404);
    throw new Error('Comparison not found');
  }
  if (comparison.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this comparison');
  }

  await comparison.deleteOne();
  res.json({ success: true, message: 'Comparison deleted' });
});
