const express = require("express");
const router = express.Router();

const {
  createNewQuiz,
  getQuizzes,
  getQuiz,
  updateExistingQuiz,
  deleteExistingQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Quiz routes are working.",
  });
});

// Get All Quizzes
router.get("/", getQuizzes);

// Get Single Quiz
router.get("/:id", getQuiz);

// Create Quiz
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewQuiz
);

// Update Quiz
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingQuiz
);

// Delete Quiz
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingQuiz
);

module.exports = router;