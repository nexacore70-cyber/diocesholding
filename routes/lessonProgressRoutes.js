const express = require("express");

const {
  completeStudentLesson,
} = require("../controllers/lessonProgressController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Test Route
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Lesson Progress routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// --------------------------------------
// Complete Lesson
// POST /api/lesson-progress/:lessonId/complete
// --------------------------------------

router.post(
  "/:lessonId/complete",
  protect,
  authorize("student"),
  completeStudentLesson,
);

// ======================================
// Export
// ======================================

module.exports = router;