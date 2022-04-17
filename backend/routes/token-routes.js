const express = require('express');

const { userExists, userHasToken } = require('../util/auth-util');
const tokenController = require('../controllers/token-controller');

const router = express.Router();

// /api/auth
// router.post('/token/:uid/new', userExists, userHasToken, tokenController.getTokenByUserId);
router.get('/token/:uid', tokenController.getTokenByUserId);
// router.get('/token/:uid/expires', tokenController.getTokenExpiryByUserId);
// router.post('/token/:uid/renewal', tokenController.renewTokenByUserId);

module.exports = router;