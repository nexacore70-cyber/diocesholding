const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
      trim: true,
    },

    depositPercentage: {
      type: Number,
      default: 25,
      min: 0,
      max: 100,
    },

    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "in_progress",
        "submitted",
        "revision",
        "completed",
        "cancelled",
      ],
      default: "draft",
    },

    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "deposit_pending",
        "deposit_paid",
        "fully_paid",
        "refunded",
      ],
      default: "unpaid",
    },

    descriptionFiles: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],

    deadline: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
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

module.exports = mongoose.model("Project", projectSchema);