const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    submissionText: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    driveUrl: {
      type: String,
      default: "",
    },

    submittedFiles: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
      },
    ],

    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
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

    status: {
      type: String,
      enum: ["submitted", "graded", "returned", "late"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate submissions
assignmentSubmissionSchema.index(
  {
    assignment: 1,
    student: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema,
);
