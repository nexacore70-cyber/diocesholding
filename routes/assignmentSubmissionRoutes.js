const express = require("express");

const router = express.Router();

const {
  submitStudentAssignment,
  getStudentSubmissions,
  getSubmission,
  gradeStudentSubmission,
  returnStudentSubmission,
} = require("../controllers/assignmentSubmissionController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ======================================
// Student Routes
// ======================================

// Submit assignment
// POST /api/assignment-submissions/:assignmentId/submit

router.post(
  "/:assignmentId/submit",
  protect,
  authorize("student"),
  submitStudentAssignment,
);

// Get own submissions
// GET /api/assignment-submissions/my-submissions

router.get(
  "/my-submissions",
  protect,
  authorize("student"),
  getStudentSubmissions,
);

// ======================================
// Tutor / Admin Routes
// ======================================

// Get submission
// GET /api/assignment-submissions/:id

router.get(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  getSubmission,
);

// Grade submission
// PATCH /api/assignment-submissions/:id/grade

router.patch(
  "/:id/grade",
  protect,
  authorize("tutor", "admin"),
  gradeStudentSubmission,
);

// Return submission for revision
// PATCH /api/assignment-submissions/:id/return

router.patch(
  "/:id/return",
  protect,
  authorize("tutor", "admin"),
  returnStudentSubmission,
);

module.exports = router;