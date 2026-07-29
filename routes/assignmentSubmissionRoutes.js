const express = require("express");
const router = express.Router();

const {
  submitStudentAssignment,
  getStudentSubmissions,
  getSubmission,
  gradeStudentSubmission,
} = require("../controllers/assignmentSubmissionController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assignment Submission routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// Submit Assignment
// POST /api/assignment-submissions/:assignmentId/submit
router.post(
  "/:assignmentId/submit",
  protect,
  authorize("student"),
  submitStudentAssignment,
);

// Get My Submissions
// GET /api/assignment-submissions/my-submissions
router.get(
  "/my-submissions",
  protect,
  authorize("student"),
  getStudentSubmissions,
);

// ======================================
// Tutor/Admin Routes
// ======================================

// View Submission
// GET /api/assignment-submissions/:id
router.get("/:id", protect, authorize("tutor", "admin"), getSubmission);

// Grade Submission
// PATCH /api/assignment-submissions/:id/grade
router.patch(
  "/:id/grade",
  protect,
  authorize("tutor", "admin"),
  gradeStudentSubmission,
);

module.exports = router;
