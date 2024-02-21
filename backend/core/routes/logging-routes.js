const { Router } = require("express");
const { authenticate } = require("../util/auth-util.js")
const loggingController = require('../controllers/logging-controller.js');

const router = Router();

// /api/logging
router.get("/logs", authenticate, loggingController.getLogs);

module.exports = router;