const s = require('./product.service');
exports.list = async (req, res) => res.json(await s.list(req.query));
exports.adminList = async (req, res) => res.json(await s.list(req.query, true));
exports.detail = async (req, res) => res.json(await s.detail(req.params.id));
exports.create = async (req, res) => res.status(201).json(await s.create(req.body));
exports.update = async (req, res) => res.json(await s.update(req.params.id, req.body));
exports.remove = async (req, res) => {
  await s.remove(req.params.id);
  res.sendStatus(204);
};
