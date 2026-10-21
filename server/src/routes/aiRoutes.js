const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many assistant requests. Please wait and try again.',
    errorCode: 'RATE_LIMITED',
  },
});

router.use(protect, aiLimiter);
router.post('/chat', conversationController.chatValidators, conversationController.sendMessage);
router.post('/intent', conversationController.classifyIntent);

module.exports = router;
