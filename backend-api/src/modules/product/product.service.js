const Product = require('./product.model');
const v = require('../../shared/validation');
const { ApiError } = require('../../shared/errors');
function productData(body) {
  const data = {
    name: v.text(body.name, 'Tên sản phẩm'),
    brand: v.text(body.brand, 'Hãng'),
    image: v.url(body.image),
    description: typeof body.description === 'string' ? body.description.slice(0, 10000) : '',
    price: body.price,
    stock: body.stock,
    status: body.status || 'ACTIVE',
  };
  if (
    !Number.isSafeInteger(data.price) ||
    data.price < 0 ||
    !Number.isSafeInteger(data.stock) ||
    data.stock < 0 ||
    !['ACTIVE', 'HIDDEN'].includes(data.status)
  )
    throw new ApiError(400, 'Giá, tồn kho hoặc trạng thái không hợp lệ.');
  if (!Array.isArray(body.specs) || body.specs.length > 50)
    throw new ApiError(400, 'Thông số cần là danh sách tối đa 50 mục.');
  if (body.specs.some((s) => !s || typeof s !== 'object' || Array.isArray(s))) {
    throw new ApiError(400, 'Thông số kỹ thuật không hợp lệ.');
  }
  data.specs = body.specs.map((s) => ({
    key: v.text(s.key, 'Tên thông số'),
    value: v.text(s.value, 'Giá trị thông số', 500),
  }));
  return data;
}
async function list(query, isAdmin = false) {
  const filter = { status: isAdmin ? { $ne: 'DELETED' } : 'ACTIVE' };
  if (typeof query.search === 'string' && query.search.trim()) {
    const term = query.search
      .trim()
      .slice(0, 100)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = ['name', 'brand', 'description'].map((key) => ({
      [key]: { $regex: term, $options: 'i' },
    }));
  }
  return Product.find(filter).sort({ createdAt: -1 });
}
async function detail(id, isAdmin = false) {
  const product = await Product.findOne({
    _id: id,
    status: isAdmin ? { $ne: 'DELETED' } : 'ACTIVE',
  });
  if (!product) throw new ApiError(404, 'Không tìm thấy sản phẩm.');
  return product;
}
async function create(body) {
  return Product.create(productData(body));
}
async function update(id, body) {
  const product = await Product.findOneAndUpdate(
    { _id: id, status: { $ne: 'DELETED' } },
    { $set: productData(body) },
    { returnDocument: 'after', runValidators: true },
  );
  if (!product) throw new ApiError(404, 'Không tìm thấy sản phẩm.');
  return product;
}
async function remove(id) {
  const product = await Product.findOneAndUpdate(
    { _id: id, status: { $ne: 'DELETED' } },
    { status: 'DELETED' },
  );
  if (!product) throw new ApiError(404, 'Không tìm thấy sản phẩm.');
}
module.exports = { list, detail, create, update, remove, productData };
