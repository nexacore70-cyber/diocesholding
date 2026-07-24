const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    instructions: {
      type: String,
      default: "",
    },

    maxScore: {
      type: Number,
      default: 100,
      min: 1,
    },

    passingScore: {
      type: Number,
      default: 50,
      min: 0,
    },

    dueDate: {
      type: Date,
    },

    submissionType: {
      type: String,
      enum: ["text", "file", "github", "link", "mixed"],
      default: "mixed",
    },

    allowedFileTypes: [
      {
        type: String,
      },
    ],

    maxFileSize: {
      type: Number,
      default: 10485760, // 10 MB
    },

    allowResubmission: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },

    attachments: [
      {
        name: String,
        url: String,
      },
    ],

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

module.exports = mongoose.model("Assignment", assignmentSchema);
