const express = require("express");
const metaController = require("../controllers/meta-controller");
const indexController = require("../controllers/index-controller");

const { authenticate } = require('../controllers/auth-controller');
const editRoutes = require('../routes/edit-routes');

const router = express.Router();

// /api/metadata
router.post("/new", /*indexController.addIndex,*/ metaController.addMetadata);
router.get("/files", metaController.getMetadata);
router.get("/file/:fid", metaController.getMetadataById);
router.put('/file/:fid', metaController.updateMetadataById);
router.delete('/file/:fid', metaController.deleteMetadataById);
router.use(editRoutes);

module.exports = router;