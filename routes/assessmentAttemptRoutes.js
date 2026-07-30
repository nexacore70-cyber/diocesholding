const express = require("express");
const router = express.Router();

const {
  startStudentAssessment,
  submitStudentAssessment,
} = require("../controllers/assessmentAttemptController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assessment Attempt routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// Start Assessment
router.post(
  "/:assessmentId/start",
  protect,
  authorize("student"),
  startStudentAssessment,
);

// Submit Assessment
router.post(
  "/:attemptId/submit",
  protect,
  authorize("student"),
  submitStudentAssessment,
);

module.exports = router;
