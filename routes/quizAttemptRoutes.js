const express = require("express");
const router = express.Router();

const {
  startQuizAttempt,
  submitQuizAttempt,
} = require("../controllers/quizAttemptController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Quiz Attempt routes are working.",
  });
});

// Start Quiz
router.post(
  "/quizzes/:quizId/start",
  protect,
  authorize("student"),
  startQuizAttempt,
);

router.post(
  "/:attemptId/submit",
  protect,
  authorize("student"),
  submitQuizAttempt,
);

module.exports = router;
