const express = require("express");
const loggingController = require('../controllers/logging-controller');

const router = express.Router();

router.post("/log", loggingController.createLog);
router.get("/logs", loggingController.getLogs);
router.get("/logs/user/:uid", loggingController.getLogsByUser);

module.exports = router;