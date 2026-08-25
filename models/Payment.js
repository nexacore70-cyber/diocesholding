const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // ======================================
    // Student
    // ======================================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ======================================
    // Course
    // ======================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // ======================================
    // Enrollment
    // ======================================
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
      index: true,
    },

    // ======================================
    // Amount
    // Stored in smallest currency unit.
    // NGN => kobo
    // ======================================
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // ======================================
    // Currency
    // ======================================
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      default: "NGN",
      maxlength: 3,
    },

    // ======================================
    // Gateway
    // ======================================
    gateway: {
      type: String,
      enum: ["paystack", "flutterwave", "manual"],
      default: "paystack",
      index: true,
    },

    // ======================================
    // Internal Payment Reference
    // ======================================
    reference: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
      index: true,
    },

    // ======================================
    // Gateway Transaction Reference
    // ======================================
    gatewayReference: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    // ======================================
    // Gateway Transaction ID
    // ======================================
    gatewayTransactionId: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // Payment Method
    // ======================================
    paymentMethod: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // Payment Status
    // ======================================
    status: {
      type: String,
      enum: [
        "pending",
        "successful",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    // ======================================
    // Fulfillment Status
    //
    // Prevents duplicate enrollment/revenue
    // processing when verification + webhook
    // happen at the same time.
    // ======================================
    fulfillmentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    // ======================================
    // Fulfillment Error
    // ======================================
    fulfillmentError: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    // ======================================
    // Verification Attempts
    // ======================================
    verificationAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ======================================
    // Last Verification
    // ======================================
    lastVerifiedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Paid At
    // ======================================
    paidAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Gateway Metadata
    // ======================================
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ======================================
    // Soft Delete
    // ======================================
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Indexes
// ======================================

paymentSchema.index({
  student: 1,
  course: 1,
  status: 1,
});

paymentSchema.index({
  course: 1,
  status: 1,
});

paymentSchema.index({
  gateway: 1,
  gatewayReference: 1,
});

paymentSchema.index({
  fulfillmentStatus: 1,
  status: 1,
});

module.exports = mongoose.model("Payment", paymentSchema);