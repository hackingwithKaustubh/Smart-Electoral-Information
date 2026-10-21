const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema(
  {
    label: String,
    url: String,
    lastVerified: Date,
    kind: {
      type: String,
      enum: ['official', 'stored', 'ai_explanation', 'general_guidance'],
      default: 'general_guidance',
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, maxlength: 12000 },
    structured: { type: mongoose.Schema.Types.Mixed, default: null },
    intent: { type: String, default: null },
    confidence: { type: Number, default: null },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    sources: { type: [sourceSchema], default: [] },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
