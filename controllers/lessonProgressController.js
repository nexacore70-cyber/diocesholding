const mongoose = require("mongoose");

const {
  completeLesson,
} = require("../services/lessonProgressService");

// ======================================
// Helpers
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const handleControllerError = (
  res,
  error,
  fallbackMessage,
) => {
  console.error("Lesson Progress Controller Error:", error);

  // ======================================
  // Mongoose Validation Error
  // ======================================

  if (error.name === "ValidationError") {
    const message =
      Object.values(error.errors)[0]?.message ||
      "Invalid request data.";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  // ======================================
  // Mongoose Cast Error
  // ======================================

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid identifier.",
    });
  }

  // ======================================
  // Duplicate Key
  // ======================================

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Lesson progress already exists.",
    });
  }

  // ======================================
  // Service Error
  // ======================================

  if (
    error.statusCode &&
    error.statusCode >= 400 &&
    error.statusCode < 500
  ) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // ======================================
  // Unknown Error
  // ======================================

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================
// Complete Student Lesson
// @desc    Mark lesson as completed
// @route   POST /api/lesson-progress/:lessonId/complete
// @access  Student
// ======================================

const completeStudentLesson = async (req, res) => {
  try {
    // ======================================
    // Authentication
    // ======================================

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // ======================================
    // Validate Lesson ID
    // ======================================

    const { lessonId } = req.params;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson identifier.",
      });
    }

    // ======================================
    // Validate Request Body
    // ======================================

    const body = req.body || {};

    if (
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body.",
      });
    }

    // ======================================
    // Complete Lesson
    // ======================================

    const result = await completeLesson(
      lessonId,
      req.user._id,
      body.watchPercentage,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to complete lesson.",
    );
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  completeStudentLesson,
};