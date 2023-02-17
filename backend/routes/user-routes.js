const Router = require('express');

const user = require('../controllers/user-controller');

const router = Router();

// /api/auth/user
router.get('/all', user.getUsers);
router.post('', user.createUser);
router.get('/:uid', user.getUserById);
router.put('/:uid', user.updateUserById);
router.delete('/:uid', user.deleteUserById);

module.exports = router;