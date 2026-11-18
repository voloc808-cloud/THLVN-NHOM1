const s = require('./order.service');
exports.place = async (req, res) =>
  res.status(201).json(await s.place(req.user._id, req.body, req.headers['idempotency-key']));
exports.list = async (req, res) => res.json(await s.list(req.user._id));
exports.detail = async (req, res) => res.json(await s.detail(req.params.id, req.user._id));
exports.adminList = async (req, res) => res.json(await s.list(null, true));
exports.adminDetail = async (req, res) => res.json(await s.detail(req.params.id, null, true));
exports.status = async (req, res) => res.json(await s.updateStatus(req.params.id, req.body.status));
