const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

// ======================================
// Create Lesson
// ======================================
const createLesson = async (lessonData, userId) => {
  if (!lessonData.title) {
    throw new Error("Lesson title is required.");
  }

  if (!lessonData.module) {
    throw new Error("Module ID is required.");
  }

  const module = await Module.findOne({
    _id: lessonData.module,
    isDeleted: false,
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  const lastLesson = await Lesson.findOne({
    module: lessonData.module,
    isDeleted: false,
  }).sort({ order: -1 });

  const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  const lesson = await Lesson.create({
    ...lessonData,

    video: {
      url: lessonData.video?.url || "",
      filename: lessonData.video?.filename || "",
      originalName: lessonData.video?.originalName || "",
    },

    document: {
      url: lessonData.document?.url || "",
      filename: lessonData.document?.filename || "",
      originalName: lessonData.document?.originalName || "",
    },

    resource: {
      url: lessonData.resource?.url || "",
      filename: lessonData.resource?.filename || "",
      originalName: lessonData.resource?.originalName || "",
    },

    order: nextOrder,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Lesson created successfully.",
    data: lesson,
  };
};

// ======================================
// Get All Lessons
// ======================================
const getAllLessons = async () => {
  const lessons = await Lesson.find({
    isDeleted: false,
  })
    .populate("module", "title order")
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    message: "Lessons retrieved successfully.",
    data: lessons,
  };
};

// ======================================
// Get Lesson By ID
// ======================================
const getLessonById = async (lessonId) => {
  const lesson = await Lesson.findOne({
    _id: lessonId,
    isDeleted: false,
  }).populate("module", "title order");

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  return {
    success: true,
    message: "Lesson retrieved successfully.",
    data: lesson,
  };
};

// ======================================
// Update Lesson
// ======================================
const updateLesson = async (lessonId, updateData) => {
  const lesson = await Lesson.findOne({
    _id: lessonId,
    isDeleted: false,
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  if (updateData.video) {
    lesson.video = {
      url: updateData.video.url || "",
      filename: updateData.video.filename || "",
      originalName: updateData.video.originalName || "",
    };
  }

  if (updateData.document) {
    lesson.document = {
      url: updateData.document.url || "",
      filename: updateData.document.filename || "",
      originalName: updateData.document.originalName || "",
    };
  }

  if (updateData.resource) {
    lesson.resource = {
      url: updateData.resource.url || "",
      filename: updateData.resource.filename || "",
      originalName: updateData.resource.originalName || "",
    };
  }

  Object.assign(lesson, {
    ...updateData,
    video: lesson.video,
    document: lesson.document,
    resource: lesson.resource,
  });

  await lesson.save();

  await lesson.populate("module", "title order");

  return {
    success: true,
    message: "Lesson updated successfully.",
    data: lesson,
  };
};

// ======================================
// Delete Lesson (Soft Delete)
// ======================================
const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findOne({
    _id: lessonId,
    isDeleted: false,
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  lesson.isDeleted = true;

  await lesson.save();

  return {
    success: true,
    message: "Lesson deleted successfully.",
  };
};

// ======================================
// Restore Lesson
// ======================================
const restoreLesson = async (lessonId) => {
  const lesson = await Lesson.findOne({
    _id: lessonId,
    isDeleted: true,
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  lesson.isDeleted = false;

  await lesson.save();

  return {
    success: true,
    message: "Lesson restored successfully.",
    data: lesson,
  };
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  restoreLesson,
};