console.log("✅ courseRoutes loaded");

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

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Course routes are working.",
  });
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get all courses
router.get("/", getCourses);

// Get course by slug
router.get("/slug/:slug", getSingleCourseBySlug);

// Get course by ID
router.get("/:id", getSingleCourse);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Create course
router.post("/", protect, authorize("tutor", "admin"), createNewCourse);

// Update course
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingCourse,
);

// Delete course (soft delete)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  removeCourse,
);

// Restore deleted course
router.patch(
  "/restore/:id",
  protect,
  authorize("admin"),
  restoreDeletedCourse,
);

module.exports = router;