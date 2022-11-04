const { Router } = require("express");
const loggingController = require('../controllers/logging-controller');

const router = Router();

// /api/logging
router.post("/log", loggingController.createLog);
router.get("/logs", loggingController.getLogs);

module.exports = router;