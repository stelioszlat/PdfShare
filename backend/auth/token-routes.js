const Router = require('express');

const tokenController = require('./token-controller');

const router = Router();

// /api/auth
router.post('/token/:uid/new', tokenController.getTokenByUserId);
router.get('/token/:uid', tokenController.getTokenByUserId);
router.get('/token/:uid/expires', tokenController.getTokenExpiryByUserId);
router.post('/token/:uid/refresh', tokenController.refreshTokenByUserId);

module.exports = router;