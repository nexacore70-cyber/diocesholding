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
    },

    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    maxAttempts: {
      type: Number,
      default: 1,
    },

    shuffleQuestions: {
      type: Boolean,
      default: false,
    },

    showCorrectAnswers: {
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

module.exports = mongoose.model("Quiz", quizSchema);
