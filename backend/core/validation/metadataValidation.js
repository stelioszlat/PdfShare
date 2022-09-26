const { body, validationResult } = require('express-validator');
// import Metadata from '../models/metadata';

let validators = [];

validators.push((req, res, next) => {
    body('fileName').notEmpty().trim();
});

validators.push((req, res, next) => {
    body('uploader').notEmpty().trim();
});

validators.push((req, res, next) => {
    body('keywords').isArray();
})

module.exports = validators;