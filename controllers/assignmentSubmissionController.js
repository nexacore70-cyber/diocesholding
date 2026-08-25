const {
  submitAssignment,
  getMySubmissions,
  getSubmissionById,
  gradeSubmission,
  returnSubmission,
} = require("../services/assignmentSubmissionService");

// ======================================
// Submit Assignment
// POST /api/assignment-submissions/:assignmentId/submit
// Student
// ======================================

const submitStudentAssignment = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await submitAssignment(
        req.params.assignmentId,
        req.user._id,
        req.body,
      );

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Get My Submissions
// GET /api/assignment-submissions/my-submissions
// Student
// ======================================

const getStudentSubmissions = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await getMySubmissions(
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Get Submission
// GET /api/assignment-submissions/:id
// Tutor/Admin
// ======================================

const getSubmission = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await getSubmissionById(
        req.params.id,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Grade Submission
// PATCH /api/assignment-submissions/:id/grade
// Tutor/Admin
// ======================================

const gradeStudentSubmission = async (
  req,
  res,
  next,
) => {
  try {
    const {
      score,
      feedback = "",
      gradingRemarks = "",
    } = req.body;

    if (
      score === undefined ||
      score === null ||
      score === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Score is required.",
      });
    }

    const result =
      await gradeSubmission(
        req.params.id,
        req.user._id,
        score,
        feedback,
        gradingRemarks,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Return Submission
// PATCH /api/assignment-submissions/:id/return
// Tutor/Admin
// ======================================

const returnStudentSubmission = async (
  req,
  res,
  next,
) => {
  try {
    const {
      feedback = "",
      gradingRemarks = "",
    } = req.body;

    const result =
      await returnSubmission(
        req.params.id,
        req.user._id,
        feedback,
        gradingRemarks,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitStudentAssignment,
  getStudentSubmissions,
  getSubmission,
  gradeStudentSubmission,
  returnStudentSubmission,
};