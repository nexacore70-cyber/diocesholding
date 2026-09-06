const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Student Dashboard Page
// ======================================

router.get(
  "/",
  protect,
  authorize("student"),
  (req, res) => {
    return res.render("dashboard/index", {
      title: "Dashboard | NexaCore",
      user: req.user,
      dashboardPage: true,
    });
  },
);

module.exports = router;