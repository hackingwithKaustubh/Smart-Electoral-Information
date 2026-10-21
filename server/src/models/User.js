const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const LANGUAGES = ['en', 'hi'];
const ROLES = ['user', 'admin'];
const STATUSES = ['active', 'suspended'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    preferredLanguage: { type: String, enum: LANGUAGES, default: 'en' },
    role: { type: String, enum: ROLES, default: 'user' },
    status: { type: String, enum: STATUSES, default: 'active' },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, createdAt: -1 });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    preferredLanguage: this.preferredLanguage,
    role: this.role,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
module.exports.LANGUAGES = LANGUAGES;
module.exports.ROLES = ROLES;
