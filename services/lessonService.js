const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

// Create Lesson
const createLesson = async (lessonData, userId) => {
  if (!lessonData.title) {
    throw new Error("Lesson title is required.");
  }

  if (!lessonData.module) {
    throw new Error("Module ID is required.");
  }

  const module = await Module.findById(lessonData.module);

  if (!module) {
    throw new Error("Module not found.");
  }

  const lastLesson = await Lesson.findOne({
    module: lessonData.module,
  }).sort({ order: -1 });

  const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  const lesson = await Lesson.create({
    ...lessonData,
    order: nextOrder,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Lesson created successfully.",
    data: lesson,
  };
};

// Get All Lessons
const getAllLessons = async () => {
  const lessons = await Lesson.find()
    .populate("module", "title order")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Lessons retrieved successfully.",
    data: lessons,
  };
};

// Get Single Lesson
const getLessonById = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).populate(
    "module",
    "title order",
  );

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  return {
    success: true,
    message: "Lesson retrieved successfully.",
    data: lesson,
  };
};

// Update Lesson
const updateLesson = async (lessonId, updateData) => {
  const lesson = await Lesson.findByIdAndUpdate(lessonId, updateData, {
    new: true,
    runValidators: true,
  }).populate("module", "title order");

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  return {
    success: true,
    message: "Lesson updated successfully.",
    data: lesson,
  };
};

// Delete Lesson
const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  return {
    success: true,
    message: "Lesson deleted successfully.",
  };
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
