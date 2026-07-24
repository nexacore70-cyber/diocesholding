const { createCourse } = require("../services/courseService");

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Tutor/Admin)
const createNewCourse = async (req, res) => {
  try {
    const result = await createCourse(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create course.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createNewCourse,
};
