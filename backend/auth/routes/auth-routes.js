const Router = require('express');

const tokenRoutes = require('./token-routes');
const authController = require('../controllers/auth-controller');
const { authenticate, isSelf, userExists } = require('../util/util');

const router = Router();

// /api/auth
router.post('/login', authController.login);
router.post('/logout', authenticate, isSelf, authController.logout);
router.post('/reset', authController.reset);
router.post('/register', userExists, authController.register);
router.use('/token', tokenRoutes);

module.exports = router;