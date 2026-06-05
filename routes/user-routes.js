const Router = require('express');

const user = require('../controllers/user-controller');
const { authenticate, isAdmin, isSelf, isSelfOrAdmin, userExists } = require('../util/auth-util');

const router = Router();

// /api/auth/user
router.get('/all', authenticate, isAdmin, user.getUsers);
router.post('', authenticate, isAdmin, userExists, user.createUser);
router.get('/:uid', authenticate, isSelf, user.getUserById);
router.put('/:uid', authenticate, isSelfOrAdmin, user.updateUserById);
router.delete('/:uid', authenticate, isAdmin, user.deleteUserById);

module.exports = router;