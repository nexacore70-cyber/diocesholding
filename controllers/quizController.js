const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../services/quizService");

// @desc Create Quiz
// @route POST /api/quizzes
// @access Tutor/Admin
const createNewQuiz = async (req, res) => {
  try {
    const result = await createQuiz(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get All Quizzes
// @route GET /api/quizzes
// @access Public
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

// @desc Get Single Quiz
// @route GET /api/quizzes/:id
// @access Public
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

// @desc Update Quiz
// @route PUT /api/quizzes/:id
// @access Tutor/Admin
const updateExistingQuiz = async (req, res) => {
  try {
    const result = await updateQuiz(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete Quiz
// @route DELETE /api/quizzes/:id
// @access Tutor/Admin
const deleteExistingQuiz = async (req, res) => {
  try {
    const result = await deleteQuiz(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Quiz Error:", error);

    return res.status(500).json({
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
};
