const { ApiError } = require('../../shared/errors');
const labels = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};
const transitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};
function validateTransition(from, to) {
  if (!transitions[from]?.includes(to))
    throw new ApiError(409, 'Không thể chuyển sang trạng thái này.');
}
module.exports = { labels, validateTransition };
