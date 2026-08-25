const mongoose = require("mongoose");

const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");

const { createLedgerEntry } = require("./ledgerService");

// ======================================
// Validate Withdrawal Data
// ======================================

const validateWithdrawalData = (
  amount,
  bankName,
  accountName,
  accountNumber,
) => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(
      "Withdrawal amount must be a positive integer.",
    );
  }

  if (!bankName || !bankName.trim()) {
    throw new Error("Bank name is required.");
  }

  if (!accountName || !accountName.trim()) {
    throw new Error("Account name is required.");
  }

  if (!/^\d{10}$/.test(String(accountNumber))) {
    throw new Error("Account number must contain exactly 10 digits.");
  }
};

// ======================================
// Request Withdrawal
// ======================================

const requestWithdrawal = async (
  owner,
  amount,
  bankName,
  accountName,
  accountNumber,
) => {
  validateWithdrawalData(
    amount,
    bankName,
    accountName,
    accountNumber,
  );

  const session = await mongoose.startSession();

  try {
    let withdrawal;

    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({
        owner,
      }).session(session);

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      if (wallet.status !== "active") {
        throw new Error("Wallet is not active.");
      }

      // Atomic reservation.
      const updatedWallet = await Wallet.findOneAndUpdate(
        {
          _id: wallet._id,
          status: "active",
          availableBalance: {
            $gte: amount,
          },
        },
        {
          $inc: {
            availableBalance: -amount,
            pendingBalance: amount,
          },
          $set: {
            lastTransactionAt: new Date(),
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedWallet) {
        throw new Error("Insufficient wallet balance.");
      }

      const created = await Withdrawal.create(
        [
          {
            wallet: updatedWallet._id,
            owner,
            amount,
            currency: updatedWallet.currency,
            bankName: bankName.trim(),
            accountName: accountName.trim(),
            accountNumber: String(accountNumber),
            status: "pending",
          },
        ],
        { session },
      );

      withdrawal = created[0];
    });

    return {
      success: true,
      message: "Withdrawal request submitted successfully.",
      data: withdrawal,
    };
  } finally {
    await session.endSession();
  }
};

// ======================================
// Get My Withdrawals
// ======================================

