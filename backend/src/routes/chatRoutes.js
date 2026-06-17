import express from 'express';
import { body, param } from 'express-validator';
import {
  sendMessage,
  getConversation,
  getRecentConversations,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { aiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// All chat routes are protected.
router.use(protect);

router.get('/', getRecentConversations);

router.get(
  '/:leaseId',
  param('leaseId').isMongoId().withMessage('Invalid lease id'),
  validate,
  getConversation
);

router.post(
  '/:leaseId',
  aiLimiter,
  param('leaseId').isMongoId().withMessage('Invalid lease id'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message is too long (max 2000 characters)'),
  validate,
  sendMessage
);

export default router;
