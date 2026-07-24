const express = require("express");
const router = express.Router();

const {
  initializeStudentPayment,
  verifyStudentPayment,
  getPayment,
  getMyPayments,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes are working.",
  });
});

// ======================================
// Student Routes
// ======================================

// Initialize Payment
router.post(
  "/initialize",
  protect,
  authorize("student"),
  initializeStudentPayment,
);

// My Payments
router.get("/my-payments", protect, authorize("student"), getMyPayments);

// ======================================
// Admin/Tutor Routes
// ======================================

// Verify Payment
router.patch(
  "/verify/:reference",
  protect,
  authorize("admin", "tutor"),
  verifyStudentPayment,
);

// Get Payment By Reference
router.get("/:reference", protect, authorize("admin", "tutor"), getPayment);

module.exports = router;
