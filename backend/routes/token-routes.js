const express = require('express');

const { userExists, userHasToken } = require('../util/auth-util');
const authenticate = require('../controllers/auth-controller');
const tokenController = require('../controllers/token-controller');

const router = express.Router();

// /api/auth
router.post('/token/:uid/new', tokenController.getTokenByUserId);
router.get('/token/:uid', tokenController.getTokenByUserId);
router.get('/token/:uid/expires', tokenController.getTokenExpiryByUserId);
router.post('/token/:uid/refresh', tokenController.refreshTokenByUserId);

module.exports = router;