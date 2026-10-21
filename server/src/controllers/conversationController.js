const { body } = require('express-validator');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const aiService = require('../services/ai/aiService');
const validate = require('../middleware/validate');

function titleFromMessage(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.slice(0, 72) || 'New conversation';
}

const createConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.create({
    user: req.user._id,
    title: req.body.title || 'New conversation',
    language: req.user.preferredLanguage || 'en',
  });
  success(res, { conversation }, 'Conversation created.', 201);
});

const listConversations = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  const filter = { user: req.user._id };
  if (q) filter.title = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const conversations = await Conversation.find(filter).sort({ updatedAt: -1 }).limit(80);
  success(res, { conversations });
});

const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) throw new AppError('Conversation not found.', 404, 'NOT_FOUND');
  const messages = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 });
  success(res, { conversation, messages });
});

const updateConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) throw new AppError('Conversation not found.', 404, 'NOT_FOUND');
  if (req.body.title) conversation.title = req.body.title.slice(0, 120);
  await conversation.save();
  success(res, { conversation }, 'Conversation updated.');
});

const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) throw new AppError('Conversation not found.', 404, 'NOT_FOUND');
  await Message.deleteMany({ conversation: conversation._id });
  await conversation.deleteOne();
  success(res, {}, 'Conversation deleted.');
});

const clearConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) throw new AppError('Conversation not found.', 404, 'NOT_FOUND');
  await Message.deleteMany({ conversation: conversation._id });
  conversation.preview = '';
  conversation.messageCount = 0;
  await conversation.save();
  success(res, { conversation }, 'Conversation cleared.');
});

const chatValidators = [
  body('message').trim().isLength({ min: 1, max: 4000 }).withMessage('Please enter a question.'),
  validate,
];

const sendMessage = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;
  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, user: req.user._id });
    if (!conversation) throw new AppError('Conversation not found.', 404, 'NOT_FOUND');
  } else {
    conversation = await Conversation.create({
      user: req.user._id,
      title: titleFromMessage(message),
      language: req.user.preferredLanguage || 'en',
    });
  }

  const history = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 }).limit(16);
  const result = await aiService.chat({
    message,
    preferredLanguage: conversation.language || req.user.preferredLanguage,
    previousIntent: conversation.lastIntent,
    history,
  });

  const userMessage = await Message.create({
    conversation: conversation._id,
    user: req.user._id,
    role: 'user',
    content: message,
    language: result.language,
  });

  const assistantMessage = await Message.create({
    conversation: conversation._id,
    user: req.user._id,
    role: 'assistant',
    content: result.content,
    structured: result.structured,
    intent: result.intent,
    confidence: result.confidence,
    language: result.language,
    sources: result.sources,
  });

  conversation.lastIntent = result.intent;
  conversation.language = result.language;
  conversation.preview = result.content.slice(0, 220);
  conversation.messageCount = (conversation.messageCount || 0) + 2;
  if (conversation.title === 'New conversation') conversation.title = titleFromMessage(message);
  await conversation.save();

  success(res, {
    conversation,
    userMessage,
    assistantMessage,
    intent: { name: result.intent, confidence: result.confidence, method: result.method },
  });
});

const classifyIntent = asyncHandler(async (req, res) => {
  const result = await aiService.detectIntent(req.body.message || '', null);
  success(res, { intent: result });
});

module.exports = {
  createConversation,
  listConversations,
  getConversation,
  updateConversation,
  deleteConversation,
  clearConversation,
  sendMessage,
  classifyIntent,
  chatValidators,
};
