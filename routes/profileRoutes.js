const express = require("express");

const router = express.Router();

// ======================================
// Controllers
// ======================================

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

// ======================================
// Middleware
// ======================================

const { protect } = require("../middleware/authMiddleware");

// ======================================
// Get Logged-In User Profile
// ======================================
// GET /api/profile/me
// Access: Private
// ======================================

router.get("/me", protect, getMyProfile);

// ======================================
// Update Logged-In User Profile
// ======================================
// PUT /api/profile/me
// Access: Private
// ======================================

router.put("/me", protect, updateMyProfile);

// ======================================
// Partially Update Logged-In User Profile
// ======================================
// PATCH /api/profile/me
// Access: Private
// ======================================

router.patch("/me", protect, updateMyProfile);

// ======================================
// Export
// ======================================

module.exports = router;
