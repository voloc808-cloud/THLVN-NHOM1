const service = require('./auth.service');
exports.register = async (req, res) => res.status(201).json(await service.register(req.body));
exports.login = async (req, res) => res.json(await service.login(req.body));
exports.logout = async (req, res) => {
  await service.logout(req.user._id);
  res.sendStatus(204);
};
exports.me = (req, res) => res.json(service.publicUser(req.user));
