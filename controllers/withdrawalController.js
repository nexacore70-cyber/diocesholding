const {
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
  markWithdrawalAsPaid,
  rejectWithdrawal,
} = require("../services/withdrawalService");

// ======================================
// Request Withdrawal
// POST /api/withdrawals
// ======================================

const createWithdrawal = async (req, res) => {
  try {
    const {
      amount,
      bankName,
      accountName,
      accountNumber,
    } = req.body;

    const result = await requestWithdrawal(
      req.user._id,
      Number(amount),
      bankName,
      accountName,
      accountNumber,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Request Withdrawal Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Withdrawals
// GET /api/withdrawals/my-withdrawals
// ======================================

const getWithdrawals = async (req, res) => {
  try {
    const result = await getMyWithdrawals(
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Withdrawals Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Pending Withdrawals
// GET /api/withdrawals/pending
// ======================================

const getPendingWithdrawalRequests = async (
  req,
  res,
) => {
  try {
    const result = await getPendingWithdrawals();

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Pending Withdrawals Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Approve Withdrawal
// PATCH /api/withdrawals/:id/approve
// ======================================

const approveWithdrawalRequest = async (
  req,
  res,
) => {
  try {
    const result = await approveWithdrawal(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Approve Withdrawal Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Withdrawal Paid
// PATCH /api/withdrawals/:id/paid
// ======================================

const markWithdrawalPaid = async (req, res) => {
  try {
    const { gatewayReference } = req.body;

    const result = await markWithdrawalAsPaid(
      req.params.id,
      gatewayReference,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Mark Withdrawal Paid Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Reject Withdrawal
// PATCH /api/withdrawals/:id/reject
// ======================================

const rejectWithdrawalRequest = async (
  req,
  res,
) => {
  try {
    const { reason } = req.body;

    const result = await rejectWithdrawal(
      req.params.id,
      req.user._id,
      reason,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Reject Withdrawal Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWithdrawal,
  getWithdrawals,
  getPendingWithdrawalRequests,
  approveWithdrawalRequest,
  markWithdrawalPaid,
  rejectWithdrawalRequest,
};