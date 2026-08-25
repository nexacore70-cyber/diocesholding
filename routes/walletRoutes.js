const express = require("express");

const {
  getMyWallet,
  getMyWalletBalance,
  getMyLedger,
} = require("../controllers/walletController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// Wallet
// ======================================

router.get(
  "/me",
  protect,
  getMyWallet,
);

// ======================================
// Balance
// ======================================

router.get(
  "/balance",
  protect,
  getMyWalletBalance,
);

// ======================================
// Ledger
// ======================================

router.get(
  "/ledger",
  protect,
  getMyLedger,
);

module.exports = router;