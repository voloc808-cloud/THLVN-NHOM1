const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    isLocked: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true },
);
module.exports = mongoose.model('User', schema);
