const User = require('../models/User');
const FAQ = require('../models/FAQ');
const ElectoralInformation = require('../models/ElectoralInformation');
const OfficialSource = require('../models/OfficialSource');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { writeAudit } = require('../utils/audit');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(200);
  success(res, { users: users.map((u) => u.toSafeObject()) });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found.', 404, 'NOT_FOUND');
  if (String(user._id) === String(req.user._id)) {
    throw new AppError('You cannot change your own status here.', 400, 'BAD_REQUEST');
  }
  user.status = req.body.status === 'suspended' ? 'suspended' : 'active';
  await user.save();
  await writeAudit(req, 'admin.user.status', 'User', { userId: user._id, status: user.status });
  success(res, { user: user.toSafeObject() }, 'User updated.');
});

const createFaq = asyncHandler(async (req, res) => {
  const item = await FAQ.create(req.body);
  await writeAudit(req, 'admin.faq.create', 'FAQ', { id: item._id });
  success(res, { item }, 'FAQ created.', 201);
});

const updateFaq = asyncHandler(async (req, res) => {
  const item = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) throw new AppError('FAQ not found.', 404, 'NOT_FOUND');
  success(res, { item }, 'FAQ updated.');
});

const deleteFaq = asyncHandler(async (req, res) => {
  const item = await FAQ.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('FAQ not found.', 404, 'NOT_FOUND');
  success(res, {}, 'FAQ deleted.');
});

const createInformation = asyncHandler(async (req, res) => {
  const item = await ElectoralInformation.create(req.body);
  await writeAudit(req, 'admin.info.create', 'ElectoralInformation', { id: item._id });
  success(res, { item }, 'Information created.', 201);
});

const updateInformation = asyncHandler(async (req, res) => {
  const item = await ElectoralInformation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new AppError('Information not found.', 404, 'NOT_FOUND');
  success(res, { item }, 'Information updated.');
});

const deleteInformation = asyncHandler(async (req, res) => {
  const item = await ElectoralInformation.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Information not found.', 404, 'NOT_FOUND');
  success(res, {}, 'Information deleted.');
});

const createSource = asyncHandler(async (req, res) => {
  const item = await OfficialSource.create(req.body);
  success(res, { item }, 'Source created.', 201);
});

const updateSource = asyncHandler(async (req, res) => {
  const item = await OfficialSource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new AppError('Source not found.', 404, 'NOT_FOUND');
  success(res, { item }, 'Source updated.');
});

const deleteSource = asyncHandler(async (req, res) => {
  const item = await OfficialSource.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Source not found.', 404, 'NOT_FOUND');
  success(res, {}, 'Source deleted.');
});

const analytics = asyncHandler(async (req, res) => {
  const [totalUsers, conversations, messages, intentGroups, languageGroups, recent] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Conversation.countDocuments(),
    Message.countDocuments({ role: 'user' }),
    Message.aggregate([
      { $match: { role: 'assistant', intent: { $ne: null } } },
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Message.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
    ]),
    AuditLog.find().sort({ createdAt: -1 }).limit(12).populate('actor', 'name email'),
  ]);

  success(res, {
    totals: { users: totalUsers, conversations, questions: messages },
    intents: intentGroups,
    languages: languageGroups,
    recentActivity: recent,
  });
});

module.exports = {
  listUsers,
  updateUserStatus,
  createFaq,
  updateFaq,
  deleteFaq,
  createInformation,
  updateInformation,
  deleteInformation,
  createSource,
  updateSource,
  deleteSource,
  analytics,
};
