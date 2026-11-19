const mongoose = require('mongoose');
const Order = require('./order.model');
const Cart = require('../cart/cart.model');
const Product = require('../product/product.model');
const Notification = require('../notification/notification.model');
const { ApiError } = require('../../shared/errors');
const v = require('../../shared/validation');
const { labels, validateTransition } = require('./order.rules');
async function place(user, body, requestKey) {
  if (typeof requestKey !== 'string' || !/^[a-zA-Z0-9-]{16,100}$/.test(requestKey))
    throw new ApiError(400, 'Thiếu mã xác nhận đơn hàng.');
  const recipient = {
    fullName: v.text(body.fullName, 'Họ tên'),
    phone: v.phone(body.phone),
    address: v.text(body.address, 'Địa chỉ', 500),
  };
  if (body.paymentMethod !== 'COD') throw new ApiError(400, 'Hiện chỉ hỗ trợ thanh toán COD.');
  const previous = await Order.findOne({ user, requestKey });
  if (previous) return previous;
  try {
    return await mongoose.connection.transaction(async (session) => {
      const existing = await Order.findOne({ user, requestKey }).session(session);
      if (existing) return existing;
      const cart = await Cart.findOne({ user }).session(session);
      if (!cart?.items.length) throw new ApiError(400, 'Giỏ hàng đang trống.');
      const items = [];
      for (const item of cart.items) {
        v.quantity(item.quantity);
        const product = await Product.findOneAndUpdate(
          { _id: item.product, status: 'ACTIVE', stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session, returnDocument: 'after' },
        );
        if (!product)
          throw new ApiError(
            409,
            'Có sản phẩm ngừng bán hoặc không đủ tồn kho. Vui lòng kiểm tra giỏ hàng.',
          );
        items.push({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        });
      }
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (!Number.isSafeInteger(total))
        throw new ApiError(400, 'Tổng tiền vượt giới hạn cho phép.');
      const [order] = await Order.create(
        [{ user, requestKey, recipient, items, total, paymentMethod: 'COD' }],
        { session },
      );
      await Cart.updateOne(
        { _id: cart._id },
        { $set: { items: [] }, $inc: { __v: 1 } },
        { session },
      );
      await Notification.create(
        [{ user, order: order._id, message: 'Đặt hàng thành công. Đơn hàng đang chờ xác nhận.' }],
        { session },
      );
      return order;
    });
  } catch (err) {
    if (err.code === 11000) {
      const existing = await Order.findOne({ user, requestKey });
      if (existing) return existing;
    }
    throw err;
  }
}
function list(user, isAdmin = false) {
  return Order.find(isAdmin ? {} : { user }).sort({ createdAt: -1 });
}
async function detail(id, user, isAdmin = false) {
  const order = await Order.findOne({ _id: id, ...(isAdmin ? {} : { user }) });
  if (!order) throw new ApiError(404, 'Không tìm thấy đơn hàng.');
  return order;
}
async function updateStatus(id, status) {
  return mongoose.connection.transaction(async (session) => {
    const order = await Order.findById(id).session(session);
    if (!order) throw new ApiError(404, 'Không tìm thấy đơn hàng.');
    validateTransition(order.status, status);
    if (status === 'CANCELLED') {
      for (const item of order.items)
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session },
        );
    }
    order.status = status;
    await order.save({ session });
    await Notification.create(
      [{ user: order.user, order: order._id, message: `Đơn hàng: ${labels[status]}.` }],
      { session },
    );
    return order;
  });
}
module.exports = { place, list, detail, updateStatus };
