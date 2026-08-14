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
    message:
      "Assessment Question routes are working.",
  });
});

// ======================================
// Authenticated
// ======================================

router.get(
  "/",
  protect,
  getAssessmentQuestionList,
);

router.get(
  "/assessment/:assessmentId",
  protect,
  getQuestionsForAssessment,
);

router.get(
  "/:id",
  protect,
  getAssessmentQuestion,
);

// ======================================
// Tutor / Admin
// ======================================

router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewAssessmentQuestion,
);

router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingAssessmentQuestion,
);

router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingAssessmentQuestion,
);

module.exports = router;