const {
  createQuestion,
  getQuestionsByQuiz,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
} = require("../services/questionService");

// ======================================
// Create Question
// POST /api/questions
// ======================================

const createNewQuestion = async (req, res) => {
  try {
    const result = await createQuestion(
      req.body,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error(
      "Create Question Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Questions By Quiz
// GET /api/questions/quiz/:quizId
// ======================================

const getQuizQuestions = async (req, res) => {
  try {
    const result = await getQuestionsByQuiz(
      req.params.quizId,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Quiz Questions Error:",
      error,
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Question
// GET /api/questions/:id
// ======================================

const getQuestion = async (req, res) => {
  try {
    const result = await getQuestionById(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Question Error:",
      error,
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Question
// PUT /api/questions/:id
// ======================================

const updateExistingQuestion = async (
  req,
  res,
) => {
  try {
    const result = await updateQuestion(
      req.params.id,
      req.body,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Update Question Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Question
// DELETE /api/questions/:id
// ======================================

const deleteExistingQuestion = async (
  req,
  res,
) => {
  try {
    const result = await deleteQuestion(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Delete Question Error:",
      error,
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Publish Question
// PATCH /api/questions/:id/publish
// ======================================

const publishExistingQuestion = async (
  req,
  res,
) => {
  try {
    const result = await publishQuestion(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Publish Question Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Unpublish Question
// PATCH /api/questions/:id/unpublish
// ======================================

const unpublishExistingQuestion = async (
  req,
  res,
) => {
  try {
    const result = await unpublishQuestion(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Unpublish Question Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  createNewQuestion,
  getQuizQuestions,
  getQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
  publishExistingQuestion,
  unpublishExistingQuestion,
};