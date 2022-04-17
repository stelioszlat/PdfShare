const { body, validationResult } = require('express-validator');
const User = require('../models/user');

let validators = [];

validators.push((req, res, next) => {
    body('username').notEmpty().trim();
});

validators.push((req, res, next) => {
    body('password').notEmpty().isStrongPassword().trim();
});

validators.push((req, res, next) => {
    body('verifyPassword').notEmpty().trim();
});

validators.push((req, res, next) => {
    body('email').isEmail();
});

exports.validate = validators;