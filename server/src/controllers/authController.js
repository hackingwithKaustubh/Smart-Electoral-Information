const { body } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { signToken, cookieOptions } = require('../middleware/auth');
const { writeAudit } = require('../utils/audit');
const validate = require('../middleware/validate');

const registerValidators = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Please enter your full name.'),
  body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must include an uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must include a number.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match.');
    return true;
  }),
  body('preferredLanguage').optional().isIn(['en', 'hi']).withMessage('Language must be en or hi.'),
  validate,
];

const loginValidators = [
  body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
];

const register = asyncHandler(async (req, res) => {
  const { name, email, password, preferredLanguage } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409, 'DUPLICATE');
  }
  const user = await User.create({
    name,
    email,
    password,
    preferredLanguage: preferredLanguage || 'en',
  });
  const token = signToken(user._id);
  res.cookie('token', token, cookieOptions());
  await writeAudit(req, 'auth.register', 'User', { userId: user._id });
  success(res, { user: user.toSafeObject(), token }, 'Account created.', 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password.', 401, 'INVALID_CREDENTIALS');
  }
  if (user.status !== 'active') {
    throw new AppError('This account is suspended.', 403, 'ACCOUNT_SUSPENDED');
  }
  const token = signToken(user._id);
  res.cookie('token', token, cookieOptions());
  await writeAudit(req, 'auth.login', 'User', { userId: user._id });
  success(res, { user: user.toSafeObject(), token }, 'Logged in.');
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { ...cookieOptions(), maxAge: 0 });
  success(res, {}, 'Logged out.');
});

module.exports = { register, login, logout, registerValidators, loginValidators };
