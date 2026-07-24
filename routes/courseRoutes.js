console.log("✅ courseRoutes loaded");

const express = require("express");
const router = express.Router();

const { createNewCourse } = require("../controllers/courseController");

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
| Course Routes
|--------------------------------------------------------------------------
*/

// Create Course (Tutor/Admin Only)
router.post("/", protect, authorize("tutor", "admin"), createNewCourse);

module.exports = router;
