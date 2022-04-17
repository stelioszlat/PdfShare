const { body, validationResult } = require('express-validator');
const Metadata = require('../models/metadata');

let validators = [];

validators.push((req, res, next) => {
    body('fileName').notEmpty().trim();
});

validators.push((req, res, next) => {
    body('owner').notEmpty().trim();
});

validators.push((req, res, next) => {
    body('keywords').isArray();
})