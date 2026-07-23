const express = require("express");
const router = express.Router();

const {
  completeStudentLesson,
} = require("../controllers/lessonProgressController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Lesson Progress routes are working.",
  });
});

console.log("protect:", typeof protect);
console.log("authorize:", typeof authorize);
console.log("completeStudentLesson:", typeof completeStudentLesson);

// Complete Lesson
router.post(
  "/:lessonId/complete",
  protect,
  authorize("student"),
  completeStudentLesson
);

module.exports = router;