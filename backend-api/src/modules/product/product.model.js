const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    specs: [{ _id: false, key: String, value: String }],
    stock: { type: Number, default: 0, min: 0, validate: Number.isSafeInteger },
    status: { type: String, enum: ['ACTIVE', 'HIDDEN', 'DELETED'], default: 'ACTIVE' },
  },
  { timestamps: true },
);
module.exports = mongoose.model('Product', schema);
