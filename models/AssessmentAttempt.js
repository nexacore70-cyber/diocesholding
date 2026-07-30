const mongoose = require("mongoose");

const assessmentAttemptSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AssessmentQuestion",
          required: true,
        },

        selectedAnswer: {
          type: mongoose.Schema.Types.Mixed,
          default: null,
        },

        isCorrect: {
          type: Boolean,
          default: false,
        },

        pointsAwarded: {
          type: Number,
          default: 0,
        },
      },
    ],

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    score: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    cooldownUntil: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["in_progress", "submitted", "graded", "expired"],
      default: "in_progress",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AssessmentAttempt", assessmentAttemptSchema);
