const router = require('express').Router();
const c = require('./order.controller');
router.use(require('../../middleware/auth').authenticate);
router.get('/', c.list);
router.get('/:id', c.detail);
router.post('/', c.place);
module.exports = router;
