import express from 'express';
import { body, param } from 'express-validator';
import {
  uploadLease,
  getHistory,
  getDashboardStats,
  getLeaseById,
  deleteLease,
  generateLetter,
  exportReport,
} from '../controllers/leaseController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { aiLimiter } from '../middleware/rateLimitMiddleware.js';
import { ALLOWED_TONES } from '../services/negotiationService.js';

const router = express.Router();

// All lease routes are protected.
router.use(protect);

router.post('/upload', upload.single('lease'), uploadLease);
router.get('/history', getHistory);
router.get('/stats', getDashboardStats);

// AI negotiation letter for a clause.
router.post(
  '/:leaseId/negotiation-letter',
  aiLimiter,
  param('leaseId').isMongoId().withMessage('Invalid lease id'),
  body('clauseIndex')
    .isInt({ min: 0 })
    .withMessage('clauseIndex must be a non-negative integer'),
  body('tone')
    .isIn(ALLOWED_TONES)
    .withMessage(`tone must be one of: ${ALLOWED_TONES.join(', ')}`),
  validate,
  generateLetter
);

// Professional PDF report export.
router.get(
  '/:id/export',
  aiLimiter,
  param('id').isMongoId().withMessage('Invalid lease id'),
  validate,
  exportReport
);

router.get('/:id', getLeaseById);
router.delete('/:id', deleteLease);

export default router;
