const mongoose = require("mongoose");

// ======================================
// Lesson Progress Schema
// ======================================

const lessonProgressSchema = new mongoose.Schema(
  {
    // ======================================
    // Student
    // ======================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required."],
      index: true,
    },

    // ======================================
    // Enrollment
    // ======================================

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: [true, "Enrollment is required."],
      index: true,
    },

    // ======================================
    // Lesson
    // ======================================

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required."],
      index: true,
    },

    // ======================================
    // Completion
    // ======================================

    completed: {
      type: Boolean,
      default: false,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Video Watch Progress
    // ======================================

    watchPercentage: {
      type: Number,
      default: 0,
      min: [0, "Watch percentage cannot be below 0."],
      max: [100, "Watch percentage cannot exceed 100."],
      validate: {
        validator: Number.isFinite,
        message: "Watch percentage must be a valid number.",
      },
    },
  },
  {
    timestamps: true,

    strict: true,

    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ======================================
// Prevent Duplicate Progress
// ======================================

lessonProgressSchema.index(
  {
    student: 1,
    enrollment: 1,
    lesson: 1,
  },
  {
    unique: true,
    name: "unique_student_enrollment_lesson_progress",
  },
);

// ======================================
// Fast Enrollment Progress Queries
// ======================================

lessonProgressSchema.index({
  enrollment: 1,
  completed: 1,
});

// ======================================
// Fast Student Progress Queries
// ======================================

lessonProgressSchema.index({
  student: 1,
  completed: 1,
});

// ======================================
// Completion Consistency
// ======================================

lessonProgressSchema.pre("validate", function (next) {
  if (this.completed === true) {
    if (!this.completedAt) {
      this.completedAt = new Date();
    }

    if (this.watchPercentage < 0) {
      this.watchPercentage = 0;
    }

    if (this.watchPercentage > 100) {
      this.watchPercentage = 100;
    }
  }

  if (this.completed === false) {
    this.completedAt = null;
  }

  next();
});

// ======================================
// Model
// ======================================

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);