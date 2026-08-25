const Ledger = require("../models/Ledger");

// ======================================
// Create Ledger Entry
// ======================================

const createLedgerEntry = async (data, session = null) => {
  const {
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
    idempotencyKey = null,
  } = data;

  if (!wallet || !owner) {
    throw new Error("Wallet and owner are required.");
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Ledger amount must be a positive integer.");
  }

  if (!["credit", "debit"].includes(type)) {
    throw new Error("Invalid ledger transaction type.");
  }

  const entry = new Ledger({
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
    idempotencyKey,
  });

  await entry.save({ session });

  return entry;
};

// ======================================
// Get User Ledger
// ======================================

const getUserLedger = async (owner, limit = 50) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100,
  );

  return Ledger.find({
    owner,
  })
    .populate("payment", "reference status amount")
    .populate("withdrawal", "amount status bankName")
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean();
};

module.exports = {
  createLedgerEntry,
  getUserLedger,
};