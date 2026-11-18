const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestKey: { type: String, required: true },
    recipient: { fullName: String, phone: String, address: String },
    items: [
      {
        _id: false,
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true },
);
schema.index({ user: 1, requestKey: 1 }, { unique: true });
schema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Order', schema);
