const express = require("express");

const {
  createNewConversation,
  getConversations,
  getConversation,
  removeConversation,
} = require("../controllers/conversationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// Test Route
// GET /api/conversations/test
// Public
// ======================================
router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Conversation routes are working.",
  });
});

// ======================================
// Protected Conversation Routes
// ======================================

// ======================================
// Create Conversation
// POST /api/conversations
// Authenticated
// ======================================
router.post("/", protect, createNewConversation);

// ======================================
// Get My Conversations
// GET /api/conversations
// Authenticated
// ======================================
router.get("/", protect, getConversations);

// ======================================
// Get Conversation By ID
// GET /api/conversations/:id
// Authenticated + Membership checked
// ======================================
router.get("/:id", protect, getConversation);

// ======================================
// Delete Conversation
// DELETE /api/conversations/:id
// Authenticated + Owner only
// ======================================
router.delete("/:id", protect, removeConversation);

module.exports = router;