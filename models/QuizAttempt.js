const mongoose = require("mongoose");

// ======================================
// Constants
// ======================================

const QUIZ_ATTEMPT_STATUSES = [
  "in_progress",
  "submitted",
  "graded",
  "expired",
];

// ======================================
// Answer Schema
// ======================================

const quizAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
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
  {
    _id: false,
  },
);

// ======================================
// Quiz Attempt Schema
// ======================================

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Attempt number must be a whole number.",
      },
    },

    // Questions assigned to this attempt
    questionSet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    answers: {
      type: [quizAnswerSchema],
      default: [],
    },

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
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
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
    // Status
    // ======================================

    status: {
      type: String,
      enum: QUIZ_ATTEMPT_STATUSES,
      default: "in_progress",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,

    strict: true,

    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ======================================
// Indexes
// ======================================

quizAttemptSchema.index({
  quiz: 1,
  student: 1,
});

quizAttemptSchema.index({
  enrollment: 1,
  createdAt: -1,
});

quizAttemptSchema.index({
  student: 1,
  createdAt: -1,
});

quizAttemptSchema.index(
  {
    quiz: 1,
    student: 1,
    attemptNumber: 1,
  },
  {
    unique: true,
  },
);

quizAttemptSchema.index({
  quiz: 1,
  student: 1,
  status: 1,
  isActive: 1,
  isDeleted: 1,
});

// ======================================
// Validation
// ======================================

quizAttemptSchema.pre("validate", function (next) {
  // Submitted / graded / expired
  if (
    ["submitted", "graded", "expired"].includes(
      this.status,
    )
  ) {
    if (!this.submittedAt) {
      this.submittedAt = new Date();
    }

    this.isActive = false;
  }

  // In progress
  if (this.status === "in_progress") {
    this.submittedAt = null;
    this.passed = false;
    this.isActive = true;
  }

  // Deleted
  if (this.isDeleted) {
    this.isActive = false;

    if (!this.deletedAt) {
      this.deletedAt = new Date();
    }
  } else {
    this.deletedAt = null;
  }

  // Score validation
  if (this.totalMarks === 0) {
    this.score = 0;
    this.percentage = 0;
    this.passed = false;
  }

  if (this.score > this.totalMarks) {
    return next(
      new Error(
        "Quiz score cannot exceed total marks.",
      ),
    );
  }

  next();
});

module.exports = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema,
);