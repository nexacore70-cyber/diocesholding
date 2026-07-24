const LessonProgress = require("../models/LessonProgress");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Enrollment = require("../models/Enrollment");

// Mark Lesson as Completed
const completeLesson = async (lessonId, studentId, watchPercentage = 100) => {
  // Find lesson
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  // Find module
  const moduleData = await Module.findById(lesson.module);

  if (!moduleData) {
    throw new Error("Module not found.");
  }

  // Check enrollment
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: moduleData.course,
    status: "active",
  });

  if (!enrollment) {
    throw new Error("You are not enrolled in this course.");
  }

  // Prevent duplicate completion
  const existingProgress = await LessonProgress.findOne({
    student: studentId,
    lesson: lessonId,
  });

  if (existingProgress && existingProgress.completed) {
    throw new Error("Lesson already completed.");
  }

  // Video lessons require at least 90% watched
  if (lesson.lessonType === "video" && watchPercentage < 90) {
    throw new Error("You must watch at least 90% of the lesson.");
  }

  // Create or update lesson progress
  const progress =
    existingProgress ||
    new LessonProgress({
      student: studentId,
      enrollment: enrollment._id,
      lesson: lessonId,
    });

  progress.completed = true;
  progress.completedAt = new Date();
  progress.watchPercentage = watchPercentage;

  await progress.save();

  // =====================================
  // Calculate Course Progress
  // =====================================

  // Get all modules in this course
  const moduleIds = await Module.find({
    course: moduleData.course,
  }).distinct("_id");

  // Count total lessons
  const totalLessons = await Lesson.countDocuments({
    module: { $in: moduleIds },
  });

  // Count completed lessons
  const completedLessons = await LessonProgress.countDocuments({
    student: studentId,
    enrollment: enrollment._id,
    completed: true,
  });

  // Calculate progress percentage
  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  // =====================================
  // Update Enrollment
  // =====================================

  enrollment.progress = progressPercentage;

  // Automatically mark course as completed
  if (progressPercentage >= 100) {
    enrollment.status = "completed";
    enrollment.completedAt = new Date();
  }

  await enrollment.save();

  return {
    success: true,
    message: "Lesson completed successfully.",
    data: {
      lessonProgress: progress,
      enrollment,
      completedLessons,
      totalLessons,
      progress: progressPercentage,
    },
  };
};

module.exports = {
  completeLesson,
};