const getMyWithdrawals = async (owner) => {
  const withdrawals = await Withdrawal.find({
    owner,
  })
    .select(
      "-accountNumber",
    )
    .sort({ createdAt: -1 })
    .lean();

  return {
    success: true,
    message: "Withdrawals retrieved successfully.",
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
    .populate("owner", "firstName lastName email")
    .select("-accountNumber")
    .sort({ createdAt: 1 })
    .lean();

  return {
    success: true,
    message: "Pending withdrawals retrieved successfully.",
    data: withdrawals,
  };
};

// ======================================
// Approve Withdrawal
// ======================================

const approveWithdrawal = async (
  withdrawalId,
  adminId,
) => {
  if (!mongoose.isValidObjectId(withdrawalId)) {
    throw new Error("Invalid withdrawal ID.");
  }

  const session = await mongoose.startSession();

  try {
    let withdrawal;

    await session.withTransaction(async () => {
      withdrawal = await Withdrawal.findOne({
        _id: withdrawalId,
        status: "pending",
      }).session(session);

      if (!withdrawal) {
        throw new Error(
          "Withdrawal not found or already processed.",
        );
      }

      const wallet = await Wallet.findOne({
        _id: withdrawal.wallet,
        status: "active",
        pendingBalance: {
          $gte: withdrawal.amount,
        },
      }).session(session);

      if (!wallet) {
        throw new Error("Wallet reservation is invalid.");
      }

      const balanceBefore = wallet.availableBalance;

      // The amount was already removed from availableBalance
      // when withdrawal was requested.
      wallet.pendingBalance -= withdrawal.amount;
      wallet.totalWithdrawn += withdrawal.amount;
      wallet.lastTransactionAt = new Date();

      await wallet.save({ session });

      withdrawal.status = "approved";
      withdrawal.approvedBy = adminId;
      withdrawal.approvedAt = new Date();

      await withdrawal.save({ session });

      const ledger = await createLedgerEntry(
        {
          wallet: wallet._id,
          owner: wallet.owner,
          withdrawal: withdrawal._id,
          amount: withdrawal.amount,
          type: "debit",
          category: "withdrawal",
          description: "Withdrawal approved.",
          balanceBefore,
          balanceAfter: wallet.availableBalance,
          idempotencyKey: `withdrawal-approval-${withdrawal._id}`,
        },
        session,
      );

      withdrawal.ledger = ledger._id;

      await withdrawal.save({ session });
    });

    return {
      success: true,
      message: "Withdrawal approved successfully.",
      data: withdrawal,
    };
  } finally {
    await session.endSession();
  }
};

// ======================================
// Mark Withdrawal As Paid
// ======================================

const markWithdrawalAsPaid = async (
  withdrawalId,
  gatewayReference,
) => {
  if (!mongoose.isValidObjectId(withdrawalId)) {
    throw new Error("Invalid withdrawal ID.");
  }

  if (!gatewayReference || !gatewayReference.trim()) {
    throw new Error("Gateway reference is required.");
  }

  const withdrawal = await Withdrawal.findOneAndUpdate(
    {
      _id: withdrawalId,
      status: "approved",
    },
    {
      $set: {
        status: "paid",
        gatewayReference: gatewayReference.trim(),
        paidAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  if (!withdrawal) {
    throw new Error(
      "Withdrawal is not approved or has already been paid.",
    );
  }

  return {
    success: true,
    message: "Withdrawal marked as paid.",
    data: withdrawal,
  };
};

// ======================================
// Reject Withdrawal
// ======================================

const rejectWithdrawal = async (
  withdrawalId,
  adminId,
  reason = "",
) => {
  if (!mongoose.isValidObjectId(withdrawalId)) {
    throw new Error("Invalid withdrawal ID.");
  }

  if (!reason || !reason.trim()) {
    throw new Error(
      "A rejection reason is required.",
    );
  }

  const session = await mongoose.startSession();

  try {
    let withdrawal;

    await session.withTransaction(async () => {
      withdrawal = await Withdrawal.findOne({
        _id: withdrawalId,
        status: "pending",
      }).session(session);

      if (!withdrawal) {
        throw new Error(
          "Withdrawal not found or already processed.",
        );
      }

      const wallet = await Wallet.findOneAndUpdate(
        {
          _id: withdrawal.wallet,
          status: "active",
          pendingBalance: {
            $gte: withdrawal.amount,
          },
        },
        {
          $inc: {
            pendingBalance: -withdrawal.amount,
            availableBalance: withdrawal.amount,
          },
          $set: {
            lastTransactionAt: new Date(),
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!wallet) {
        throw new Error(
          "Unable to release reserved wallet funds.",
        );
      }

      withdrawal.status = "rejected";
      withdrawal.approvedBy = adminId;
      withdrawal.approvedAt = new Date();
      withdrawal.rejectionReason = reason.trim();

      await withdrawal.save({ session });

      // Reversal is an audit event.
      const ledger = await createLedgerEntry(
        {
          wallet: wallet._id,
          owner: wallet.owner,
          withdrawal: withdrawal._id,
          amount: withdrawal.amount,
          type: "credit",
          category: "withdrawal_reversal",
          description: "Rejected withdrawal funds returned.",
          balanceBefore:
            wallet.availableBalance - withdrawal.amount,
          balanceAfter: wallet.availableBalance,
          idempotencyKey: `withdrawal-reversal-${withdrawal._id}`,
        },
        session,
      );

      // Keep reference for audit.
      withdrawal.ledger = ledger._id;

      await withdrawal.save({ session });
    });

    return {
      success: true,
      message: "Withdrawal rejected successfully.",
      data: withdrawal,
    };
  } finally {
    await session.endSession();
  }
};

module.exports = {
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
  markWithdrawalAsPaid,
  rejectWithdrawal,
};