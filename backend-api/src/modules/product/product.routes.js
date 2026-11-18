const router = require('express').Router();
const c = require('./product.controller');
router.get('/', c.list);
router.get('/:id', c.detail);
module.exports = router;
