const s = require('./user.service');
exports.update = async (req, res) => res.json(await s.update(req.user._id, req.body));
exports.password = async (req, res) => {
  await s.changePassword(req.user._id, req.body);
  res.sendStatus(204);
};
exports.list = async (req, res) => res.json(await s.list());
exports.detail = async (req, res) => res.json(await s.detail(req.params.id));
exports.lock = async (req, res) => res.json(await s.lock(req.params.id, req.body.isLocked));
