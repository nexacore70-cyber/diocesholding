const express = require("express");
const router = express.Router();

const {
  createNewAssignment,
  getAssignment,
  getAssignmentsByCourse,
  updateAssignmentDetails,
  removeAssignment,
  publishAssignmentNow,
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// =========================
// Test Route
// =========================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assignment routes are working.",
  });
});

// =========================
// Student & Tutor
// =========================

// Get Assignment By ID
router.get(
  "/:id",
  protect,
  getAssignment
);

// Get Course Assignments
router.get(
  "/course/:courseId",
  protect,
  getAssignmentsByCourse
);

// =========================
// Tutor/Admin
// =========================

// Create Assignment
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewAssignment
);

// Update Assignment
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateAssignmentDetails
);

// Delete Assignment
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  removeAssignment
);

// Publish Assignment
router.patch(
  "/:id/publish",
  protect,
  authorize("tutor", "admin"),
  publishAssignmentNow
);

module.exports = router;