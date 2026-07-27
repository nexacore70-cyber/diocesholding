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
// Create Course
// ======================================
const createNewCourse = async (req, res) => {
  try {
    const result = await createCourse(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Course Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Course By ID
// ======================================
const getSingleCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Course By Slug
// ======================================
const getSingleCourseBySlug = async (req, res) => {
  try {
    const course = await getCourseBySlug(req.params.slug);

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Course
// ======================================
const updateExistingCourse = async (req, res) => {
  try {
    const course = await updateCourse(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Course
// ======================================
const removeCourse = async (req, res) => {
  try {
    const course = await deleteCourse(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Restore Course
// ======================================
const restoreDeletedCourse = async (req, res) => {
  try {
    const course = await restoreCourse(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Course restored successfully.",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewCourse,
  getCourses,
  getSingleCourse,
  getSingleCourseBySlug,
  updateExistingCourse,
  removeCourse,
  restoreDeletedCourse,
};
