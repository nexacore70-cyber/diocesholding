const express = require("express");

const router = express.Router();

const {
  createNewCohort,
  getAllCohorts,
  getSingleCohort,
  updateCohortDetails,
  changeCohortStatus,
  assignStudentToCohort,
  removeStudent,
  getStudents,
  getMyCohortsController,
  removeCohort,
} = require("../controllers/cohortController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ======================================
// Student
// ======================================

// Get my cohorts
// GET /api/cohorts/me
router.get(
  "/me",
  protect,
  authorize("student"),
  getMyCohortsController,
);

// ======================================
// Admin / Tutor
// ======================================

// Get cohorts
// GET /api/cohorts
router.get(
  "/",
  protect,
  authorize("admin", "tutor"),
  getAllCohorts,
);

// Create cohort
// POST /api/cohorts
router.post(
  "/",
  protect,
  authorize("admin"),
  createNewCohort,
);

// Get cohort
// GET /api/cohorts/:id
router.get(
  "/:id",
  protect,
  authorize("admin", "tutor"),
  getSingleCohort,
);

// Update cohort
// PATCH /api/cohorts/:id
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateCohortDetails,
);

// Update status
// PATCH /api/cohorts/:id/status
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  changeCohortStatus,
);

// Get cohort students
// GET /api/cohorts/:id/students
router.get(
  "/:id/students",
  protect,
  authorize("admin", "tutor"),
  getStudents,
);

// Add student
// POST /api/cohorts/:id/students/:studentId
router.post(
  "/:id/students/:studentId",
  protect,
  authorize("admin", "tutor"),
  assignStudentToCohort,
);

// Remove student
// DELETE /api/cohorts/:id/students/:studentId
router.delete(
  "/:id/students/:studentId",
  protect,
  authorize("admin", "tutor"),
  removeStudent,
);

// Delete cohort
// DELETE /api/cohorts/:id
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  removeCohort,
);

module.exports = router;