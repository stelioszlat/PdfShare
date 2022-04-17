const express = require('express');

const editController = require('../controllers/edit-controller');

const router = express.Router();

// /api/metadata
router.get('/edits/:fid', editController.getEditsByFileId);
router.post('/edit/:fid', editController.editByFileId);
router.get('/editors/:fid', editController.getEditorsByFileId);


module.exports = router;