const { Router } = require("express");

const meta = require("../controllers/meta-controller");
// const metaValidation = require('../validation/metadataValidation');
const { authenticate, isAdmin, isSelfOrAdmin, isOwnerOrAdmin } = require('../util/auth-util');

const router = Router();

// /api/metadata
router.post("/file", authenticate, meta.addMetadata);
router.get("/files", authenticate, isAdmin, meta.getMetadata);
router.get("/files/user/:uid", authenticate, isSelfOrAdmin, meta.getMetadataByUserId);
router.get("/file/:fid", meta.hasValidId, meta.getMetadataById);
router.delete('/file/:fid', authenticate, isOwnerOrAdmin, meta.hasValidId, meta.deleteMetadataById);

module.exports = router;