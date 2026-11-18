const bcrypt = require('bcryptjs');
const User = require('./user.model');
const v = require('../../shared/validation');
const { ApiError } = require('../../shared/errors');
const { publicUser } = require('../auth/auth.service');
async function update(id, body) {
  const data = {
    fullName: v.text(body.fullName, 'Họ tên'),
    email: v.email(body.email),
    phone: v.phone(body.phone),
    address: v.text(body.address, 'Địa chỉ', 500),
    avatar: v.url(body.avatar),
  };
  return publicUser(
    await User.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: 'after', runValidators: true },
    ),
  );
}
async function changePassword(id, body) {
  const user = await User.findById(id).select('+password');
  if (
    typeof body.currentPassword !== 'string' ||
    !(await bcrypt.compare(body.currentPassword, user.password))
  )
    throw new ApiError(400, 'Mật khẩu hiện tại không đúng.');
  const password = await bcrypt.hash(v.password(body.newPassword), 12);
  await User.updateOne({ _id: id }, { $set: { password }, $inc: { tokenVersion: 1 } });
}
function list() {
  return User.find().sort({ createdAt: -1 });
}
async function detail(id) {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'Không tìm thấy tài khoản.');
  return publicUser(user);
}
async function lock(id, isLocked) {
  if (typeof isLocked !== 'boolean') throw new ApiError(400, 'Trạng thái khóa không hợp lệ.');
  const user = await User.findOneAndUpdate(
    { _id: id, role: 'USER' },
    { $set: { isLocked }, $inc: { tokenVersion: 1 } },
    { returnDocument: 'after' },
  );
  if (!user) throw new ApiError(400, 'Chỉ có thể khóa/mở khóa tài khoản User.');
  return publicUser(user);
}
module.exports = { update, changePassword, list, detail, lock };
