const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    ledger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ledger",
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Withdrawal amount must be an integer.",
      },
    },

    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
      uppercase: true,
      trim: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    accountName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      match: /^\d{10}$/,
    },

    gatewayReference: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Indexes
// ======================================

withdrawalSchema.index({
  owner: 1,
  createdAt: -1,
});

withdrawalSchema.index({
  status: 1,
  createdAt: -1,
});

withdrawalSchema.index({
  wallet: 1,
  status: 1,
});

// ======================================
// State Validation
// ======================================

withdrawalSchema.pre("validate", function (next) {
  if (this.status === "approved") {
    if (!this.approvedBy || !this.approvedAt) {
      return next(
        new Error(
          "Approved withdrawal must have approval information.",
        ),
      );
    }
  }

  if (this.status === "paid") {
    if (!this.paidAt) {
      return next(
        new Error("Paid withdrawal must have a payment date."),
      );
    }
  }

  if (this.status === "rejected" && !this.rejectionReason) {
    return next(
      new Error("Rejected withdrawal must have a rejection reason."),
    );
  }

  next();
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);