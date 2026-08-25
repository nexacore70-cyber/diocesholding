const {
  getStudentAttemptById,
  getStudentAssessmentAttempts,
  getAssessmentAttempts,
  getAttemptById,
} = require("../services/assessmentResultService");

// ======================================
// Student Result
// GET /api/assessment-results/attempt/:attemptId
// ======================================

const getStudentResult = async (req, res) => {
  try {
    const result = await getStudentAttemptById(
      req.params.attemptId,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Student Result Error:",
      error,
    );

    const message =
      error.message ||
      "Unable to fetch assessment result.";

    if (
      message.toLowerCase().includes("not found")
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

// ======================================
// Student History
// GET /api/assessment-results/assessment/:assessmentId
// ======================================

const getStudentHistory = async (req, res) => {
  try {
    const result =
      await getStudentAssessmentAttempts(
        req.params.assessmentId,
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Student Assessment History Error:",
      error,
    );

    const message =
      error.message ||
      "Unable to fetch assessment history.";

    if (
      message.toLowerCase().includes("not found")
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

// ======================================
// Tutor/Admin - All Attempts
// GET /api/assessment-results/assessment/:assessmentId/attempts
// ======================================

const getAllAssessmentAttempts = async (
  req,
  res,
) => {
  try {
    const result =
      await getAssessmentAttempts(
        req.params.assessmentId,
      );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Assessment Attempts Error:",
      error,
    );

    const message =
      error.message ||
      "Unable to fetch assessment attempts.";

    if (
      message.toLowerCase().includes("not found")
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

// ======================================
// Tutor/Admin - Attempt Details
// GET /api/assessment-results/attempt/:attemptId/details
// ======================================

const getAssessmentAttemptDetails = async (
  req,
  res,
) => {
  try {
    const result = await getAttemptById(
      req.params.attemptId,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Assessment Attempt Details Error:",
      error,
    );

    const message =
      error.message ||
      "Unable to fetch assessment attempt.";

    if (
      message.toLowerCase().includes("not found")
    ) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

module.exports = {
  getStudentResult,
  getStudentHistory,
  getAllAssessmentAttempts,
  getAssessmentAttemptDetails,
};