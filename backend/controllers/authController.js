import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Category from '../models/Category.js';
import generateToken from '../utils/generateToken.js';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#C9973E', type: 'expense' },
  { name: 'Transportation', icon: '🚗', color: '#3B6FA0', type: 'expense' },
  { name: 'Housing & Rent', icon: '🏠', color: '#8B5E83', type: 'expense' },
  { name: 'Utilities', icon: '💡', color: '#4A8B7C', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#B24C3A', type: 'expense' },
  { name: 'Healthcare', icon: '💊', color: '#5C8A3A', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#C9973E', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#3B6FA0', type: 'expense' },
  { name: 'Other', icon: '📦', color: '#6B7280', type: 'expense' },
  { name: 'Salary', icon: '💰', color: '#1F6F5C', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#1F6F5C', type: 'income' },
  { name: 'Other Income', icon: '➕', color: '#1F6F5C', type: 'income' },
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, currency, monthlyIncome } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    currency: currency || 'USD',
    monthlyIncome: monthlyIncome || 0,
  });

  await Category.insertMany(
    DEFAULT_CATEGORIES.map((cat) => ({ ...cat, user: user._id, isDefault: true }))
  );

  const token = generateToken(res, user._id);

  res.status(201).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(res, user._id);

  res.json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const { name, currency, monthlyIncome, avatarColor } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name !== undefined) user.name = name;
  if (currency !== undefined) user.currency = currency;
  if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
  if (avatarColor !== undefined) user.avatarColor = avatarColor;

  const updatedUser = await user.save();
  res.json({ success: true, user: updatedUser.toSafeObject() });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});
