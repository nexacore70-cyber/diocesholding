const {
  startAssessment,
  submitAssessment,
} = require("../services/assessmentAttemptService");

// ======================================
// Start Assessment
// @route POST /api/assessment-attempts/:assessmentId/start
// @access Student
// ======================================
const startStudentAssessment = async (req, res) => {
  try {
    const result = await startAssessment(req.params.assessmentId, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Start Assessment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Submit Assessment
// @route POST /api/assessment-attempts/:attemptId/submit
// @access Student
// ======================================
const submitStudentAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    const result = await submitAssessment(
      req.params.attemptId,
      req.user._id,
      answers,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Submit Assessment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startStudentAssessment,
  submitStudentAssessment,
};
