const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    lastIntent: { type: String, default: 'UNKNOWN' },
    preview: { type: String, default: '', maxlength: 280 },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, updatedAt: -1 });
conversationSchema.index({ user: 1, title: 'text', preview: 'text' });

module.exports = mongoose.model('Conversation', conversationSchema);
