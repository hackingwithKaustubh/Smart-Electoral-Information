const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong.';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';

  if (err.name === 'ValidationError') {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE';
    message = 'An account with this email already exists.';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
  }

  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Something went wrong.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
}

function notFound(req, res, next) {
  next(new AppError('Route not found.', 404, 'NOT_FOUND'));
}

module.exports = { errorHandler, notFound };
