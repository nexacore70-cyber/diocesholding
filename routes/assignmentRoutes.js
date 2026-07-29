const express = require("express");
const router = express.Router();

const {
  createNewAssignment,
  getAssignment,
  getAssignmentsByCourse,
  getLessonAssignments,
  updateAssignmentDetails,
  removeAssignment,
  publishAssignmentNow,
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assignment routes are working.",
  });
});

// ======================================
// Student / Tutor / Admin
// ======================================

// Get all assignments for a course
router.get(
  "/course/:courseId",
  protect,
  getAssignmentsByCourse,
);

// Get all assignments for a lesson
router.get(
  "/lesson/:lessonId",
  protect,
  getLessonAssignments,
);

// Get single assignment
router.get(
  "/:id",
  protect,
  getAssignment,
);

// ======================================
// Tutor / Admin
// ======================================

// Create assignment
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewAssignment,
);

// Update assignment
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateAssignmentDetails,
);

// Publish assignment
router.patch(
  "/:id/publish",
  protect,
  authorize("tutor", "admin"),
  publishAssignmentNow,
);

// Delete assignment
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  removeAssignment,
);

module.exports = router;