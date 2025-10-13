const { Router } = require('express');

const { searchIndex } = require('../util/elastic-util');
const { authenticate } = require('../util/auth-util'); 
const { search } = require('../controllers/search-controller');

const router = Router();

// /api/search
router.get('', search);

module.exports = router;