const Quiz = require("../models/Quiz");

// Create Quiz
const createQuiz = async (quizData, userId) => {
  if (!quizData.title) {
    throw new Error("Quiz title is required.");
  }

  if (!quizData.lesson) {
    throw new Error("Lesson ID is required.");
  }

  const quiz = await Quiz.create({
    ...quizData,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Quiz created successfully.",
    data: quiz,
  };
};

// Get All Quizzes
const getAllQuizzes = async () => {
  const quizzes = await Quiz.find()
    .populate("lesson", "title order")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Quizzes retrieved successfully.",
    data: quizzes,
  };
};

// Get Single Quiz
const getQuizById = async (quizId) => {
  const quiz = await Quiz.findById(quizId)
    .populate("lesson", "title order");

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  return {
    success: true,
    message: "Quiz retrieved successfully.",
    data: quiz,
  };
};

// Update Quiz
const updateQuiz = async (quizId, updateData) => {
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("lesson", "title order");

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  return {
    success: true,
    message: "Quiz updated successfully.",
    data: quiz,
  };
};

// Delete Quiz
const deleteQuiz = async (quizId) => {
  const quiz = await Quiz.findByIdAndDelete(quizId);

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  return {
    success: true,
    message: "Quiz deleted successfully.",
  };
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};