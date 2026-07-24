const express = require("express");

const { getMyWallet, getMyLedger } = require("../controllers/walletController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// Wallet
// ======================================
router.get("/me", protect, getMyWallet);

// ======================================
// Ledger
// ======================================
router.get("/ledger", protect, getMyLedger);

module.exports = router;
