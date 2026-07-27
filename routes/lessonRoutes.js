const express = require("express");
const router = express.Router();

const {
  createNewLesson,
  getLessons,
  getLesson,
  updateExistingLesson,
  deleteExistingLesson,
  restoreDeletedLesson,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lesson routes are working.",
  });
});

// ======================================
// Public Routes
// ======================================

// Get All Lessons
router.get("/", getLessons);

// Get Single Lesson
router.get("/:id", getLesson);

// ======================================
// Protected Routes
// ======================================

// Create Lesson
router.post("/", protect, authorize("tutor", "admin"), createNewLesson);

// Update Lesson
router.put("/:id", protect, authorize("tutor", "admin"), updateExistingLesson);

// Soft Delete Lesson
router.delete("/:id", protect, authorize("admin"), deleteExistingLesson);

// Restore Lesson
router.patch("/restore/:id", protect, authorize("admin"), restoreDeletedLesson);

module.exports = router;
