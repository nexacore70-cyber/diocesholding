const express = require("express");
const router = express.Router();

const {
  createNewLiveClass,
  getLiveClasses,
  getLiveClass,
  updateExistingLiveClass,
  deleteExistingLiveClass,
  scheduleClass,
  startClass,
  endClass,
  cancelClass,
  joinClass,
  leaveClass,
  getAttendance,
} = require("../controllers/liveClassController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Live Class routes are working.",
  });
});

// ======================================
// Authenticated Users
// ======================================

// Get All Live Classes
router.get("/", protect, getLiveClasses);

// Get Single Live Class
router.get("/:id", protect, getLiveClass);

// ======================================
// Tutor/Admin
// ======================================

// Create Live Class
router.post("/", protect, authorize("tutor", "admin"), createNewLiveClass);

// Update Live Class
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingLiveClass,
);

// Delete Live Class
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingLiveClass,
);

// Schedule Live Class
router.patch(
  "/:id/schedule",
  protect,
  authorize("tutor", "admin"),
  scheduleClass,
);

// Start Live Class
router.patch("/:id/start", protect, authorize("tutor", "admin"), startClass);

// End Live Class
router.patch("/:id/end", protect, authorize("tutor", "admin"), endClass);

// Cancel Live Class
router.patch("/:id/cancel", protect, authorize("tutor", "admin"), cancelClass);

// Attendance List
router.get(
  "/:id/attendance",
  protect,
  authorize("tutor", "admin"),
  getAttendance,
);

// ======================================
// Student
// ======================================

// Join Live Class
router.post("/:id/join", protect, authorize("student"), joinClass);

// Leave Live Class
router.post("/:id/leave", protect, authorize("student"), leaveClass);

module.exports = router;
