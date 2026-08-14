const mongoose = require("mongoose");

const {
  startQuiz,
  submitQuiz,
  getQuizAttemptById,
  getStudentQuizAttempts,
} = require("../services/quizAttemptService");

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
  console.error(
    "Quiz Attempt Controller Error:",
    error,
  );

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
  // Cast Error
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
      message:
        "A conflicting quiz attempt already exists.",
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
    return res
      .status(error.statusCode)
      .json({
        success: false,
        message: error.message,
      });
  }

  // ======================================
  // Internal Server Error
  // ======================================

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================
// Start Quiz Attempt
// ======================================
// POST /api/quiz-attempts/quizzes/:quizId/start
// ======================================

const startQuizAttempt = async (
  req,
  res,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { quizId } = req.params;

    if (!isValidObjectId(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz identifier.",
      });
    }

    const result = await startQuiz(
      quizId,
      req.user._id,
    );

    return res.status(
      result.resumed ? 200 : 201,
    ).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to start quiz.",
    );
  }
};

// ======================================
// Submit Quiz Attempt
// ======================================
// POST /api/quiz-attempts/:attemptId/submit
// ======================================

const submitQuizAttempt = async (
  req,
  res,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { attemptId } = req.params;

    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid quiz attempt identifier.",
      });
    }

    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    const result = await submitQuiz(
      attemptId,
      req.user._id,
      answers,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to submit quiz.",
    );
  }
};

// ======================================
// Get Quiz Attempt
// ======================================
// GET /api/quiz-attempts/:attemptId
// ======================================

const getSingleQuizAttempt = async (
  req,
  res,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { attemptId } = req.params;

    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid quiz attempt identifier.",
      });
    }

    const result =
      await getQuizAttemptById(
        attemptId,
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch quiz attempt.",
    );
  }
};

// ======================================
// Get Student Quiz Attempts
// ======================================
// GET /api/quiz-attempts
// GET /api/quiz-attempts?quizId=...
// ======================================

const getMyQuizAttempts = async (
  req,
  res,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { quizId } = req.query;

    if (
      quizId &&
      !isValidObjectId(quizId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz identifier.",
      });
    }

    const result =
      await getStudentQuizAttempts(
        req.user._id,
        quizId,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch quiz attempts.",
    );
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  startQuizAttempt,
  submitQuizAttempt,
  getSingleQuizAttempt,
  getMyQuizAttempts,
};