const express = require("express");
const router = express.Router();

const {
  createNewLesson,
  getLessons,
  getLesson,
  updateExistingLesson,
  deleteExistingLesson,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Lesson routes are working.",
  });
});

// Get All Lessons
router.get("/", getLessons);

// Get Single Lesson
router.get("/:id", getLesson);

// Update Lesson
router.put("/:id", protect, authorize("tutor", "admin"), updateExistingLesson);

// Delete Lesson
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingLesson,
);

// Create Lesson
router.post("/", protect, authorize("tutor", "admin"), createNewLesson);

module.exports = router;
