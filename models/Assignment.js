const mongoose = require("mongoose");

const assignmentAttachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },

    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    _id: false,
  },
);

const assignmentSchema = new mongoose.Schema(
  {
    // ======================================
    // Lesson
    // ======================================
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },

    // ======================================
    // Module
    // ======================================
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },

    // ======================================
    // Course
    // ======================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
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
      required: true,
      default: 100,
      min: 1,
      max: 100000,
    },

    // ======================================
    // Passing Score
    // ======================================
    passingScore: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
      max: 100000,
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
      index: true,
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
    // Bytes
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
      index: true,
    },

    // ======================================
    // Tutor Resources
    // ======================================
    attachments: {
      type: [assignmentAttachmentSchema],
      default: [],
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
  },
);

// ======================================
// Validation
// ======================================

assignmentSchema.pre("validate", function (next) {
  if (
    this.maxScore !== undefined &&
    this.passingScore !== undefined &&
    this.passingScore > this.maxScore
  ) {
    return next(
      new Error("Passing score cannot exceed maximum score."),
    );
  }

  if (this.dueDate && Number.isNaN(this.dueDate.getTime())) {
    return next(new Error("Invalid assignment due date."));
  }

  next();
});

// ======================================
// Indexes
// ======================================

// Course + lesson
assignmentSchema.index({
  course: 1,
  lesson: 1,
});

// Course + status
assignmentSchema.index({
  course: 1,
  status: 1,
});

// Lesson + status
assignmentSchema.index({
  lesson: 1,
  status: 1,
});

// Module + status
assignmentSchema.index({
  module: 1,
  status: 1,
});

// Prevent duplicate assignment titles
// within the same lesson.
assignmentSchema.index(
  {
    lesson: 1,
    title: 1,
  },
  {
    unique: true,
  },
);

// ======================================
// Export
// ======================================

module.exports = mongoose.model("Assignment", assignmentSchema);