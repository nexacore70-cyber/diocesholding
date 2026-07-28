const express = require("express");

const {
  addReview,
  editReview,
  removeReview,
  restoreDeletedReview,
  getReviewsByCourse,
  getMyReviewList,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Student Routes
// ======================================

// Create Review
router.post("/", protect, authorize("student"), addReview);

// Get My Reviews
router.get("/my-reviews", protect, authorize("student"), getMyReviewList);

// Update Review
router.patch("/:id", protect, authorize("student"), editReview);

// Soft Delete Review
router.delete("/:id", protect, authorize("student"), removeReview);

// ======================================
// Admin Routes
// ======================================

// Restore Review
router.patch("/restore/:id", protect, authorize("admin"), restoreDeletedReview);

// ======================================
// Public Routes
// ======================================

// Get Course Reviews
router.get("/course/:courseId", getReviewsByCourse);

module.exports = router;
