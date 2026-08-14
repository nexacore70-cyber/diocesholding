const mongoose = require("mongoose");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  restoreCourse,
} = require("../services/courseService");

// ======================================
// Helper
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);

  if (error.name === "ValidationError") {
    const message =
      Object.values(error.errors)[0]?.message || "Invalid request data.";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid identifier.",
    });
  }

  if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A course with this information already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================
// Create Course
// ======================================

const createNewCourse = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await createCourse(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    return handleControllerError(res, error, "Unable to create course.");
  }
};

// ======================================
// Get All Courses
// ======================================

const getCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully.",
      data: courses,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch courses.");
  }
};

// ======================================
// Get Course By ID
// ======================================

const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course identifier.",
      });
    }

    const course = await getCourseById(id);

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch course.");
  }
};

// ======================================
// Get Course By Slug
// ======================================

const getSingleCourseBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim();

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Course slug is required.",
      });
    }

    const course = await getCourseBySlug(slug);

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch course.");
  }
};

// ======================================
// Update Course
// ======================================

const updateExistingCourse = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course identifier.",
      });
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course data.",
      });
    }

    const course = await updateCourse(id, req.body, req.user);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to update course.");
  }
};

// ======================================
// Delete Course
// ======================================

const removeCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course identifier.",
      });
    }

    const course = await deleteCourse(id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
      data: course,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to delete course.");
  }
};

// ======================================
// Restore Course
// ======================================

const restoreDeletedCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course identifier.",
      });
    }

    const course = await restoreCourse(id);

    return res.status(200).json({
      success: true,
      message: "Course restored successfully.",
      data: course,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to restore course.");
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  createNewCourse,
  getCourses,
  getSingleCourse,
  getSingleCourseBySlug,
  updateExistingCourse,
  removeCourse,
  restoreDeletedCourse,
};
