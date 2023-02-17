const { body, validationResult } = require('express-validator');

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

module.exports = validators;