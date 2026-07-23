const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");

const {
  createLedgerEntry,
} = require("./ledgerService");

// ======================================
// Request Withdrawal
// ======================================
const requestWithdrawal = async (
  owner,
  amount,
  bankName,
  accountName,
  accountNumber
) => {
  if (!amount || amount <= 0) {
    throw new Error(
      "Withdrawal amount must be greater than zero."
    );
  }

  const wallet = await Wallet.findOne({ owner });

  if (!wallet) {
    throw new Error("Wallet not found.");
  }

  if (wallet.status !== "active") {
    throw new Error("Wallet is not active.");
  }

  if (wallet.availableBalance < amount) {
    throw new Error(
      "Insufficient wallet balance."
    );
  }

  // Reserve funds
  wallet.availableBalance -= amount;
  wallet.pendingBalance += amount;

  await wallet.save();

  const withdrawal = await Withdrawal.create({
    wallet: wallet._id,
    owner,
    amount,
    currency: wallet.currency,
    bankName,
    accountName,
    accountNumber,
  });

  return {
    success: true,
    message:
      "Withdrawal request submitted successfully.",
    data: withdrawal,
  };
};

// ======================================
// Get My Withdrawals
// ======================================
const getMyWithdrawals = async (owner) => {
  const withdrawals = await Withdrawal.find({
    owner,
  })
    .populate("wallet")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message:
      "Withdrawals retrieved successfully.",
    data: withdrawals,
  };
};

// ======================================
// Get Pending Withdrawals
// ======================================
const getPendingWithdrawals = async () => {
  const withdrawals = await Withdrawal.find({
    status: "pending",
  })
    .populate(
      "owner",
      "firstName lastName email"
    )
    .populate("wallet")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message:
      "Pending withdrawals retrieved successfully.",
    data: withdrawals,
  };
};

// ======================================
// Approve Withdrawal
// ======================================
const approveWithdrawal = async (
  withdrawalId,
  adminId
) => {
  const withdrawal =
    await Withdrawal.findById(
      withdrawalId
    );

  if (!withdrawal) {
    throw new Error(
      "Withdrawal not found."
    );
  }

  if (withdrawal.status !== "pending") {
    throw new Error(
      "Withdrawal has already been processed."
    );
  }

  const wallet = await Wallet.findById(
    withdrawal.wallet
  );

  if (!wallet) {
    throw new Error("Wallet not found.");
  }

  const balanceBefore =
    wallet.availableBalance;

  // Release reserved balance
  wallet.pendingBalance -=
    withdrawal.amount;

  wallet.totalWithdrawn +=
    withdrawal.amount;

  wallet.lastTransactionAt =
    new Date();

  await wallet.save();

  withdrawal.status = "approved";
  withdrawal.approvedBy = adminId;
  withdrawal.approvedAt = new Date();
  withdrawal.paidAt = new Date();

  await withdrawal.save();

  const ledger =
    await createLedgerEntry({
      wallet: wallet._id,
      owner: wallet.owner,
      withdrawal: withdrawal._id,
      amount: withdrawal.amount,
      type: "debit",
      category: "withdrawal",
      description:
        "Withdrawal approved",
      balanceBefore,
      balanceAfter:
        wallet.availableBalance,
    });

  withdrawal.ledger = ledger._id;

  await withdrawal.save();

  return {
    success: true,
    message:
      "Withdrawal approved successfully.",
    data: withdrawal,
  };
};

// ======================================
// Reject Withdrawal
// ======================================
const rejectWithdrawal = async (
  withdrawalId,
  adminId,
  reason = ""
) => {
  const withdrawal =
    await Withdrawal.findById(
      withdrawalId
    );

  if (!withdrawal) {
    throw new Error(
      "Withdrawal not found."
    );
  }

  if (withdrawal.status !== "pending") {
    throw new Error(
      "Withdrawal has already been processed."
    );
  }

  const wallet = await Wallet.findById(
    withdrawal.wallet
  );

  if (!wallet) {
    throw new Error("Wallet not found.");
  }

  // Return reserved money
  wallet.pendingBalance -=
    withdrawal.amount;

  wallet.availableBalance +=
    withdrawal.amount;

  await wallet.save();

  withdrawal.status = "rejected";
  withdrawal.approvedBy = adminId;
  withdrawal.rejectionReason =
    reason;
  withdrawal.approvedAt =
    new Date();

  await withdrawal.save();

  return {
    success: true,
    message:
      "Withdrawal rejected successfully.",
    data: withdrawal,
  };
};

module.exports = {
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
};