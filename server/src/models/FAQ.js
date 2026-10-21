const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    questionHi: { type: String, default: '' },
    answer: { type: String, required: true },
    answerHi: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [] },
    sourceName: { type: String, default: 'Election Commission of India' },
    sourceUrl: { type: String, default: 'https://www.eci.gov.in/' },
    lastVerified: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text', tags: 'text' });

module.exports = mongoose.model('FAQ', faqSchema);
