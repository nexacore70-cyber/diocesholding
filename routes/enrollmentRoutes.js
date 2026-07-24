const express = require("express");
const router = express.Router();

const {
  createNewEnrollment,
  getEnrollments,
  getEnrollment,
  updateExistingEnrollment,
  deleteExistingEnrollment,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Enrollment routes are working.",
  });
});

// Get All Enrollments
router.get("/", protect, authorize("admin", "tutor"), getEnrollments);

// Get Single Enrollment
router.get("/:id", protect, authorize("admin", "tutor"), getEnrollment);

// Create Enrollment
router.post(
  "/",
  protect,
  authorize("student", "admin", "tutor"),
  createNewEnrollment,
);

// Update Enrollment
router.put(
  "/:id",
  protect,
  authorize("admin", "tutor"),
  updateExistingEnrollment,
);

// Delete Enrollment
router.delete(
  "/:id",
  protect,
  authorize("admin", "tutor"),
  deleteExistingEnrollment,
);

module.exports = router;
