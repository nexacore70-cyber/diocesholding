const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
    },

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
    },

    totalQuestions: {
      type: Number,
      default: 50,
      min: 1,
    },

    maxAttempts: {
      type: Number,
      default: 3,
      min: 1,
    },

    cooldownDays: {
      type: Number,
      default: 30,
      min: 0,
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

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Assessment", assessmentSchema);