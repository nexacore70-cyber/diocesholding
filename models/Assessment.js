const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    // ======================================
    // Course
    // ======================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
      index: true,
    },

    // ======================================
    // Basic Information
    // ======================================
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
      maxlength: 10000,
    },

    // ======================================
    // Assessment Rules
    // ======================================
    passingScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },

    timeLimit: {
      type: Number,
      default: 30,
      min: 1,
      max: 600,
    },

    totalQuestions: {
      type: Number,
      default: 50,
      min: 1,
      max: 500,
    },

    maxAttempts: {
      type: Number,
      default: 3,
      min: 1,
      max: 20,
    },

    cooldownDays: {
      type: Number,
      default: 30,
      min: 0,
      max: 3650,
    },

    randomizeQuestions: {
      type: Boolean,
      default: true,
    },

    showResultImmediately: {
      type: Boolean,
      default: true,
    },

    certificateRequired: {
      type: Boolean,
      default: true,
    },

    // ======================================
    // Status
    // ======================================
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    // ======================================
    // Creator
    // ======================================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ======================================
// Indexes
// ======================================

assessmentSchema.index({
  status: 1,
  createdAt: -1,
});

assessmentSchema.index({
  course: 1,
  status: 1,
});

module.exports = mongoose.model("Assessment", assessmentSchema);