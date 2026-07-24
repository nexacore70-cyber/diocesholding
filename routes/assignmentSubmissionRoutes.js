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

// =========================
// Test Route
// =========================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Assignment Submission routes are working.",
  });
});

// =========================
// Student Routes
// =========================

// Submit Assignment
router.post(
  "/:assignmentId/submit",
  protect,
  authorize("student"),
  submitStudentAssignment,
);

// My Submissions
router.get(
  "/my-submissions",
  protect,
  authorize("student"),
  getStudentSubmissions,
);

// =========================
// Tutor/Admin Routes
// =========================

// View Submission
router.get("/:id", protect, authorize("tutor", "admin"), getSubmission);

// Grade Submission
router.patch(
  "/:id/grade",
  protect,
  authorize("tutor", "admin"),
  gradeStudentSubmission,
);

module.exports = router;
