const router = require('express').Router();
const c = require('./cart.controller');
router.use(require('../../middleware/auth').authenticate);
router.get('/', c.get);
router.post('/items', c.add);
router.patch('/items/:id', c.update);
router.delete('/items/:id', c.remove);
module.exports = router;
