const s = require('./notification.service');
exports.list = async (req, res) => res.json(await s.list(req.user._id));
exports.read = async (req, res) => res.json(await s.read(req.user._id, req.params.id));
