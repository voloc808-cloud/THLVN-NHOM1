const Notification = require('./notification.model');
const { ApiError } = require('../../shared/errors');
exports.list = (user) => Notification.find({ user }).sort({ createdAt: -1 });
exports.read = async (user, id) => {
  const item = await Notification.findOneAndUpdate(
    { _id: id, user },
    { read: true },
    { returnDocument: 'after' },
  );
  if (!item) throw new ApiError(404, 'Không tìm thấy thông báo.');
  return item;
};
