const express = require("express");

const meta = require("../controllers/meta-controller");
const editRoutes = require('../routes/edit-routes');

const router = express.Router();

// /api/metadata
router.post("/new", meta.addMetadata);
router.get("/files", meta.getMetadata);
router.get("/file/:fid", meta.hasValidId, meta.getMetadataById);
router.delete('/file/:fid', meta.hasValidId, meta.deleteMetadataById);
router.use(editRoutes);

module.exports = router;