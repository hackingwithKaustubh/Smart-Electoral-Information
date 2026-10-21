const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');
const ElectoralInformation = require('../models/ElectoralInformation');
const OfficialSource = require('../models/OfficialSource');
const Conversation = require('../models/Conversation');
const SavedInformation = require('../models/SavedInformation');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const listInformation = asyncHandler(async (req, res) => {
  const { category, q } = req.query;
  const filter = { published: true };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };
  const items = await ElectoralInformation.find(filter).sort({ title: 1 });
  success(res, { items });
});

const getInformation = asyncHandler(async (req, res) => {
  const or = [{ slug: req.params.id }];
  if (mongoose.isValidObjectId(req.params.id)) or.push({ _id: req.params.id });
  const item = await ElectoralInformation.findOne({ published: true, $or: or });
  if (!item) throw new AppError('Information not found.', 404, 'NOT_FOUND');
  success(res, { item });
});

const listFaqs = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const filter = { published: true };
  if (q) filter.$text = { $search: q };
  const items = await FAQ.find(filter).sort({ category: 1, createdAt: 1 });
  success(res, { items });
});

const getFaq = asyncHandler(async (req, res) => {
  const item = await FAQ.findOne({ _id: req.params.id, published: true });
  if (!item) throw new AppError('FAQ not found.', 404, 'NOT_FOUND');
  success(res, { item });
});

const listSources = asyncHandler(async (req, res) => {
  const items = await OfficialSource.find({ published: true }).sort({ name: 1 });
  success(res, { items });
});

const globalSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    return success(res, { faqs: [], information: [], sources: [], conversations: [], saved: [] });
  }
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safe, 'i');

  const [faqs, information, sources, conversations, saved] = await Promise.all([
    FAQ.find({ published: true, $or: [{ question: regex }, { answer: regex }, { tags: regex }] }).limit(8),
    ElectoralInformation.find({
      published: true,
      $or: [{ title: regex }, { summary: regex }, { content: regex }],
    }).limit(8),
    OfficialSource.find({ published: true, $or: [{ name: regex }, { description: regex }] }).limit(8),
    Conversation.find({ user: req.user._id, $or: [{ title: regex }, { preview: regex }] }).limit(8),
    SavedInformation.find({ user: req.user._id, $or: [{ title: regex }, { snippet: regex }] }).limit(8),
  ]);

  success(res, { faqs, information, sources, conversations, saved });
});

module.exports = {
  listInformation,
  getInformation,
  listFaqs,
  getFaq,
  listSources,
  globalSearch,
};
