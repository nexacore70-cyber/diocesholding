const Ledger = require("../models/Ledger");

// ======================================
// Create Ledger Entry
// ======================================
const createLedgerEntry = async ({
  wallet,
  owner,
  payment = null,
  withdrawal = null,
  amount,
  type,
  category,
  description = "",
  balanceBefore,
  balanceAfter,
  status = "completed",
}) => {
  return await Ledger.create({
    wallet,
    owner,
    payment,
    withdrawal,
    amount,
    type,
    category,
    description,
    balanceBefore,
    balanceAfter,
    status,
  });
};

// ======================================
// Get Wallet Ledger
// ======================================
const getWalletLedger = async (walletId) => {
  return await Ledger.find({ wallet: walletId })
    .sort({ createdAt: -1 });
};

// ======================================
// Get User Ledger
// ======================================
const getUserLedger = async (ownerId) => {
  return await Ledger.find({ owner: ownerId })
    .populate("payment")
    .populate("withdrawal")
    .sort({ createdAt: -1 });
};

module.exports = {
  createLedgerEntry,
  getWalletLedger,
  getUserLedger,
};