exports.dashboard = async (req, res) => res.json(await require('./admin.service').dashboard());
