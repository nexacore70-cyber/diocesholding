const express = require("express");
const router = express.Router();

const {
  createNewAssessmentQuestion,
  getAssessmentQuestionList,
  getQuestionsForAssessment,
  getAssessmentQuestion,
  updateExistingAssessmentQuestion,
  deleteExistingAssessmentQuestion,
} = require("../controllers/assessmentQuestionController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assessment Question routes are working.",
  });
});

// ======================================
// Authenticated Routes
// ======================================

// Get All Questions
router.get("/", protect, getAssessmentQuestionList);

// Get Questions For Assessment
router.get("/assessment/:assessmentId", protect, getQuestionsForAssessment);

// Get Single Question
router.get("/:id", protect, getAssessmentQuestion);

// ======================================
// Tutor/Admin Routes
// ======================================

// Create Question
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewAssessmentQuestion,
);

// Update Question
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingAssessmentQuestion,
);

// Delete Question
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingAssessmentQuestion,
);

module.exports = router;
