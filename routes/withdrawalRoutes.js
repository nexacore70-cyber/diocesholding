const express = require("express");

const {
  createWithdrawal,
  getWithdrawals,
  getPendingWithdrawalRequests,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} = require("../controllers/withdrawalController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Tutor Request Withdrawal
// POST /api/withdrawals
// ======================================
router.post("/", protect, authorize("tutor"), createWithdrawal);

// ======================================
// Get My Withdrawals
// GET /api/withdrawals/my-withdrawals
// ======================================
router.get("/my-withdrawals", protect, getWithdrawals);

// ======================================
// Admin: Get Pending Withdrawals
// GET /api/withdrawals/pending
// ======================================
router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingWithdrawalRequests,
);

// ======================================
// Admin: Approve Withdrawal
// PATCH /api/withdrawals/:id/approve
// ======================================
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveWithdrawalRequest,
);

// ======================================
// Admin: Reject Withdrawal
// PATCH /api/withdrawals/:id/reject
// ======================================
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectWithdrawalRequest,
);

module.exports = router;
