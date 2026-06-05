const { Router } = require("express");

const meta = require("../controllers/meta-controller");
// const metaValidation = require('../validation/metadataValidation');
const { authenticate, isSelf } = require('../util/auth-util');

const router = Router();

// /api/metadata
router.post("/file/new", meta.addMetadata);
router.get("/files", meta.getMetadata);
router.get("/files/user/:uid", authenticate, isSelf, meta.getMetadataByUserId);
router.get("/file/:fid", meta.hasValidId, meta.getMetadataById);
router.delete('/file/:fid', meta.hasValidId, meta.deleteMetadataById);

module.exports = router;