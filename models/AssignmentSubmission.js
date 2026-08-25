const mongoose = require("mongoose");

const submittedFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    fileType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },

    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    // ======================================
    // Assignment
    // ======================================
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },

    // ======================================
    // Student
    // ======================================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ======================================
    // Enrollment
    // ======================================
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    // ======================================
    // Current Submission Attempt
    // ======================================
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    // ======================================
    // Student Text Answer
    // ======================================
    submissionText: {
      type: String,
      trim: true,
      maxlength: 50000,
      default: "",
    },

    // ======================================
    // GitHub Repository
    // ======================================
    githubUrl: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // ======================================
    // External Drive / Link
    // ======================================
    driveUrl: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // ======================================
    // Uploaded Files
    // ======================================
    submittedFiles: {
      type: [submittedFileSchema],
      default: [],
    },

    // ======================================
    // Submission Times
    // ======================================
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    lastSubmittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // ======================================
    // Late Submission
    // ======================================
    isLate: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ======================================
    // Score
    // ======================================
    score: {
      type: Number,
      default: null,
      min: 0,
    },

    // ======================================
    // Passed
    // ======================================
    passed: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Tutor Feedback
    // ======================================
    feedback: {
      type: String,
      trim: true,
      maxlength: 20000,
      default: "",
    },

    // ======================================
    // Internal Grading Remarks
    // ======================================
    gradingRemarks: {
      type: String,
      trim: true,
      maxlength: 20000,
      default: "",
    },

    // ======================================
    // Future AI Plagiarism Score
    // ======================================
    plagiarismScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    // ======================================
    // Graded By
    // ======================================
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ======================================
    // Graded At
    // ======================================
    gradedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Submission Status
    // ======================================
    status: {
      type: String,
      enum: ["submitted", "graded", "returned", "late"],
      default: "submitted",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Indexes
// ======================================

// One current submission per
// student per assignment.
assignmentSubmissionSchema.index(
  {
    assignment: 1,
    student: 1,
  },
  {
    unique: true,
  },
);

// Student submission history
assignmentSubmissionSchema.index({
  student: 1,
  status: 1,
  createdAt: -1,
});

// Assignment grading queue
assignmentSubmissionSchema.index({
  assignment: 1,
  status: 1,
  createdAt: -1,
});

// Tutor grading queries
assignmentSubmissionSchema.index({
  gradedBy: 1,
  gradedAt: -1,
});

// Enrollment submissions
assignmentSubmissionSchema.index({
  enrollment: 1,
  createdAt: -1,
});

// ======================================
// Export
// ======================================

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema,
);