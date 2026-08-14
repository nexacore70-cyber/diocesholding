const express = require("express");

const router = express.Router();

const {
  createNewAssessment,
  getAssessments,
  getAssessment,
  getCourseAssessment,
  updateExistingAssessment,
  publishAssessmentNow,
  archiveAssessmentNow,
  removeAssessment,
} = require("../controllers/assessmentController");

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
    message: "Assessment routes are working.",
  });
});

// ======================================
// Authenticated
// ======================================

router.get(
  "/",
  protect,
  getAssessments,
);

router.get(
  "/course/:courseId",
  protect,
  getCourseAssessment,
);

router.get(
  "/:id",
  protect,
  getAssessment,
);

// ======================================
// Tutor / Admin
// ======================================

router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewAssessment,
);

router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingAssessment,
);

router.patch(
  "/:id/publish",
  protect,
  authorize("tutor", "admin"),
  publishAssessmentNow,
);

router.patch(
  "/:id/archive",
  protect,
  authorize("tutor", "admin"),
  archiveAssessmentNow,
);

router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  removeAssessment,
);

module.exports = router;