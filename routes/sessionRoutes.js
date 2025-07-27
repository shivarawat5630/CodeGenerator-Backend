const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createSession, getSessions, getSessionById } = require("../controllers/sessionController");

const router = express.Router();

router.post("/", protect, createSession);        // Create new session
router.get("/", protect, getSessions);           // Get all user sessions
router.get("/:id", protect, getSessionById);     // Get specific session

module.exports = router;
