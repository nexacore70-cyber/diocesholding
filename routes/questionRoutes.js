const express = require("express");

const router = express.Router();

const {
  createNewQuestion,
  getQuizQuestions,
  getQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
  publishExistingQuestion,
  unpublishExistingQuestion,
} = require("../controllers/questionController");

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
    message: "Question routes are working.",
  });
});

// ======================================
// Tutor/Admin
// ======================================

router.get(
  "/quiz/:quizId",
  protect,
  authorize("tutor", "admin"),
  getQuizQuestions,
);

router.get(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  getQuestion,
);

router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewQuestion,
);

router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingQuestion,
);

router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingQuestion,
);

router.patch(
  "/:id/publish",
  protect,
  authorize("tutor", "admin"),
  publishExistingQuestion,
);

router.patch(
  "/:id/unpublish",
  protect,
  authorize("tutor", "admin"),
  unpublishExistingQuestion,
);

module.exports = router;