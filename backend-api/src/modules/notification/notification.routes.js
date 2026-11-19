const router = require('express').Router();
const c = require('./notification.controller');
router.use(require('../../middleware/auth').authenticate);
router.get('/', c.list);
router.patch('/:id/read', c.read);
module.exports = router;
