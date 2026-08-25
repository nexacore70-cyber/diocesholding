const mongoose = require("mongoose");

const cohortSchema = new mongoose.Schema(
  {
    // ======================================
    // Cohort Identity
    // ======================================
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    // ======================================
    // Cohort Type
    // ======================================
    type: {
      type: String,
      enum: ["course", "bootcamp", "internship", "training"],
      default: "course",
      index: true,
    },

    // ======================================
    // Course
    // ======================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
      index: true,
    },

    // ======================================
    // Track
    // ======================================
    track: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    // ======================================
    // Tutors
    // ======================================
    primaryTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    tutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ======================================
    // Capacity
    // ======================================
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 10000,
      default: 30,
    },

    // ======================================
    // Dates
    // ======================================
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // ======================================
    // Status
    // ======================================
    status: {
      type: String,
      enum: [
        "draft",
        "open",
        "active",
        "completed",
        "cancelled",
        "closed",
      ],
      default: "draft",
      index: true,
    },

    // ======================================
    // Visibility
    // ======================================
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    // ======================================
    // Settings
    // ======================================
    settings: {
      allowLateEnrollment: {
        type: Boolean,
        default: false,
      },

      allowStudentTransfer: {
        type: Boolean,
        default: false,
      },

      requireTutorApproval: {
        type: Boolean,
        default: false,
      },
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

    // ======================================
    // Soft Delete
    // ======================================
    isDeleted: {
      type: Boolean,
      default: false,
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

cohortSchema.index({
  course: 1,
  status: 1,
});

cohortSchema.index({
  primaryTutor: 1,
  status: 1,
});

cohortSchema.index({
  type: 1,
  status: 1,
});

cohortSchema.index({
  createdBy: 1,
  createdAt: -1,
});

// ======================================
// Validation
// ======================================

cohortSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate) {
    if (this.endDate <= this.startDate) {
      return next(
        new Error("Cohort end date must be after the start date."),
      );
    }
  }

  if (this.type === "course" && !this.course) {
    return next(
      new Error("Course is required for a course cohort."),
    );
  }

  next();
});

// ======================================
// Export
// ======================================

module.exports = mongoose.model("Cohort", cohortSchema);