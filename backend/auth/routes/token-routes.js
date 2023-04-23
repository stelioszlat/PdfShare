const Router = require('express');

const tokenController = require('../controllers/token-controller');
const { isAdmin, isSelf, isSelfOrAdmin, authenticate } = require('../util/util');

const router = Router();

// /api/auth/token
router.get('/all',  authenticate, isAdmin, tokenController.getTokens);
router.post('/:uid',  authenticate, isSelfOrAdmin, tokenController.createTokenByUserId);
router.get('/:uid',  authenticate, isSelf, tokenController.getTokenByUserId);

module.exports = router;