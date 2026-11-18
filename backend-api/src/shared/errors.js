class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.code === 11000) return res.status(409).json({ message: 'Dữ liệu đã tồn tại.' });
  if (
    err.name === 'ValidationError' ||
    err.name === 'CastError' ||
    err.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
  }
  if (!err.status) console.error(err.name, err.message);
  res
    .status(err.status || 500)
    .json({ message: err.status ? err.message : 'Không thể xử lý yêu cầu. Vui lòng thử lại.' });
}
module.exports = { ApiError, errorHandler };
