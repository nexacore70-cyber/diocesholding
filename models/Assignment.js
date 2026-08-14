const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // ======================================
    // Lesson
    // ======================================
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    // ======================================
    // Module
    // ======================================
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    // ======================================
    // Course
    // ======================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // ======================================
    // Assignment Title
    // ======================================
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    // ======================================
    // Description
    // ======================================
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 10000,
    },

    // ======================================
    // Instructions
    // ======================================
    instructions: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    // ======================================
    // Maximum Score
    // ======================================
    maxScore: {
      type: Number,
      default: 100,
      min: 1,
      max: 100000,
    },

    // ======================================
    // Passing Score
    // ======================================
    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100000,
      validate: {
        validator: function (value) {
          return value <= this.maxScore;
        },
        message: "Passing score cannot exceed maximum score.",
      },
    },

    // ======================================
    // Due Date
    // ======================================
    dueDate: {
      type: Date,
      default: null,
    },

    // ======================================
    // Submission Type
    // ======================================
    submissionType: {
      type: String,
      enum: ["text", "file", "github", "link", "mixed"],
      default: "mixed",
    },

    // ======================================
    // Allowed File Types
    // ======================================
    allowedFileTypes: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
          maxlength: 50,
        },
      ],
      default: [],
    },

    // ======================================
    // Maximum Upload Size
    // ======================================
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024,
      min: 1,
      max: 100 * 1024 * 1024,
    },

    // ======================================
    // Student Resubmission
    // ======================================
    allowResubmission: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Assignment Status
    // ======================================
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },

    // ======================================
    // Tutor Resources
    // ======================================
    attachments: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
          },

          url: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
          },
        },
      ],
      default: [],
    },

    // ======================================
    // Creator
    // ======================================
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
// Indexes
// ======================================

// Course assignments
assignmentSchema.index({
  course: 1,
  lesson: 1,
});

// Course + status queries
assignmentSchema.index({
  course: 1,
  status: 1,
});

// Creator queries
assignmentSchema.index({
  createdBy: 1,
});

// Lesson assignments
assignmentSchema.index({
  lesson: 1,
});

// Module assignments
assignmentSchema.index({
  module: 1,
});

// ======================================
// Export
// ======================================

module.exports = mongoose.model("Assignment", assignmentSchema);
