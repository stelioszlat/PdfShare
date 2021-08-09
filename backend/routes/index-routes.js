const express = require("express");
const indexController = require("../controllers/index-controller");

const router = express.Router();

router.get("/info", indexController.getInfo);
router.post("/add", indexController.addIndex);
router.post("/delete", indexController.deleteIndex);
router.post("/search", indexController.searchIndex);

module.exports = router;