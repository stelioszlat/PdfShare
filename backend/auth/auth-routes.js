const Router = require('express');

const tokenRoutes = require('./token-routes');
const authController = require('./auth-controller');

const router = Router();

// /api/auth
router.post('/login', authController.login);
router.post('/register', authController.register);
router.use(tokenRoutes);

module.exports = router;