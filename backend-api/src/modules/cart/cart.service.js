const Cart = require('./cart.model');
const Product = require('../product/product.model');
const { quantity } = require('../../shared/validation');
const { ApiError } = require('../../shared/errors');
async function get(user) {
  const cart = await Cart.findOne({ user }).populate('items.product');
  const items = (cart?.items || []).map((i) => ({
    productId: String(i.product?._id || ''),
    name: i.product?.name || 'Sản phẩm không còn tồn tại',
    image: i.product?.image || '',
    price: i.product?.price || 0,
    stock: i.product?.stock || 0,
    available: i.product?.status === 'ACTIVE',
    quantity: i.quantity,
  }));
  return { items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) };
}
async function change(user, productId, amount, add = false) {
  quantity(amount);
  const product = await Product.findOne({ _id: productId, status: 'ACTIVE' });
  if (!product) throw new ApiError(404, 'Sản phẩm không còn bán.');
  let cart = await Cart.findOne({ user });
  if (!cart) cart = new Cart({ user, items: [] });
  const item = cart.items.find((i) => String(i.product) === String(product._id));
  const nextQuantity = add ? (item?.quantity || 0) + amount : amount;
  quantity(nextQuantity);
  if (nextQuantity > product.stock) throw new ApiError(409, 'Số lượng vượt quá tồn kho.');
  if (item) item.quantity = nextQuantity;
  else cart.items.push({ product: product._id, quantity: nextQuantity });
  try {
    await cart.save();
  } catch (err) {
    if (err.name === 'VersionError' || err.code === 11000)
      throw new ApiError(409, 'Giỏ hàng vừa thay đổi, vui lòng tải lại.');
    throw err;
  }
  return get(user);
}
async function remove(user, productId) {
  await Cart.updateOne({ user }, { $pull: { items: { product: productId } }, $inc: { __v: 1 } });
  return get(user);
}
module.exports = { get, change, remove };
