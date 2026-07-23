const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    questionType: {
      type: String,
      enum: [
        "multiple_choice",
        "true_false",
        "short_answer",
        "essay",
      ],
      default: "multiple_choice",
    },

    options: [
      {
        type: String,
        trim: true,
      },
    ],

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    explanation: {
      type: String,
      trim: true,
      default: "",
    },

    points: {
      type: Number,
      default: 1,
      min: 1,
    },

    order: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
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
  }
);

module.exports = mongoose.model("Question", questionSchema);