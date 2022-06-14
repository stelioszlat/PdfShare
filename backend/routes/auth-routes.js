const express = require('express');

const tokenRoutes = require('./token-routes');
const authController = require('../controllers/auth-controller');
const { userExists } = require('../util/auth-util');

const router = express.Router();

// /api/auth
router.post('/login', authController.login);
router.post('/register', userExists, authController.register);
router.use(tokenRoutes);

module.exports = router;