const { Router } = require("express");
const loggingController = require('../controllers/logging-controller');

const router = Router();

// /api/logging
router.get("/logs", loggingController.getLogs);

module.exports = router;