const express = require('express');
const metaController = require('../controllers/meta-controller');

const router = express.Router();

router.post('/metadata', metaController.addMetadata);