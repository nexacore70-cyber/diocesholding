const { startQuiz, submitQuiz } = require("../services/quizAttemptService");

// @desc Start Quiz
// @route POST /api/quizzes/:quizId/start
// @access Student
const startQuizAttempt = async (req, res) => {
  try {
    const result = await startQuiz(req.params.quizId, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Start Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Submit Quiz
const submitQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const result = await submitQuiz(attemptId, req.user._id, answers);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Submit Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startQuizAttempt,
  submitQuizAttempt,
};
