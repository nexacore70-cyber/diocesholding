const express = require("express");

const {
  getDashboard,
  getOverview,
  getCourses,
  getContinue,
  getRecent,
  getAssignments,
  getQuizzes,
  getCertificates,
  getWishlist,
  getPayments,
  getNotifications,
  getProgress,
} = require("../controllers/studentDashboardController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Student Dashboard
// ======================================

router.get(
  "/",
  protect,
  authorize("student"),
  getDashboard,
);

router.get(
  "/overview",
  protect,
  authorize("student"),
  getOverview,
);

router.get(
  "/courses",
  protect,
  authorize("student"),
  getCourses,
);

router.get(
  "/continue-learning",
  protect,
  authorize("student"),
  getContinue,
);

router.get(
  "/recent-lessons",
  protect,
  authorize("student"),
  getRecent,
);

router.get(
  "/assignments",
  protect,
  authorize("student"),
  getAssignments,
);

router.get(
  "/quizzes",
  protect,
  authorize("student"),
  getQuizzes,
);

router.get(
  "/certificates",
  protect,
  authorize("student"),
  getCertificates,
);

router.get(
  "/wishlist",
  protect,
  authorize("student"),
  getWishlist,
);

router.get(
  "/payments",
  protect,
  authorize("student"),
  getPayments,
);

router.get(
  "/notifications",
  protect,
  authorize("student"),
  getNotifications,
);

router.get(
  "/progress",
  protect,
  authorize("student"),
  getProgress,
);

module.exports = router;