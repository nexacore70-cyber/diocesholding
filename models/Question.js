const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    // Quiz
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    // Question
    question: {
      type: String,
      required: true,
      trim: true,
    },

    // Type
    questionType: {
      type: String,
      enum: ["multiple_choice", "true_false", "short_answer", "essay"],
      default: "multiple_choice",
    },

    // Options (For MCQ & True/False)
    options: [
      {
        type: String,
        trim: true,
      },
    ],

    // Correct Answer
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Explanation after grading
    explanation: {
      type: String,
      trim: true,
      default: "",
    },

    // Marks
    points: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Display Order
    order: {
      type: Number,
      default: 1,
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // Creator
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

// ======================================
// Validation
// ======================================

questionSchema.pre("validate", function (next) {
  if (this.questionType === "multiple_choice") {
    if (!this.options || this.options.length < 2) {
      return next(
        new Error("Multiple choice questions must have at least two options."),
      );
    }
  }

  if (this.questionType === "true_false") {
    this.options = ["True", "False"];

    if (this.correctAnswer !== "True" && this.correctAnswer !== "False") {
      return next(
        new Error("True/False questions must use 'True' or 'False'."),
      );
    }
  }

  next();
});

// ======================================
// Indexes
// ======================================

questionSchema.index({
  quiz: 1,
  order: 1,
});

module.exports = mongoose.model("Question", questionSchema);
