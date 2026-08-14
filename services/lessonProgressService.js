const mongoose = require("mongoose");

const LessonProgress = require("../models/LessonProgress");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Enrollment = require("../models/Enrollment");

// ======================================
// Helpers
// ======================================

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeWatchPercentage = (value) => {
  // Default for omitted value.
  if (value === undefined || value === null || value === "") {
    return 100;
  }

  const percentage = Number(value);

  if (!Number.isFinite(percentage)) {
    throw createServiceError(
      "Watch percentage must be a valid number.",
      400,
    );
  }

  if (percentage < 0 || percentage > 100) {
    throw createServiceError(
      "Watch percentage must be between 0 and 100.",
      400,
    );
  }

  return Math.round(percentage * 100) / 100;
};

// ======================================
// Complete Lesson
// ======================================

const completeLesson = async (
  lessonId,
  studentId,
  watchPercentage = 100,
) => {
  // ======================================
  // Validate IDs
  // ======================================

  if (!isValidObjectId(lessonId)) {
    throw createServiceError(
      "Invalid lesson identifier.",
      400,
    );
  }

  if (!isValidObjectId(studentId)) {
    throw createServiceError(
      "Invalid student identifier.",
      400,
    );
  }

  const normalizedWatchPercentage =
    normalizeWatchPercentage(watchPercentage);

  // ======================================
  // Find Lesson
  // ======================================

  const lesson = await Lesson.findById(lessonId)
    .select("_id module lessonType")
    .lean();

  if (!lesson) {
    throw createServiceError(
      "Lesson not found.",
      404,
    );
  }

  // ======================================
  // Find Module
  // ======================================

  const moduleData = await Module.findById(lesson.module)
    .select("_id course")
    .lean();

  if (!moduleData) {
    throw createServiceError(
      "Module not found.",
      404,
    );
  }

  if (!moduleData.course) {
    throw createServiceError(
      "This lesson is not linked to a course.",
      400,
    );
  }

  // ======================================
  // Find Active Enrollment
  // ======================================

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: moduleData.course,
    status: "active",
  });

  if (!enrollment) {
    throw createServiceError(
      "You are not enrolled in this course.",
      403,
    );
  }

  // ======================================
  // Existing Progress
  // ======================================

  const existingProgress = await LessonProgress.findOne({
    student: studentId,
    enrollment: enrollment._id,
    lesson: lessonId,
  });

  if (existingProgress?.completed) {
    throw createServiceError(
      "Lesson already completed.",
      409,
    );
  }

  // ======================================
  // Video Completion Requirement
  // ======================================

  if (
    lesson.lessonType === "video" &&
    normalizedWatchPercentage < 90
  ) {
    throw createServiceError(
      "You must watch at least 90% of the lesson.",
      400,
    );
  }

  // ======================================
  // Create / Update Progress
  // ======================================

  const progress =
    existingProgress ||
    new LessonProgress({
      student: studentId,
      enrollment: enrollment._id,
      lesson: lessonId,
    });

  progress.completed = true;
  progress.completedAt = new Date();
  progress.watchPercentage = normalizedWatchPercentage;

  try {
    await progress.save();
  } catch (error) {
    // Handle duplicate creation race condition.
    if (error.code === 11000) {
      throw createServiceError(
        "Lesson progress already exists.",
        409,
      );
    }

    throw error;
  }

  // ======================================
  // Get All Modules In Course
  // ======================================

  const moduleIds = await Module.find({
    course: moduleData.course,
  }).distinct("_id");

  // ======================================
  // Count Total Lessons
  // ======================================

  const totalLessons = await Lesson.countDocuments({
    module: {
      $in: moduleIds,
    },
  });

  // ======================================
  // Count Completed Lessons
  // ======================================

  const completedLessons = await LessonProgress.countDocuments({
    student: studentId,
    enrollment: enrollment._id,
    completed: true,
    lesson: {
      $exists: true,
    },
  });

  // ======================================
  // Calculate Progress
  // ======================================

  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (completedLessons / totalLessons) * 100,
          ),
        );

  // ======================================
  // Update Enrollment
  // ======================================

  enrollment.progress = progressPercentage;

  if (progressPercentage >= 100) {
    enrollment.status = "completed";

    if (!enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }
  }

  await enrollment.save();

  // ======================================
  // Return Result
  // ======================================

  return {
    success: true,

    message:
      progressPercentage >= 100
        ? "Lesson completed successfully. Course completed."
        : "Lesson completed successfully.",

    data: {
      lessonProgress: progress,

      enrollment,

      completedLessons,

      totalLessons,

      progress: progressPercentage,

      courseCompleted:
        progressPercentage >= 100,
    },
  };
};

// ======================================
// Export
// ======================================

module.exports = {
  completeLesson,
};