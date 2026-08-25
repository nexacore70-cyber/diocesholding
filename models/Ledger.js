const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
      index: true,
    },

    withdrawal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdrawal",
      default: null,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Ledger amount must be an integer.",
      },
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "course_payment",
        "revenue_share",
        "withdrawal",
        "refund",
        "adjustment",
        "withdrawal_reversal",
      ],
      required: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
      index: true,
    },

    // Prevent duplicate financial operations.
    idempotencyKey: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Indexes
// ======================================

ledgerSchema.index({
  owner: 1,
  createdAt: -1,
});

ledgerSchema.index({
  wallet: 1,
  createdAt: -1,
});

ledgerSchema.index({
  category: 1,
  createdAt: -1,
});

// Prevent duplicate ledger operations when a key exists.
ledgerSchema.index(
  {
    idempotencyKey: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);

// ======================================
// Financial consistency
// ======================================

ledgerSchema.pre("validate", function (next) {
  if (this.balanceBefore < 0 || this.balanceAfter < 0) {
    return next(new Error("Ledger balances cannot be negative."));
  }

  if (this.type === "credit") {
    if (this.balanceAfter !== this.balanceBefore + this.amount) {
      return next(
        new Error("Invalid credit ledger balance calculation."),
      );
    }
  }

  if (this.type === "debit") {
    if (this.balanceAfter !== this.balanceBefore - this.amount) {
      return next(
        new Error("Invalid debit ledger balance calculation."),
      );
    }
  }

  next();
});

module.exports = mongoose.model("Ledger", ledgerSchema);