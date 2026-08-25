const express = require("express");

const {
  createWithdrawal,
  getWithdrawals,
  getPendingWithdrawalRequests,
  approveWithdrawalRequest,
  markWithdrawalPaid,
  rejectWithdrawalRequest,
} = require("../controllers/withdrawalController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Tutor
// ======================================

// Request withdrawal
router.post(
  "/",
  protect,
  authorize("tutor"),
  createWithdrawal,
);

// Get own withdrawals
router.get(
  "/my-withdrawals",
  protect,
  authorize("tutor"),
  getWithdrawals,
);

// ======================================
// Admin
// ======================================

// Pending withdrawals
router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingWithdrawalRequests,
);

// Approve withdrawal
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveWithdrawalRequest,
);

// Mark payment as completed
router.patch(
  "/:id/paid",
  protect,
  authorize("admin"),
  markWithdrawalPaid,
);

// Reject withdrawal
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectWithdrawalRequest,
);

module.exports = router;