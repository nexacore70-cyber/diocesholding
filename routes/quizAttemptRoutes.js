const express = require("express");

const {
  startQuizAttempt,
  submitQuizAttempt,
  getSingleQuizAttempt,
  getMyQuizAttempts,
} = require("../controllers/quizAttemptController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Test Route
// ======================================

router.get(
  "/test",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "Quiz Attempt routes are working.",
    });
  },
);

// ======================================
// Student Routes
// ======================================

// ======================================
// Get My Quiz Attempts
// GET /api/quiz-attempts
// ======================================

router.get(
  "/",
  protect,
  authorize("student"),
  getMyQuizAttempts,
);

// ======================================
// Start Quiz
// POST /api/quiz-attempts/quizzes/:quizId/start
// ======================================

router.post(
  "/quizzes/:quizId/start",
  protect,
  authorize("student"),
  startQuizAttempt,
);

// ======================================
// Get Single Attempt
// GET /api/quiz-attempts/:attemptId
// ======================================

router.get(
  "/:attemptId",
  protect,
  authorize("student"),
  getSingleQuizAttempt,
);

// ======================================
// Submit Quiz
// POST /api/quiz-attempts/:attemptId/submit
// ======================================

router.post(
  "/:attemptId/submit",
  protect,
  authorize("student"),
  submitQuizAttempt,
);

// ======================================
// Export
// ======================================

module.exports = router;