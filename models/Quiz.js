const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    instructions: {
      type: String,
      trim: true,
      default: "",
    },

    timeLimit: {
      type: Number,
      default: 30,
      min: 1,
    },

    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },

    shuffleQuestions: {
      type: Boolean,
      default: false,
    },

    shuffleAnswers: {
      type: Boolean,
      default: false,
    },

    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },

    allowReview: {
      type: Boolean,
      default: true,
    },

    availableFrom: {
      type: Date,
      default: null,
    },

    availableUntil: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "archived",
      ],
      default: "draft",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
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

quizSchema.index({
  lesson: 1,
  isDeleted: 1,
});

quizSchema.index({
  status: 1,
  isActive: 1,
  isDeleted: 1,
});

module.exports = mongoose.model(
  "Quiz",
  quizSchema,
);