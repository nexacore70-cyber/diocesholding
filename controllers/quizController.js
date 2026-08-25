const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  publishQuiz,
  archiveQuiz,
  deleteQuiz,
  restoreQuiz,
} = require("../services/quizService");

// ======================================
// Create Quiz
// ======================================

const createNewQuiz = async (req, res) => {
  try {
    const result = await createQuiz(
      req.body,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Quiz Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Quizzes
// ======================================

const getQuizzes = async (req, res) => {
  try {
    const result = await getAllQuizzes();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Quizzes Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Quiz
// ======================================

const getQuiz = async (req, res) => {
  try {
    const result = await getQuizById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Quiz Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Quiz
// ======================================

const updateExistingQuiz = async (req, res) => {
  try {
    const result = await updateQuiz(
      req.params.id,
      req.body,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Quiz Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Publish Quiz
// ======================================

const publishExistingQuiz = async (req, res) => {
  try {
    const result = await publishQuiz(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Publish Quiz Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Archive Quiz
// ======================================

const archiveExistingQuiz = async (req, res) => {
  try {
    const result = await archiveQuiz(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Archive Quiz Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Quiz
// ======================================

const deleteExistingQuiz = async (req, res) => {
  try {
    const result = await deleteQuiz(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Quiz Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Restore Quiz
// ======================================

const restoreExistingQuiz = async (req, res) => {
  try {
    const result = await restoreQuiz(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Restore Quiz Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewQuiz,
  getQuizzes,
  getQuiz,
  updateExistingQuiz,
  publishExistingQuiz,
  archiveExistingQuiz,
  deleteExistingQuiz,
  restoreExistingQuiz,
};