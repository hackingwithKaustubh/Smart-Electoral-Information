const mongoose = require('mongoose');

const officialSourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    descriptionHi: { type: String, default: '' },
    lastVerified: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

officialSourceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('OfficialSource', officialSourceSchema);
