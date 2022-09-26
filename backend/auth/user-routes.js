const Router = require('express');

// import validate from '../src/validation/userValidation';
const user = require('./user-controller');

const router = Router();

// /api/users
router.get('/all', user.getUsers);
router.post('/user/new', user.createUser);
router.get('/user/:uid', user.getUserById);
router.put('/user/:uid', user.updateUserById);
router.delete('/user/:uid', user.deleteUserById);

module.exports = router;