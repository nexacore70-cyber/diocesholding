const {
  startAssessment,
  submitAssessment,
} = require("../services/assessmentAttemptService");

// ======================================
// Start Assessment
// POST /api/assessment-attempts/:assessmentId/start
// Student
// ======================================

const startStudentAssessment = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { assessmentId } = req.params;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "Assessment ID is required.",
      });
    }

    const result = await startAssessment(
      assessmentId,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Start Assessment Error:", error);

    const message = error?.message || "Unable to start assessment.";

    if (message.toLowerCase().includes("not found")) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.toLowerCase().includes("not enrolled") ||
      message.toLowerCase().includes("not available") ||
      message.toLowerCase().includes("maximum") ||
      message.toLowerCase().includes("retake") ||
      message.toLowerCase().includes("cooldown")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to start assessment.",
    });
  }
};

// ======================================
// Submit Assessment
// POST /api/assessment-attempts/:attemptId/submit
// Student
// ======================================

const submitStudentAssessment = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: "Assessment attempt ID is required.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    const result = await submitAssessment(
      attemptId,
      req.user._id,
      answers,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Submit Assessment Error:", error);

    const message = error?.message || "Unable to submit assessment.";

    if (message.toLowerCase().includes("not found")) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (
      message.toLowerCase().includes("unauthorized") ||
      message.toLowerCase().includes("not allowed")
    ) {
      return res.status(403).json({
        success: false,
        message,
      });
    }

    if (
      message.toLowerCase().includes("already submitted") ||
      message.toLowerCase().includes("no published questions") ||
      message.toLowerCase().includes("invalid")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit assessment.",
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  startStudentAssessment,
  submitStudentAssessment,
};