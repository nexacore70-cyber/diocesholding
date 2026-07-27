const Course = require("../models/Course");
const generateSlug = require("../utils/generateSlug");

// ======================================
// Create Course
// ======================================
const createCourse = async (courseData, tutorId) => {
  if (!courseData.title) {
    throw new Error("Course title is required.");
  }

  let slug = generateSlug(courseData.title);

  let existingCourse = await Course.findOne({ slug });

  let counter = 1;

  while (existingCourse) {
    slug = `${generateSlug(courseData.title)}-${counter}`;
    existingCourse = await Course.findOne({ slug });
    counter++;
  }

  const course = await Course.create({
    ...courseData,

    thumbnail: {
      url: courseData.thumbnail?.url || "",
      filename: courseData.thumbnail?.filename || "",
      originalName: courseData.thumbnail?.originalName || "",
    },

    slug,
    tutor: tutorId,
  });

  return {
    success: true,
    message: "Course created successfully.",
    data: course,
  };
};

// ======================================
// Get All Courses
// ======================================
const getAllCourses = async () => {
  return Course.find({ isDeleted: false })
    .populate("tutor", "firstName lastName email")
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

// ======================================
// Get Course By ID
// ======================================
const getCourseById = async (courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  })
    .populate("tutor", "firstName lastName email")
    .populate("category", "name slug");

  if (!course) {
    throw new Error("Course not found.");
  }

  return course;
};

// ======================================
// Get Course By Slug
// ======================================
const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({
    slug,
    isDeleted: false,
  })
    .populate("tutor", "firstName lastName email")
    .populate("category", "name slug");

  if (!course) {
    throw new Error("Course not found.");
  }

  return course;
};

// ======================================
// Update Course
// ======================================
const updateCourse = async (courseId, updateData) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  if (updateData.title && updateData.title !== course.title) {
    let slug = generateSlug(updateData.title);

    let existingCourse = await Course.findOne({
      slug,
      _id: { $ne: courseId },
    });

    let counter = 1;

    while (existingCourse) {
      slug = `${generateSlug(updateData.title)}-${counter}`;
      existingCourse = await Course.findOne({
        slug,
        _id: { $ne: courseId },
      });
      counter++;
    }

    course.slug = slug;
  }

  if (updateData.thumbnail) {
    course.thumbnail = {
      url: updateData.thumbnail.url || "",
      filename: updateData.thumbnail.filename || "",
      originalName: updateData.thumbnail.originalName || "",
    };
  }

  Object.assign(course, {
    ...updateData,
    thumbnail: course.thumbnail,
  });

  await course.save();

  return course;
};

// ======================================
// Delete Course (Soft Delete)
// ======================================
const deleteCourse = async (courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  course.isDeleted = true;

  await course.save();

  return course;
};

// ======================================
// Restore Course
// ======================================
const restoreCourse = async (courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: true,
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  course.isDeleted = false;

  await course.save();

  return course;
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  restoreCourse,
};