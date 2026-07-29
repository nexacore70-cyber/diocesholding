const mongoose = require("mongoose");

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
      default: 1,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },

        selectedAnswer: {
          type: String,
          default: "",
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

    timeSpent: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: {
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

    status: {
      type: String,
      enum: ["in_progress", "submitted", "graded"],
      default: "in_progress",
    },

    isActive: {
      type: Boolean,
      default: true,
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

quizAttemptSchema.index({
  quiz: 1,
  student: 1,
});

quizAttemptSchema.index({
  enrollment: 1,
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
