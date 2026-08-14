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
// GET /api/messages/test
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Message routes are working.",
  });
});

// ======================================
// Conversation Messages
// ======================================

// Get Conversation Messages
// GET /api/messages/:conversationId
router.get("/:conversationId", protect, getMessages);

// Send Message
// POST /api/messages/:conversationId
router.post("/:conversationId", protect, sendNewMessage);

// ======================================
// Individual Message Actions
// ======================================

// Edit Message
// PATCH /api/messages/:id
router.patch("/:id", protect, updateMessage);

// React To Message
// PATCH /api/messages/:id/react
router.patch("/:id/react", protect, reactMessage);

// Pin / Unpin Message
// PATCH /api/messages/:id/pin
router.patch("/:id/pin", protect, pinMessage);

// Mark Message as Delivered
// PATCH /api/messages/:id/delivered
router.patch("/:id/delivered", protect, deliverMessage);

// Mark Message as Read
// PATCH /api/messages/:id/read
router.patch("/:id/read", protect, readMessage);

// Delete Message For Me
// DELETE /api/messages/:id/me
router.delete("/:id/me", protect, removeMessageForMe);

// Delete Message For Everyone
// DELETE /api/messages/:id/everyone
router.delete("/:id/everyone", protect, removeMessageForEveryone);

// ======================================
// Forward Message
// ======================================

// POST /api/messages/:id/forward/:conversationId
router.post("/:id/forward/:conversationId", protect, forwardExistingMessage);

module.exports = router;
