const {
  getDashboardAnalytics,
} = require("../services/analyticsService");

// ======================================
// Get Admin Dashboard
// GET /api/analytics/dashboard
// ======================================
const dashboard = async (req, res) => {
  try {
    const result =
      await getDashboardAnalytics();

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  dashboard,
};