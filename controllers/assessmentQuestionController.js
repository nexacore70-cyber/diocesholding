const {
  createAssessmentQuestion,
  getAllAssessmentQuestions,
  getAssessmentQuestions,
  getAssessmentQuestionById,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
} = require("../services/assessmentQuestionService");

// ======================================
// Create Assessment Question
// @route POST /api/assessment-questions
// @access Tutor/Admin
// ======================================
const createNewAssessmentQuestion = async (req, res) => {
  try {
    const result = await createAssessmentQuestion(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Assessment Question Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Assessment Questions
// @route GET /api/assessment-questions
// @access Authenticated
// ======================================
const getAssessmentQuestionList = async (req, res) => {
  try {
    const result = await getAllAssessmentQuestions();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Assessment Questions Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Questions By Assessment
// @route GET /api/assessment-questions/assessment/:assessmentId
// @access Authenticated
// ======================================
const getQuestionsForAssessment = async (req, res) => {
  try {
    const result = await getAssessmentQuestions(req.params.assessmentId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Assessment Questions Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Question
// @route GET /api/assessment-questions/:id
// @access Authenticated
// ======================================
const getAssessmentQuestion = async (req, res) => {
  try {
    const result = await getAssessmentQuestionById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Assessment Question Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Question
// @route PUT /api/assessment-questions/:id
// @access Tutor/Admin
// ======================================
const updateExistingAssessmentQuestion = async (req, res) => {
  try {
    const result = await updateAssessmentQuestion(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Assessment Question Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Question
// @route DELETE /api/assessment-questions/:id
// @access Tutor/Admin
// ======================================
const deleteExistingAssessmentQuestion = async (req, res) => {
  try {
    const result = await deleteAssessmentQuestion(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Assessment Question Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
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
