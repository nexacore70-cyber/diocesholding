const express = require("express");

const router = express.Router();

const {
  startStudentAssessment,
  submitStudentAssessment,
} = require("../controllers/assessmentAttemptController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Safety checks
// ======================================

if (typeof protect !== "function") {
  throw new TypeError(
    "assessmentAttemptRoutes: protect middleware is not a function.",
  );
}

if (typeof authorize !== "function") {
  throw new TypeError(
    "assessmentAttemptRoutes: authorize middleware is not a function.",
  );
}

if (typeof startStudentAssessment !== "function") {
  throw new TypeError(
    "assessmentAttemptRoutes: startStudentAssessment is not a function.",
  );
}

if (typeof submitStudentAssessment !== "function") {
  throw new TypeError(
    "assessmentAttemptRoutes: submitStudentAssessment is not a function.",
  );
}

// ======================================
// Test Route
// GET /api/assessment-attempts/test
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Assessment Attempt routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// Start Assessment
// POST /api/assessment-attempts/:assessmentId/start

router.post(
  "/:assessmentId/start",
  protect,
  authorize("student"),
  startStudentAssessment,
);

// ======================================
// Submit Assessment
// POST /api/assessment-attempts/:attemptId/submit
// ======================================

router.post(
  "/:attemptId/submit",
  protect,
  authorize("student"),
  submitStudentAssessment,
);

// ======================================
// Export
// ======================================

module.exports = router;