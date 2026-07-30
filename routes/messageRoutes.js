const express = require("express");
const router = express.Router();

const {
  sendNewMessage,
  getMessages,
  updateMessage,
  removeMessageForMe,
  removeMessageForEveryone,
  reactMessage,
  pinMessage,
  deliverMessage,
  readMessage,
  forwardExistingMessage,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Message routes are working.",
  });
});

// ======================================
// Send Message
// ======================================
router.post("/:conversationId", protect, sendNewMessage);

// ======================================
// Get Conversation Messages
// ======================================
router.get("/:conversationId", protect, getMessages);

// ======================================
// Edit Message
// ======================================
router.patch("/:id", protect, updateMessage);

// ======================================
// Delete For Me
// ======================================
router.delete("/:id/me", protect, removeMessageForMe);

// ======================================
// Delete For Everyone
// ======================================
router.delete("/:id/everyone", protect, removeMessageForEveryone);

// ======================================
// React To Message
// ======================================
router.patch("/:id/react", protect, reactMessage);

// ======================================
// Pin / Unpin Message
// ======================================
router.patch("/:id/pin", protect, pinMessage);

// ======================================
// Delivered
// ======================================
router.patch("/:id/delivered", protect, deliverMessage);

// ======================================
// Read
// ======================================
router.patch("/:id/read", protect, readMessage);

// ======================================
// Forward Message
// ======================================
router.post("/:id/forward/:conversationId", protect, forwardExistingMessage);

module.exports = router;
