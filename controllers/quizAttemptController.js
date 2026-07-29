const { startQuiz, submitQuiz } = require("../services/quizAttemptService");

// ======================================
// Start Quiz Attempt
// @desc    Start Quiz Attempt
// @route   POST /api/quiz-attempts/:quizId/start
// @access  Student
// ======================================
const startQuizAttempt = async (req, res) => {
  try {
    const result = await startQuiz(req.params.quizId, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Start Quiz Error:", error);

    let statusCode = 500;

    if (error.message.includes("not found")) {
      statusCode = 404;
    } else if (
      error.message.includes("not enrolled") ||
      error.message.includes("Maximum quiz attempts") ||
      error.message.includes("not available")
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Submit Quiz Attempt
// @desc    Submit Quiz
// @route   POST /api/quiz-attempts/:attemptId/submit
// @access  Student
// ======================================
const submitQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    const result = await submitQuiz(attemptId, req.user._id, answers);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Submit Quiz Error:", error);

    let statusCode = 500;

    if (error.message.includes("not found")) {
      statusCode = 404;
    } else if (
      error.message.includes("not allowed") ||
      error.message.includes("already submitted") ||
      error.message.includes("no published questions")
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startQuizAttempt,
  submitQuizAttempt,
};
