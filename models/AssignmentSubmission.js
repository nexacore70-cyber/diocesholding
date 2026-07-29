const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
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

    lastSubmittedAt: {
      type: Date,
      default: Date.now,
    },

    // Submission attempt
    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Student text answer
    submissionText: {
      type: String,
      trim: true,
      default: "",
    },

    // GitHub Repository
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // Google Drive / OneDrive / Dropbox etc.
    driveUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // Uploaded files
    submittedFiles: [
      {
        fileName: {
          type: String,
          trim: true,
        },

        fileUrl: {
          type: String,
          trim: true,
        },

        fileType: {
          type: String,
          trim: true,
        },

        fileSize: Number,
      },
    ],

    // Marks awarded
    score: {
      type: Number,
      default: null,
      min: 0,
    },

    // Passed assignment?
    passed: {
      type: Boolean,
      default: false,
    },

    // Tutor feedback
    feedback: {
      type: String,
      trim: true,
      default: "",
    },

    // Internal grading remarks
    gradingRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    // AI plagiarism score (future)
    plagiarismScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    gradedAt: {
      type: Date,
      default: null,
    },

    // Was submission late?
    isLate: {
      type: Boolean,
      default: false,
    },

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

// One active submission per assignment/student
assignmentSubmissionSchema.index(
  {
    assignment: 1,
    student: 1,
  },
  {
    unique: true,
  },
);

// Useful indexes
assignmentSubmissionSchema.index({
  student: 1,
  status: 1,
});

assignmentSubmissionSchema.index({
  assignment: 1,
  status: 1,
});

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema,
);
