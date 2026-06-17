import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validate,
  registerRules,
  loginRules,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

export default router;
