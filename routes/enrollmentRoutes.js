const express = require("express");

const router = express.Router();

const {
  createNewEnrollment,
  getMyEnrollmentsController,
  getEnrollments,
  getTutorEnrollmentList,
  getEnrollment,
  updateExistingEnrollment,
  deleteExistingEnrollment,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Enrollment routes are working.",
  });
});

// ======================================
// Student: My Enrollments
// ======================================

router.get("/me", protect, authorize("student"), getMyEnrollmentsController);

// ======================================
// Tutor: Enrollments For Their Courses
// ======================================

router.get("/tutor", protect, authorize("tutor"), getTutorEnrollmentList);

// ======================================
// Admin: All Enrollments
// ======================================

router.get("/", protect, authorize("admin"), getEnrollments);

// ======================================
// Student: Create Enrollment
// ======================================

router.post("/", protect, authorize("student"), createNewEnrollment);

// ======================================
// Admin/Tutor: Get Single Enrollment
// ======================================

router.get("/:id", protect, authorize("admin", "tutor"), getEnrollment);

// ======================================
// Admin/Tutor: Update Enrollment
// ======================================

router.put(
  "/:id",
  protect,
  authorize("admin", "tutor"),
  updateExistingEnrollment,
);

// ======================================
// Admin Only: Delete Enrollment
// ======================================

router.delete("/:id", protect, authorize("admin"), deleteExistingEnrollment);

module.exports = router;
