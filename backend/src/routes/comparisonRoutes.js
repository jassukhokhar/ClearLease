import express from 'express';
import { body, param } from 'express-validator';
import {
  createComparison,
  getComparisons,
  getComparisonById,
  deleteComparison,
} from '../controllers/comparisonController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { aiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// All comparison routes are protected.
router.use(protect);

router.get('/', getComparisons);

router.post(
  '/',
  aiLimiter,
  body('leaseAId').isMongoId().withMessage('Invalid lease A id'),
  body('leaseBId').isMongoId().withMessage('Invalid lease B id'),
  validate,
  createComparison
);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid comparison id'),
  validate,
  getComparisonById
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid comparison id'),
  validate,
  deleteComparison
);

export default router;
