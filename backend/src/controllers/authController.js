import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with that email already exists');
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(res, user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Authenticate user & set cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Need the password field, which is select:false by default.
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(res, user._id);

  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Log out user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
