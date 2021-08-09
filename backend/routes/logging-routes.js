const express = require("express");
const loggingController = require('../controllers/logging-controller');

const router = express.Router();

router.post("/logs", loggingController.createLog);
router.get("/logs", loggingController.getLogs);
router.get("/logs/:from", loggingController.getLogsFrom);
router.get("/logs/:from/:to", loggingController.getLogsFromTo);
router.get("/logs/user/:uid", loggingController.getLogsByUser);

module.exports = router;