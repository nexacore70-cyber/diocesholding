const express = require("express");

const router = express.Router();

const {
  createNewQuiz,
  getQuizzes,
  getQuiz,
  updateExistingQuiz,
  publishExistingQuiz,
  archiveExistingQuiz,
  deleteExistingQuiz,
  restoreExistingQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Quiz routes are working.",
  });
});

// ======================================
// Public
// ======================================

router.get("/", getQuizzes);

router.get("/:id", getQuiz);

// ======================================
// Tutor/Admin
// ======================================

router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewQuiz,
);

router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingQuiz,
);

router.patch(
  "/:id/publish",
  protect,
  authorize("tutor", "admin"),
  publishExistingQuiz,
);

router.patch(
  "/:id/archive",
  protect,
  authorize("tutor", "admin"),
  archiveExistingQuiz,
);

router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingQuiz,
);

router.patch(
  "/restore/:id",
  protect,
  authorize("tutor", "admin"),
  restoreExistingQuiz,
);

module.exports = router;