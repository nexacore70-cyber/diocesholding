const express = require("express");

const {
  initializeStudentPayment,
  verifyStudentPayment,
  paystackWebhook,
  getPayment,
  getMyPayments,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Test Route
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Payment routes are working.",
  });
});

// ======================================
// Paystack Webhook
//
// IMPORTANT:
// This route MUST receive the raw body.
// See server.js placement below.
// ======================================

router.post(
  "/webhook/paystack",
  express.raw({
    type: "application/json",
  }),
  paystackWebhook,
);

// ======================================
// Student
// ======================================

// Initialize Payment
router.post(
  "/initialize",
  protect,
  authorize("student"),
  initializeStudentPayment,
);

// Verify Payment
router.patch(
  "/verify/:reference",
  protect,
  authorize("student"),
  verifyStudentPayment,
);

// My Payments
router.get(
  "/my-payments",
  protect,
  authorize("student"),
  getMyPayments,
);

// ======================================
// Authenticated Payment Lookup
// ======================================

router.get(
  "/:reference",
  protect,
  authorize("student", "tutor", "admin"),
  getPayment,
);

module.exports = router;