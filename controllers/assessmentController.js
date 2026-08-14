const {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentByCourse,
  updateAssessment,
  publishAssessment,
  archiveAssessment,
  deleteAssessment,
} = require("../services/assessmentService");

const handleError = (res, error, fallback) => {
  console.error(fallback, error);

  const message = error.message || fallback;

  if (
    message.toLowerCase().includes("not found")
  ) {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  if (
    message.toLowerCase().includes("not allowed") ||
    message.toLowerCase().includes("cannot") ||
    message.toLowerCase().includes("already")
  ) {
    return res.status(409).json({
      success: false,
      message,
    });
  }

  return res.status(400).json({
    success: false,
    message,
  });
};

// ======================================
// Create
// ======================================

const createNewAssessment = async (req, res) => {
  try {
    const result = await createAssessment(
      req.body,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to create assessment.",
    );
  }
};

// ======================================
// Get All
// ======================================

const getAssessments = async (req, res) => {
  try {
    const result = await getAllAssessments();

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to fetch assessments.",
    );
  }
};

// ======================================
// Get By ID
// ======================================

const getAssessment = async (req, res) => {
  try {
    const result = await getAssessmentById(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to fetch assessment.",
    );
  }
};

// ======================================
// Get By Course
// ======================================

const getCourseAssessment = async (req, res) => {
  try {
    const result = await getAssessmentByCourse(
      req.params.courseId,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to fetch course assessment.",
    );
  }
};

// ======================================
// Update
// ======================================

const updateExistingAssessment = async (
  req,
  res,
) => {
  try {
    const result = await updateAssessment(
      req.params.id,
      req.body,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to update assessment.",
    );
  }
};

// ======================================
// Publish
// ======================================

const publishAssessmentNow = async (req, res) => {
  try {
    const result = await publishAssessment(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to publish assessment.",
    );
  }
};

// ======================================
// Archive
// ======================================

const archiveAssessmentNow = async (
  req,
  res,
) => {
  try {
    const result = await archiveAssessment(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to archive assessment.",
    );
  }
};

// ======================================
// Delete
// ======================================

const removeAssessment = async (req, res) => {
  try {
    const result = await deleteAssessment(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to delete assessment.",
    );
  }
};

module.exports = {
  createNewAssessment,
  getAssessments,
  getAssessment,
  getCourseAssessment,
  updateExistingAssessment,
  publishAssessmentNow,
  archiveAssessmentNow,
  removeAssessment,
};