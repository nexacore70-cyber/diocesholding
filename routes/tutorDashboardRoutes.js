const express = require("express");

const {
  getDashboard,
  getOverview,
  getCourses,
  getStudents,
  getRevenue,
  getMonthlyRevenue,
  getRecentEnrollments,
  getRecentPayments,
  getCoursePerformance,
  getNotifications,
} = require("../controllers/tutorDashboardController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Tutor Dashboard
// ======================================

router.get(
  "/",
  protect,
  authorize("tutor"),
  getDashboard,
);

router.get(
  "/overview",
  protect,
  authorize("tutor"),
  getOverview,
);

router.get(
  "/courses",
  protect,
  authorize("tutor"),
  getCourses,
);

router.get(
  "/students",
  protect,
  authorize("tutor"),
  getStudents,
);

router.get(
  "/revenue",
  protect,
  authorize("tutor"),
  getRevenue,
);

router.get(
  "/revenue/monthly",
  protect,
  authorize("tutor"),
  getMonthlyRevenue,
);

router.get(
  "/enrollments/recent",
  protect,
  authorize("tutor"),
  getRecentEnrollments,
);

router.get(
  "/payments/recent",
  protect,
  authorize("tutor"),
  getRecentPayments,
);

router.get(
  "/performance",
  protect,
  authorize("tutor"),
  getCoursePerformance,
);

router.get(
  "/notifications",
  protect,
  authorize("tutor"),
  getNotifications,
);

module.exports = router;