const express = require("express");

const {
  addReview,
  editReview,
  removeReview,
  getReviewsByCourse,
  getMyReviewList,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Student: Create Review
// POST /api/reviews
// ======================================
router.post(
  "/",
  protect,
  authorize("student"),
  addReview
);

// ======================================
// Student: Get My Reviews
// GET /api/reviews/my-reviews
// ======================================
router.get(
  "/my-reviews",
  protect,
  authorize("student"),
  getMyReviewList
);

// ======================================
// Public: Get Course Reviews
// GET /api/reviews/course/:courseId
// ======================================
router.get(
  "/course/:courseId",
  getReviewsByCourse
);

// ======================================
// Student: Update Review
// PATCH /api/reviews/:id
// ======================================
router.patch(
  "/:id",
  protect,
  authorize("student"),
  editReview
);

// ======================================
// Student: Delete Review
// DELETE /api/reviews/:id
// ======================================
router.delete(
  "/:id",
  protect,
  authorize("student"),
  removeReview
);

module.exports = router;