const { body } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const validate = require('../middleware/validate');

const updateMeValidators = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Enter a valid name.'),
  body('preferredLanguage').optional().isIn(['en', 'hi']),
  validate,
];

const passwordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must include an uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must include a number.'),
  validate,
];

const getMe = asyncHandler(async (req, res) => {
  success(res, { user: req.user.toSafeObject() });
});

const updateMe = asyncHandler(async (req, res) => {
  const { name, preferredLanguage } = req.body;
  if (name) req.user.name = name;
  if (preferredLanguage) req.user.preferredLanguage = preferredLanguage;
  await req.user.save();
  success(res, { user: req.user.toSafeObject() }, 'Profile updated.');
});

const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const ok = await user.comparePassword(req.body.currentPassword);
  if (!ok) throw new AppError('Current password is incorrect.', 401, 'INVALID_CREDENTIALS');
  user.password = req.body.newPassword;
  await user.save();
  success(res, {}, 'Password updated.');
});

module.exports = { getMe, updateMe, updatePassword, updateMeValidators, passwordValidators };
