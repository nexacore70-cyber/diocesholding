const express = require("express");
const router = express.Router();

const {
  createNewConversation,
  getConversations,
  getConversation,
  removeConversation,
} = require("../controllers/conversationController");

const { protect } = require("../middleware/authMiddleware");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Conversation routes are working.",
  });
});

// ======================================
// All Authenticated Users
// ======================================

// Create Conversation
router.post("/", protect, createNewConversation);

// Get My Conversations
router.get("/", protect, getConversations);

// Get Conversation By ID
router.get("/:id", protect, getConversation);

// Delete Conversation
router.delete("/:id", protect, removeConversation);

module.exports = router;
