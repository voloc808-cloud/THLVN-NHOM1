const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');
const { getEnv } = require('../config/env');
const { ApiError } = require('../shared/errors');
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new ApiError(401, 'Vui lòng đăng nhập.');
  let payload;
  try {
    payload = jwt.verify(token, getEnv().jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new ApiError(401, 'Phiên đăng nhập đã hết hạn.');
  }
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || user.tokenVersion !== payload.version)
    throw new ApiError(401, 'Phiên đăng nhập không hợp lệ.');
  if (user.isLocked) throw new ApiError(403, 'Tài khoản đã bị khóa.');
  req.user = user;
  next();
}
function admin(req, res, next) {
  if (req.user.role !== 'ADMIN') throw new ApiError(403, 'Chỉ Admin được sử dụng chức năng này.');
  next();
}
module.exports = { authenticate, admin };
