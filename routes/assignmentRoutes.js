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
  closeAssignmentNow,
} = require("../controllers/assignmentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ======================================
// Student / Tutor / Admin
// ======================================

// Get course assignments
router.get(
  "/course/:courseId",
  protect,
  authorize("student", "tutor", "admin"),
  getAssignmentsByCourse,
);

// Get lesson assignments
router.get(
  "/lesson/:lessonId",
  protect,
  authorize("student", "tutor", "admin"),
  getLessonAssignments,
);

// Get single assignment
router.get(
  "/:id",
  protect,
  authorize("student", "tutor", "admin"),
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

// Close assignment
router.patch(
  "/:id/close",
  protect,
  authorize("tutor", "admin"),
  closeAssignmentNow,
);

// Delete assignment
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  removeAssignment,
);

module.exports = router;