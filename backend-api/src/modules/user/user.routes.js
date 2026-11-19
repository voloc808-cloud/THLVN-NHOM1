const router = require('express').Router();
const c = require('./user.controller');
router.use(require('../../middleware/auth').authenticate);
router.patch('/me', c.update);
router.patch('/me/password', c.password);
module.exports = router;
