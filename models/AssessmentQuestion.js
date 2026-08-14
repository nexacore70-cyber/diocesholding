const mongoose = require("mongoose");

const assessmentQuestionSchema = new mongoose.Schema(
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
    // Question
    // ======================================
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 10000,
    },

    // ======================================
    // Question Type
    // ======================================
    questionType: {
      type: String,
      enum: [
        "multiple_choice",
        "true_false",
        "short_answer",
        "essay",
      ],
      default: "multiple_choice",
      index: true,
    },

    // ======================================
    // Options
    // ======================================
    options: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      ],
      default: [],
    },

    // ======================================
    // Correct Answer
    // ======================================
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // ======================================
    // Explanation
    // ======================================
    explanation: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },

    // ======================================
    // Marks
    // ======================================
    points: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },

    // ======================================
    // Ordering
    // ======================================
    order: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ======================================
    // Status
    // ======================================
    status: {
      type: String,
      enum: ["draft", "published"],
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

assessmentQuestionSchema.index({
  assessment: 1,
  order: 1,
});

assessmentQuestionSchema.index({
  assessment: 1,
  status: 1,
});

assessmentQuestionSchema.index({
  assessment: 1,
  createdAt: -1,
});

// ======================================
// Validation
// ======================================

assessmentQuestionSchema.pre("validate", function (next) {
  if (this.questionType === "multiple_choice") {
    if (!Array.isArray(this.options) || this.options.length < 2) {
      return next(
        new Error(
          "Multiple-choice questions must have at least two options.",
        ),
      );
    }

    const correct = String(this.correctAnswer).trim();

    if (!this.options.some((option) => option === correct)) {
      return next(
        new Error(
          "The correct answer must match one of the question options.",
        ),
      );
    }
  }

  if (this.questionType === "true_false") {
    const normalized = String(this.correctAnswer)
      .trim()
      .toLowerCase();

    if (!["true", "false"].includes(normalized)) {
      return next(
        new Error(
          "True/false questions must have a correct answer of true or false.",
        ),
      );
    }
  }

  return next();
});

module.exports = mongoose.model(
  "AssessmentQuestion",
  assessmentQuestionSchema,
);