const mongoose = require('mongoose');

const CATEGORIES = [
  'eligibility',
  'registration',
  'documents',
  'update-details',
  'electoral-process',
  'official-resources',
];

const electoralInformationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    title: { type: String, required: true },
    titleHi: { type: String, default: '' },
    summary: { type: String, required: true },
    summaryHi: { type: String, default: '' },
    content: { type: String, required: true },
    contentHi: { type: String, default: '' },
    steps: { type: [String], default: [] },
    stepsHi: { type: [String], default: [] },
    sourceName: { type: String, default: 'Election Commission of India' },
    sourceUrl: { type: String, default: 'https://www.eci.gov.in/' },
    lastVerified: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

electoralInformationSchema.index({ title: 'text', summary: 'text', content: 'text' });

module.exports = mongoose.model('ElectoralInformation', electoralInformationSchema);
module.exports.CATEGORIES = CATEGORIES;
