const express = require("express");

const router = express.Router();

const {
  createNewCourse,
  getCourses,
  getSingleCourse,
  getSingleCourseBySlug,
  updateExistingCourse,
  removeCourse,
  restoreDeletedCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("../middleware/courseValidation");

// ======================================
// Public Routes
// ======================================

router.get("/", getCourses);

router.get("/slug/:slug", getSingleCourseBySlug);

router.get("/:id", getSingleCourse);

// ======================================
// Protected Routes
// ======================================

router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  validateCreateCourse,
  createNewCourse,
);

router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  validateUpdateCourse,
  updateExistingCourse,
);

router.delete("/:id", protect, authorize("admin"), removeCourse);

router.patch("/restore/:id", protect, authorize("admin"), restoreDeletedCourse);

// ======================================
// Export
// ======================================

module.exports = router;
