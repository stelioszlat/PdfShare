const express = require("express");
const metaController = require("../controllers/meta-controller");

const router = express.Router();

router.post("/new", metaController.addMetadata);
router.get("/files", metaController.getMetadata);
router.get("/file/:fid", metaController.getMetadataById);

module.exports = router;