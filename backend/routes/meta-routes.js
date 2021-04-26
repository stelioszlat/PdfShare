const express = require('express');
const metaController = require('../controllers/meta-controller');
const {check} = require('express-validator');

const router = express.Router();

router.post('/new',
    // [
    //     check('fileName').notEmpty(),
    //     check('uploader').notEmpty(),
    //     check('keywords').isArray(),
    // ],
    metaController.addMetadata);


// router.patch('/edit', metaController.updateMetadata);

module.exports = router;