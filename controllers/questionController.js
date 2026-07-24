const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../services/questionService");

// @desc Create Question
// @route POST /api/questions
// @access Tutor/Admin
const createNewQuestion = async (req, res) => {
  try {
    const result = await createQuestion(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Question Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get All Questions
// @route GET /api/questions
// @access Public
const getQuestions = async (req, res) => {
  try {
    const result = await getAllQuestions();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Questions Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get Single Question
// @route GET /api/questions/:id
// @access Public
const getQuestion = async (req, res) => {
  try {
    const result = await getQuestionById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Question Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update Question
// @route PUT /api/questions/:id
// @access Tutor/Admin
const updateExistingQuestion = async (req, res) => {
  try {
    const result = await updateQuestion(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Question Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete Question
// @route DELETE /api/questions/:id
// @access Tutor/Admin
const deleteExistingQuestion = async (req, res) => {
  try {
    const result = await deleteQuestion(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Question Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewQuestion,
  getQuestions,
  getQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
};
