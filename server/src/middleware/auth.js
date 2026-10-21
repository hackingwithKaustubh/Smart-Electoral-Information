const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError('Please log in to continue.', 401, 'UNAUTHORIZED');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError('Session expired. Please log in again.', 401, 'INVALID_TOKEN');
  }

  const user = await User.findById(decoded.sub);
  if (!user || user.status !== 'active') {
    throw new AppError('Account is not available.', 401, 'UNAUTHORIZED');
  }

  req.user = user;
  next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    next();
  };
}

module.exports = { protect, authorize, signToken, cookieOptions };
