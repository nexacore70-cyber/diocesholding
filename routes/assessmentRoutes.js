const express = require("express");
const router = express.Router();

const {
  createNewAssessment,
  getAssessments,
  getAssessment,
  getCourseAssessment,
  updateExistingAssessment,
  publishAssessmentNow,
  removeAssessment,
} = require("../controllers/assessmentController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assessment routes are working.",
  });
});

// ======================================
// Authenticated Routes
// ======================================

// Get All Assessments
router.get("/", protect, getAssessments);

// Get Assessment By Course
router.get("/course/:courseId", protect, getCourseAssessment);

// Get Assessment By ID
router.get("/:id", protect, getAssessment);

// ======================================
// Tutor/Admin Routes
// ======================================

// Create Assessment
router.post("/", protect, authorize("tutor", "admin"), createNewAssessment);

// Update Assessment
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingAssessment,
);

// Publish Assessment
router.patch(
  "/:id/publish",
  protect,
  authorize("tutor", "admin"),
  publishAssessmentNow,
);

// Delete Assessment
router.delete("/:id", protect, authorize("tutor", "admin"), removeAssessment);

module.exports = router;
