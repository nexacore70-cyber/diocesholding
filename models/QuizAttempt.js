const mongoose = require("mongoose");

// ======================================
// Constants
// ======================================

const QUIZ_ATTEMPT_STATUSES = [
  "in_progress",
  "submitted",
  "graded",
];

// ======================================
// Answer Schema
// ======================================

const quizAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question is required."],
    },

    selectedAnswer: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        5000,
        "Selected answer cannot exceed 5,000 characters.",
      ],
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
    // ======================================
    // Quiz
    // ======================================

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz is required."],
      index: true,
    },

    // ======================================
    // Student
    // ======================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required."],
      index: true,
    },

    // ======================================
    // Enrollment
    // ======================================

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: [true, "Enrollment is required."],
      index: true,
    },

    // ======================================
    // Attempt Number
    // ======================================

    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
      min: [
        1,
        "Attempt number must be at least 1.",
      ],
      validate: {
        validator: Number.isInteger,
        message: "Attempt number must be a whole number.",
      },
    },

    // ======================================
    // Answers
    // ======================================

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

    submittedAt: {
      type: Date,
      default: null,
    },

    timeSpent: {
      type: Number,
      default: 0,
      min: [
        0,
        "Time spent cannot be negative.",
      ],
      validate: {
        validator: Number.isFinite,
        message: "Time spent must be a valid number.",
      },
    },

    // ======================================
    // Scoring
    // ======================================

    score: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isFinite,
        message: "Score must be a valid number.",
      },
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isFinite,
        message: "Total marks must be a valid number.",
      },
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      validate: {
        validator: Number.isFinite,
        message: "Percentage must be a valid number.",
      },
    },

    passed: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Attempt Status
    // ======================================

    status: {
      type: String,
      enum: {
        values: QUIZ_ATTEMPT_STATUSES,
        message: "Invalid quiz attempt status.",
      },
      default: "in_progress",
      index: true,
    },

    // ======================================
    // Record Status
    // ======================================

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

// Student's attempts for a quiz
quizAttemptSchema.index({
  quiz: 1,
  student: 1,
});

// Enrollment attempts
quizAttemptSchema.index({
  enrollment: 1,
  createdAt: -1,
});

// Student attempt history
quizAttemptSchema.index({
  student: 1,
  createdAt: -1,
});

// Attempt number uniqueness
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

// Active attempt lookup
quizAttemptSchema.index({
  quiz: 1,
  student: 1,
  status: 1,
  isActive: 1,
  isDeleted: 1,
});

// ======================================
// Validation Hooks
// ======================================

quizAttemptSchema.pre("validate", function (next) {
  // ======================================
  // Submitted/Graded Consistency
  // ======================================

  if (
    (this.status === "submitted" || this.status === "graded") &&
    !this.submittedAt
  ) {
    this.submittedAt = new Date();
  }

  // ======================================
  // In-Progress Consistency
  // ======================================

  if (this.status === "in_progress") {
    this.submittedAt = null;
    this.passed = false;
  }

  // ======================================
  // Deleted Consistency
  // ======================================

  if (this.isDeleted === true) {
    this.isActive = false;

    if (!this.deletedAt) {
      this.deletedAt = new Date();
    }
  }

  if (this.isDeleted === false) {
    this.deletedAt = null;
  }

  // ======================================
  // Score Consistency
  // ======================================

  if (this.totalMarks === 0) {
    this.score = 0;
    this.percentage = 0;
    this.passed = false;
  }

  if (this.score > this.totalMarks) {
    return next(
      new Error("Quiz score cannot exceed total marks."),
    );
  }

  next();
});

// ======================================
// Export
// ======================================

module.exports = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema,
);