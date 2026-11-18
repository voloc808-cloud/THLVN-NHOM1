const { ApiError } = require('./errors');
function text(value, label, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max)
    throw new ApiError(400, `${label} không hợp lệ.`);
  return value.trim();
}
function email(value) {
  const result = text(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new ApiError(400, 'Email không hợp lệ.');
  return result;
}
function password(value) {
  if (typeof value !== 'string' || value.length < 8 || Buffer.byteLength(value, 'utf8') > 72)
    throw new ApiError(400, 'Mật khẩu cần ít nhất 8 ký tự và tối đa 72 byte.');
  return value;
}
function phone(value) {
  const result = text(value, 'Số điện thoại', 20).replace(/\s/g, '');
  if (!/^(0\d{9}|\+84\d{9})$/.test(result)) throw new ApiError(400, 'Số điện thoại không hợp lệ.');
  return result;
}
function quantity(value) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 999)
    throw new ApiError(400, 'Số lượng phải là số nguyên từ 1 đến 999.');
  return value;
}
function url(value) {
  if (!value) return '';
  const result = text(value, 'URL hình ảnh', 2000);
  try {
    if (!['http:', 'https:'].includes(new URL(result).protocol)) throw new Error();
  } catch {
    throw new ApiError(400, 'Hình ảnh cần URL http hoặc https.');
  }
  return result;
}
module.exports = { text, email, password, phone, quantity, url };
