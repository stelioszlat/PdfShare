const { Router } = require("express");

const meta = require("../controllers/meta-controller");
// const metaValidation = require('../validation/metadataValidation');
const { authenticate } = require('../util/auth-util');
const { createIndex, deleteIndex } = require('../util/elastic-util');

const router = Router();

// /api/metadata
router.post("/file/new", authenticate, meta.addMetadata);
router.get("/files", authenticate, meta.getMetadata);
router.get("/files/user/:uid", authenticate, meta.getMetadataByUserId);
router.get("/file/:fid", authenticate, meta.hasValidId, meta.getMetadataById);
router.delete('/file/:fid', authenticate, meta.hasValidId, meta.deleteMetadataById);

module.exports = router;