const express = require("express");
const router = express.Router();

const {
  createNewQuestion,
  getQuestions,
  getQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
} = require("../controllers/questionController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Question routes are working.",
  });
});

// Get All Questions
router.get("/", getQuestions);

// Get Single Question
router.get("/:id", getQuestion);

// Create Question
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewQuestion
);

// Update Question
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingQuestion
);

// Delete Question
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingQuestion
);

module.exports = router;