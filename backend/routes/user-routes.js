const express = require('express');

const auth = require('../controllers/auth-controller');
const user = require('../controllers/user-controller');
const validate = require('../validation/userValidation');

const authenticate = auth.authenticate;
const router = express.Router();

// /api/users
router.get('/all', authenticate, user.getUsers);
router.post('/user/new', authenticate, user.createUser);
router.get('/user/:uid', authenticate, user.getUserById);
router.put('/user/:uid', authenticate, user.updateUserById);
router.delete('/user/:uid', authenticate, user.deleteUserById);

module.exports = router;