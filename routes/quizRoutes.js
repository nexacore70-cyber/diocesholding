const express = require("express");
const router = express.Router();

const {
  createNewQuiz,
  getQuizzes,
  getQuiz,
  updateExistingQuiz,
  deleteExistingQuiz,
  restoreExistingQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Quiz routes are working.",
  });
});

// ======================================
// Public Routes
// ======================================

// Get All Quizzes
router.get("/", getQuizzes);

// Get Single Quiz
router.get("/:id", getQuiz);

// ======================================
// Tutor/Admin Routes
// ======================================

// Create Quiz
router.post("/", protect, authorize("tutor", "admin"), createNewQuiz);

// Update Quiz
router.put("/:id", protect, authorize("tutor", "admin"), updateExistingQuiz);

// Soft Delete Quiz
router.delete("/:id", protect, authorize("tutor", "admin"), deleteExistingQuiz);

// Restore Quiz
router.patch(
  "/restore/:id",
  protect,
  authorize("tutor", "admin"),
  restoreExistingQuiz,
);

module.exports = router;
