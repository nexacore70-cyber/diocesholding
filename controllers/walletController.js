const {
  getWallet,
  getWalletBalance,
} = require("../services/walletService");

const {
  getUserLedger,
} = require("../services/ledgerService");

// ======================================
// Get My Wallet
// GET /api/wallet/me
// ======================================

const getMyWallet = async (req, res) => {
  try {
    const wallet = await getWallet(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Wallet retrieved successfully.",
      data: wallet,
    });
  } catch (error) {
    console.error("Get Wallet Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Wallet Balance
// GET /api/wallet/balance
// ======================================

const getMyWalletBalance = async (req, res) => {
  try {
    const balance = await getWalletBalance(
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Wallet balance retrieved successfully.",
      data: balance,
    });
  } catch (error) {
    console.error("Get Wallet Balance Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Ledger
// GET /api/wallet/ledger
// ======================================

const getMyLedger = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;

    const ledger = await getUserLedger(
      req.user._id,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Ledger retrieved successfully.",
      data: ledger,
    });
  } catch (error) {
    console.error("Get Ledger Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyWallet,
  getMyWalletBalance,
  getMyLedger,
};