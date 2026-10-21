const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const first = errors.array()[0];
  next(new AppError(first.msg, 422, 'VALIDATION_ERROR'));
}

module.exports = validate;
