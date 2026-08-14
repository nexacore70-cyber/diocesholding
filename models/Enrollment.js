const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "suspended"],
      default: "active",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Prevent Duplicate Enrollment
// ======================================

enrollmentSchema.index(
  {
    student: 1,
    course: 1,
  },
  {
    unique: true,
  },
);

// ======================================
// Useful Query Index
// ======================================

enrollmentSchema.index({
  student: 1,
  status: 1,
  createdAt: -1,
});

enrollmentSchema.index({
  course: 1,
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
