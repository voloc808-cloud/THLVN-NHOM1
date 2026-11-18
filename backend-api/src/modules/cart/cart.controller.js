const s = require('./cart.service');
exports.get = async (req, res) => res.json(await s.get(req.user._id));
exports.add = async (req, res) =>
  res.json(await s.change(req.user._id, req.body.productId, req.body.quantity, true));
exports.update = async (req, res) =>
  res.json(await s.change(req.user._id, req.params.id, req.body.quantity));
exports.remove = async (req, res) => res.json(await s.remove(req.user._id, req.params.id));
