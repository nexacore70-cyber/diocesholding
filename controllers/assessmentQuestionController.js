const {
  createAssessmentQuestion,
  getAllAssessmentQuestions,
  getAssessmentQuestions,
  getAssessmentQuestionById,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
} = require("../services/assessmentQuestionService");

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
    message.toLowerCase().includes("cannot")
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

const createNewAssessmentQuestion = async (
  req,
  res,
) => {
  try {
    const result =
      await createAssessmentQuestion(
        req.body,
        req.user._id,
      );

    return res.status(201).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to create assessment question.",
    );
  }
};

// ======================================
// Get All
// ======================================

const getAssessmentQuestionList = async (
  req,
  res,
) => {
  try {
    const result =
      await getAllAssessmentQuestions();

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to fetch assessment questions.",
    );
  }
};

// ======================================
// Get For Assessment
// ======================================

const getQuestionsForAssessment = async (
  req,
  res,
) => {
  try {
    const result =
      await getAssessmentQuestions(
        req.params.assessmentId,
        false,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to fetch assessment questions.",
    );
  }
};

// ======================================
// Get Single
// ======================================

const getAssessmentQuestion = async (
  req,
  res,
) => {
  try {
    const result =
      await getAssessmentQuestionById(
        req.params.id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to fetch assessment question.",
    );
  }
};

// ======================================
// Update
// ======================================

const updateExistingAssessmentQuestion = async (
  req,
  res,
) => {
  try {
    const result =
      await updateAssessmentQuestion(
        req.params.id,
        req.body,
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to update assessment question.",
    );
  }
};

// ======================================
// Delete
// ======================================

const deleteExistingAssessmentQuestion = async (
  req,
  res,
) => {
  try {
    const result =
      await deleteAssessmentQuestion(
        req.params.id,
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to delete assessment question.",
    );
  }
};

module.exports = {
  createNewAssessmentQuestion,
  getAssessmentQuestionList,
  getQuestionsForAssessment,
  getAssessmentQuestion,
  updateExistingAssessmentQuestion,
  deleteExistingAssessmentQuestion,
};