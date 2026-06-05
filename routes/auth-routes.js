const Router = require('express');

const tokenRoutes = require('./token-routes');
const userRoutes = require('./user-routes');
const authController = require('../controllers/auth-controller');
const { userExists } = require('../util/auth-util');

const router = Router();

// /api/auth
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset', authController.reset);
router.post('/register', userExists, authController.register);
router.use('/token', tokenRoutes);
router.use('/user', userRoutes);

module.exports = router;