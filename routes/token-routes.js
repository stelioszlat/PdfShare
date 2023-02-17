const Router = require('express');

const tokenController = require('../controllers/token-controller');
const { isAdmin, isSelf } = require('../util/util');

const router = Router();

// /api/auth/token
router.get('/all', isAdmin, tokenController.getTokens);
router.post('/:uid', isSelf, tokenController.createTokenByUserId);
router.get('/:uid', isSelf, tokenController.getTokenByUserId);

module.exports = router;