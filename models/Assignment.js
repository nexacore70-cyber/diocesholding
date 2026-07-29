const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // Lesson
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },

    // Module
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },

    // Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // Assignment Title
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // Description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Instructions
    instructions: {
      type: String,
      trim: true,
      default: "",
    },

    // Maximum Score
    maxScore: {
      type: Number,
      default: 100,
      min: 1,
    },

    // Passing Score
    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.maxScore;
        },
        message: "Passing score cannot exceed maximum score.",
      },
    },

    // Due Date
    dueDate: {
      type: Date,
      default: null,
    },

    // Submission Type
    submissionType: {
      type: String,
      enum: ["text", "file", "github", "link", "mixed"],
      default: "mixed",
    },

    // Allowed File Types
    allowedFileTypes: [
      {
        type: String,
        trim: true,
      },
    ],

    // Maximum Upload Size (Bytes)
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10 MB
    },

    // Can student resubmit?
    allowResubmission: {
      type: Boolean,
      default: false,
    },

    // Assignment Status
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
      index: true,
    },

    // Tutor Resources
    attachments: [
      {
        name: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },
      },
    ],

    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes
assignmentSchema.index({ course: 1, lesson: 1 });
assignmentSchema.index({ course: 1, status: 1 });
assignmentSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);
