const express = require("express");

const {
  dashboard,
} = require("../controllers/analyticsController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Admin Dashboard Analytics
// GET /api/analytics/dashboard
// ======================================
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  dashboard
);

module.exports = router;