// Chỉ nhập điện thoại từ JSON cũ; không thay đổi users hoặc orders cũ.
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { getEnv } = require('../src/config/env');
const Product = require('../src/modules/product/product.model');
async function main() {
  const source = JSON.parse(
    fs
      .readFileSync(path.resolve(__dirname, '../../mongdb/products.json'), 'utf8')
      .replace(/^\uFEFF/, ''),
  );
  const phones = source.filter((p) => p.categoryId === 1);
  if (!phones.length) throw new Error('Không tìm thấy điện thoại categoryId=1 trong JSON.');
  await mongoose.connect(getEnv().mongoUri);
  let created = 0;
  for (const p of phones) {
    const name = p.productName;
    const brand = /iphone/i.test(name) ? 'Apple' : name.split(' ')[0];
    const result = await Product.updateOne(
      { name },
      {
        $setOnInsert: {
          name,
          brand,
          price: p.price,
          stock: p.stockQuantity,
          description: p.description || '',
          image: /^https?:\/\//.test(p.imageUrl || '') ? p.imageUrl : '',
          specs: [],
          status: p.isActive ? 'ACTIVE' : 'HIDDEN',
        },
      },
      { upsert: true, runValidators: true },
    );
    created += result.upsertedCount;
  }
  console.log('Đã thêm ' + created + ' điện thoại. Sản phẩm cùng tên đã có được giữ nguyên.');
}
main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
