const Product = require('../product/product.model');
const User = require('../user/user.model');
const Order = require('../order/order.model');
exports.dashboard = async () => {
  const [products, users, orders, revenue] = await Promise.all([
    Product.countDocuments({ status: { $ne: 'DELETED' } }),
    User.countDocuments({ role: 'USER' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: 'DELIVERED' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);
  return { products, users, orders, revenue: revenue[0]?.total || 0 };
};
