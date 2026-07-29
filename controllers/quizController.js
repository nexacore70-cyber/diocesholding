const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  restoreQuiz,
} = require("../services/quizService");

// ======================================
// Create Quiz
// @route POST /api/quizzes
// ======================================
const createNewQuiz = async (req, res) => {
  try {
    const result = await createQuiz(req.body, req.user._id);

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
// @route GET /api/quizzes
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
// Get Quiz By ID
// @route GET /api/quizzes/:id
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
// @route PUT /api/quizzes/:id
// ======================================
const updateExistingQuiz = async (req, res) => {
  try {
    const result = await updateQuiz(req.params.id, req.body);

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
// Delete Quiz (Soft Delete)
// @route DELETE /api/quizzes/:id
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
// @route PATCH /api/quizzes/restore/:id
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
  deleteExistingQuiz,
  restoreExistingQuiz,
};
