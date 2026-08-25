const mongoose = require("mongoose");

const Course = require("../models/Course");
const generateSlug = require("../utils/generateSlug");

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

const validateCourseId = (courseId) => {
  if (!isValidObjectId(courseId)) {
    throw createServiceError(
      "Invalid course identifier.",
      400,
    );
  }
};

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

// ======================================
// Generate Unique Slug
// ======================================

const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = normalizeString(generateSlug(title));

  if (!baseSlug) {
    throw createServiceError(
      "Unable to generate course slug.",
      400,
    );
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      slug,
      isDeleted: false,
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingCourse = await Course.findOne(query)
      .select("_id")
      .lean();

    if (!existingCourse) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// ======================================
// Validate User
// ======================================

const validateUser = (userId) => {
  if (!isValidObjectId(userId)) {
    throw createServiceError(
      "Invalid user identifier.",
      400,
    );
  }
};

// ======================================
// Create Course
// ======================================

const createCourse = async (courseData, userId) => {
  validateUser(userId);

  if (
    !courseData ||
    typeof courseData !== "object" ||
    Array.isArray(courseData)
  ) {
    throw createServiceError(
      "Invalid course data.",
      400,
    );
  }

  const title = normalizeString(courseData.title);

  if (!title) {
    throw createServiceError(
      "Course title is required.",
      400,
    );
  }

  const existingCourse = await Course.findOne({
    title,
    isDeleted: false,
  })
    .select("_id")
    .lean();

  if (existingCourse) {
    throw createServiceError(
      "A course with this title already exists.",
      409,
    );
  }

  const slug = await generateUniqueSlug(title);

  const course = await Course.create({
    ...courseData,
    title,
    slug,
    createdBy: userId,
  });

  return course;
};

// ======================================
// Get All Courses
// ======================================

const getAllCourses = async () => {
  const courses = await Course.find({
    isDeleted: false,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return courses;
};

// ======================================
// Get Course By ID
// ======================================

const getCourseById = async (courseId) => {
  validateCourseId(courseId);

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  }).lean();

  if (!course) {
    throw createServiceError(
      "Course not found.",
      404,
    );
  }

  return course;
};

// ======================================
// Get Course By Slug
// ======================================

const getCourseBySlug = async (slug) => {
  const normalizedSlug = normalizeString(slug);

  if (!normalizedSlug) {
    throw createServiceError(
      "Course slug is required.",
      400,
    );
  }

  const course = await Course.findOne({
    slug: normalizedSlug,
    isDeleted: false,
  }).lean();

  if (!course) {
    throw createServiceError(
      "Course not found.",
      404,
    );
  }

  return course;
};

// ======================================
// Update Course
// ======================================

const updateCourse = async (
  courseId,
  updateData,
  user,
) => {
  validateCourseId(courseId);

  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    throw createServiceError(
      "Invalid course data.",
      400,
    );
  }

  if (!user || !isValidObjectId(user._id)) {
    throw createServiceError(
      "Invalid user identifier.",
      400,
    );
  }

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw createServiceError(
      "Course not found.",
      404,
    );
  }

  // ======================================
  // Ownership Protection
  // ======================================

  const isAdmin = user.role === "admin";

  if (
    !isAdmin &&
    course.createdBy &&
    course.createdBy.toString() !==
      user._id.toString()
  ) {
    throw createServiceError(
      "You are not authorized to update this course.",
      403,
    );
  }

  // ======================================
  // Prevent Protected Field Injection
  // ======================================

  const protectedFields = [
    "_id",
    "createdBy",
    "slug",
    "isDeleted",
    "deletedAt",
    "createdAt",
    "updatedAt",
  ];

  for (const field of protectedFields) {
    delete updateData[field];
  }

  // ======================================
  // Title Change
  // ======================================

  if (updateData.title !== undefined) {
    const title = normalizeString(updateData.title);

    if (!title) {
      throw createServiceError(
        "Course title cannot be empty.",
        400,
      );
    }

    const duplicate = await Course.findOne({
      _id: { $ne: courseId },
      title,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    if (duplicate) {
      throw createServiceError(
        "A course with this title already exists.",
        409,
      );
    }

    updateData.title = title;

    updateData.slug =
      await generateUniqueSlug(
        title,
        courseId,
      );
  }

  // ======================================
  // Apply Update
  // ======================================

  Object.assign(course, updateData);

  await course.save();

  return course;
};

// ======================================
// Delete Course
// ======================================

const deleteCourse = async (
  courseId,
  user,
) => {
  validateCourseId(courseId);

  if (!user || !isValidObjectId(user._id)) {
    throw createServiceError(
      "Invalid user identifier.",
      400,
    );
  }

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw createServiceError(
      "Course not found.",
      404,
    );
  }

  const isAdmin = user.role === "admin";

  if (
    !isAdmin &&
    course.createdBy &&
    course.createdBy.toString() !==
      user._id.toString()
  ) {
    throw createServiceError(
      "You are not authorized to delete this course.",
      403,
    );
  }

  course.isDeleted = true;

  if ("deletedAt" in course) {
    course.deletedAt = new Date();
  }

  await course.save();

  return course;
};

// ======================================
// Restore Course
// ======================================

const restoreCourse = async (
  courseId,
  user,
) => {
  validateCourseId(courseId);

  if (!user || !isValidObjectId(user._id)) {
    throw createServiceError(
      "Invalid user identifier.",
      400,
    );
  }

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: true,
  });

  if (!course) {
    throw createServiceError(
      "Deleted course not found.",
      404,
    );
  }

  const isAdmin = user.role === "admin";

  if (
    !isAdmin &&
    course.createdBy &&
    course.createdBy.toString() !==
      user._id.toString()
  ) {
    throw createServiceError(
      "You are not authorized to restore this course.",
      403,
    );
  }

  course.isDeleted = false;

  if ("deletedAt" in course) {
    course.deletedAt = null;
  }

  await course.save();

  return course;
};

// ======================================
// Export
// ======================================

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  restoreCourse,
};