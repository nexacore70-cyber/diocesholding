const express = require("express");

const {
  startQuizAttempt,
  submitQuizAttempt,
  getSingleQuizAttempt,
  getMyQuizAttempts,
} = require("../controllers/quizAttemptController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Test
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Quiz Attempt routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// Get My Attempts
router.get(
  "/",
  protect,
  authorize("student"),
  getMyQuizAttempts,
);

// Start Quiz
router.post(
  "/quizzes/:quizId/start",
  protect,
  authorize("student"),
  startQuizAttempt,
);

// Get Single Attempt
router.get(
  "/:attemptId",
  protect,
  authorize("student"),
  getSingleQuizAttempt,
);

// Submit Quiz
router.post(
  "/:attemptId/submit",
  protect,
  authorize("student"),
  submitQuizAttempt,
);

module.exports = router;