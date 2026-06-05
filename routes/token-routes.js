const Router = require('express');

const tokenController = require('../controllers/token-controller');
const { authenticate, isAdmin, isSelf, isSelfOrAdmin } = require('../util/auth-util');

const router = Router();

// /api/auth/token
router.get('/all',  authenticate, isAdmin, tokenController.getTokens);
router.post('/:uid',  authenticate, isSelfOrAdmin, tokenController.createTokenByUserId);
router.get('/:uid',  authenticate, isSelf, tokenController.getTokenByUserId);

module.exports = router;
