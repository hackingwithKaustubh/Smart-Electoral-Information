const SavedInformation = require('../models/SavedInformation');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const listSaved = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  const filter = { user: req.user._id };
  if (q) filter.title = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await SavedInformation.find(filter).sort({ createdAt: -1 });
  success(res, { items });
});

const createSaved = asyncHandler(async (req, res) => {
  const { type, refId, title, snippet, payload } = req.body;
  if (!title || !type) throw new AppError('Title and type are required.', 422, 'VALIDATION_ERROR');
  const item = await SavedInformation.create({
    user: req.user._id,
    type,
    refId: refId || '',
    title,
    snippet: snippet || '',
    payload: payload || {},
  });
  success(res, { item }, 'Saved.', 201);
});

const deleteSaved = asyncHandler(async (req, res) => {
  const item = await SavedInformation.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) throw new AppError('Saved item not found.', 404, 'NOT_FOUND');
  await item.deleteOne();
  success(res, {}, 'Removed from saved information.');
});

module.exports = { listSaved, createSaved, deleteSaved };
