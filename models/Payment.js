const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    gateway: {
      type: String,
      enum: ["paystack", "flutterwave", "manual"],
      default: "paystack",
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    gatewayReference: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "successful", "failed", "cancelled", "refunded"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
