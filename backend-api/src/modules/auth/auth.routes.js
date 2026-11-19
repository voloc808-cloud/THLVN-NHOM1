const router = require('express').Router();
const controller = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
router.post('/logout', authenticate, controller.logout);
module.exports = router;
