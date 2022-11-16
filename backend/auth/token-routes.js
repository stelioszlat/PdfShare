const Router = require('express');

const tokenController = require('./token-controller');

const router = Router();

// /api/auth
router.post('/:uid', tokenController.getTokenByUserId);
router.get('/:uid', tokenController.getTokenByUserId);

module.exports = router;