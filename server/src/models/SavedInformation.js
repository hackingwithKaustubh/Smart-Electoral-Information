const mongoose = require('mongoose');

const savedInformationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['message', 'faq', 'information', 'source'],
      required: true,
    },
    refId: { type: String, default: '' },
    title: { type: String, required: true, maxlength: 160 },
    snippet: { type: String, default: '', maxlength: 400 },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

savedInformationSchema.index({ user: 1, createdAt: -1 });
savedInformationSchema.index({ user: 1, title: 'text', snippet: 'text' });

module.exports = mongoose.model('SavedInformation', savedInformationSchema);
