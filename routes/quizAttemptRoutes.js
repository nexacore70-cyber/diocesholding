const express = require("express");
const router = express.Router();

const {
  startQuizAttempt,
  submitQuizAttempt,
} = require("../controllers/quizAttemptController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// GET /api/quiz-attempts/test
// ======================================
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quiz Attempt routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// Start Quiz
// POST /api/quiz-attempts/quizzes/:quizId/start
router.post(
  "/quizzes/:quizId/start",
  protect,
  authorize("student"),
  startQuizAttempt,
);

// Submit Quiz
// POST /api/quiz-attempts/:attemptId/submit
router.post(
  "/:attemptId/submit",
  protect,
  authorize("student"),
  submitQuizAttempt,
);

module.exports = router;
