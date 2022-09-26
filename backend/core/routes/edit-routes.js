const { Router } = require('express');

const editController = require('../controllers/edit-controller');
const { hasValidId } = require('../controllers/meta-controller');

const router = Router();

// /api/metadata
router.get('/edits/:fid', hasValidId, editController.getEditsByFileId);
router.post('/edit/:fid', hasValidId, editController.editByFileId);
router.get('/editors/:fid', hasValidId, editController.getEditorsByFileId);


module.exports =  router;