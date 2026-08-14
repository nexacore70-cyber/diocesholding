const mongoose = require("mongoose");

const assessmentAttemptSchema = new mongoose.Schema(
  {
    // ======================================
    // Assessment
    // ======================================
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },

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
    // Enrollment
    // ======================================
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    // ======================================
    // Attempt Number
    // ======================================
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    // ======================================
    // Exact Questions Given
    // ======================================
    questionSet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssessmentQuestion",
        required: true,
      },
    ],

    // ======================================
    // Answers
    // ======================================
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
          min: 0,
        },
      },
    ],

    // ======================================
    // Timing
    // ======================================
    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Scoring
    // ======================================
    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Cooldown
    // ======================================
    cooldownUntil: {
      type: Date,
      default: null,
      index: true,
    },

    // ======================================
    // Status
    // ======================================
    status: {
      type: String,
      enum: [
        "in_progress",
        "submitted",
        "graded",
        "expired",
      ],
      default: "in_progress",
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

assessmentAttemptSchema.index({
  assessment: 1,
  student: 1,
  attemptNumber: 1,
}, {
  unique: true,
});

assessmentAttemptSchema.index({
  assessment: 1,
  student: 1,
  status: 1,
});

assessmentAttemptSchema.index({
  student: 1,
  createdAt: -1,
});

// Only one active attempt at a time
assessmentAttemptSchema.index(
  {
    assessment: 1,
    student: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "in_progress",
    },
  },
);

module.exports = mongoose.model(
  "AssessmentAttempt",
  assessmentAttemptSchema,
);