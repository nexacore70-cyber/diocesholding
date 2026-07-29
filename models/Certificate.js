const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      unique: true,
    },

    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    verificationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["issued", "revoked"],
      default: "issued",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokedReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Certificate", certificateSchema);
