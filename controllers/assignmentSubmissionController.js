const {
  submitAssignment,
  getMySubmissions,
  getSubmissionById,
  gradeSubmission,
} = require("../services/assignmentSubmissionService");

// ======================================
// Submit Assignment
// @route POST /api/assignment-submissions/:assignmentId/submit
// @access Student
// ======================================
const submitStudentAssignment = async (req, res) => {
  try {
    const result = await submitAssignment(
      req.params.assignmentId,
      req.user._id,
      req.body,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Submit Assignment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Submissions
// @route GET /api/assignment-submissions/my-submissions
// @access Student
// ======================================
const getStudentSubmissions = async (req, res) => {
  try {
    const result = await getMySubmissions(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get My Submissions Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Submission By ID
// @route GET /api/assignment-submissions/:id
// @access Tutor/Admin
// ======================================
const getSubmission = async (req, res) => {
  try {
    const result = await getSubmissionById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Submission Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Grade Submission
// @route PATCH /api/assignment-submissions/:id/grade
// @access Tutor/Admin
// ======================================
const gradeStudentSubmission = async (req, res) => {
  try {
    const { score, feedback = "", gradingRemarks = "" } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        message: "Score is required.",
      });
    }

    const result = await gradeSubmission(
      req.params.id,
      req.user._id,
      Number(score),
      feedback,
      gradingRemarks,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Grade Submission Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitStudentAssignment,
  getStudentSubmissions,
  getSubmission,
  gradeStudentSubmission,
};
