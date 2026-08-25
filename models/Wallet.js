const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    ownerType: {
      type: String,
      enum: ["student", "tutor", "admin", "company"],
      required: true,
      index: true,
    },

    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
      uppercase: true,
      trim: true,
    },

    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Available balance must be an integer.",
      },
    },

    pendingBalance: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Pending balance must be an integer.",
      },
    },

    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Total earned must be an integer.",
      },
    },

    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Total withdrawn must be an integer.",
      },
    },

    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      default: "active",
      index: true,
    },

    lastTransactionAt: {
      type: Date,
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

walletSchema.index({
  owner: 1,
  status: 1,
});

// ======================================
// Validation
// ======================================

walletSchema.pre("validate", function (next) {
  if (this.pendingBalance < 0) {
    return next(new Error("Pending balance cannot be negative."));
  }

  if (this.availableBalance < 0) {
    return next(new Error("Available balance cannot be negative."));
  }

  next();
});

module.exports = mongoose.model("Wallet", walletSchema);