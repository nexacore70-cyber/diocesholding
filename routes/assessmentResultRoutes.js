const express = require("express");

const router = express.Router();

const {
  getStudentResult,
  getStudentHistory,
  getAllAssessmentAttempts,
  getAssessmentAttemptDetails,
} = require("../controllers/assessmentResultController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ======================================
// Test
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Assessment Result routes are working.",
  });
});

// ======================================
// Student
// ======================================

// Single result
router.get(
  "/attempt/:attemptId",
  protect,
  authorize("student"),
  getStudentResult,
);

// Assessment history
router.get(
  "/assessment/:assessmentId",
  protect,
  authorize("student"),
  getStudentHistory,
);

// ======================================
// Tutor/Admin
// ======================================

// All attempts for assessment
router.get(
  "/assessment/:assessmentId/attempts",
  protect,
  authorize("tutor", "admin"),
  getAllAssessmentAttempts,
);

// Full attempt details
router.get(
  "/attempt/:attemptId/details",
  protect,
  authorize("tutor", "admin"),
  getAssessmentAttemptDetails,
);

module.exports = router;