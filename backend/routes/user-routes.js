const express = require('express');

const User = require('../models/user');
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');
const validate = require('../validation/userValidation');

const authenticate = authController.authenticate;
const router = express.Router();

// /api/users
router.get('/all', authenticate, userController.getUsers);
router.post('/user/new', authenticate, userController.createUser);
router.get('/user/:uid', authenticate, userController.getUserById);
router.put('/user/:uid', authenticate, userController.updateUserById);
router.delete('/user/:uid', authenticate, userController.deleteUserById);

module.exports = router;