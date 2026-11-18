const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const v = require('../../shared/validation');
const { ApiError } = require('../../shared/errors');
const { getEnv } = require('../../config/env');
function publicUser(user) {
  const { _id, fullName, email, phone, address, avatar, role, isLocked } = user;
  return { _id, fullName, email, phone, address, avatar, role, isLocked };
}
async function register(body) {
  const data = {
    fullName: v.text(body.fullName, 'Họ tên'),
    email: v.email(body.email),
    phone: v.phone(body.phone),
    address: v.text(body.address, 'Địa chỉ', 500),
  };
  data.password = await bcrypt.hash(v.password(body.password), 12);
  return publicUser(await User.create(data));
}
async function login(body) {
  const email = v.email(body.email);
  if (typeof body.password !== 'string') throw new ApiError(400, 'Vui lòng nhập mật khẩu.');
  const user = await User.findOne({ email }).select('+password +tokenVersion');
  if (!user || !(await bcrypt.compare(body.password, user.password)))
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng.');
  if (user.isLocked) throw new ApiError(403, 'Tài khoản đã bị khóa.');
  const token = jwt.sign(
    { sub: String(user._id), version: user.tokenVersion },
    getEnv().jwtSecret,
    { expiresIn: '1d', algorithm: 'HS256' },
  );
  return { token, user: publicUser(user) };
}
async function logout(id) {
  await User.updateOne({ _id: id }, { $inc: { tokenVersion: 1 } });
}
module.exports = { register, login, logout, publicUser };
