const Question = require("../models/Question");

// Create Question
const createQuestion = async (questionData, userId) => {
  if (!questionData.question) {
    throw new Error("Question is required.");
  }

  if (!questionData.quiz) {
    throw new Error("Quiz ID is required.");
  }

  // Get the next question order automatically
  const lastQuestion = await Question.findOne({
    quiz: questionData.quiz,
  }).sort({ order: -1 });

  const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

  const question = await Question.create({
    ...questionData,
    order: nextOrder,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Question created successfully.",
    data: question,
  };
};

// Get All Questions
const getAllQuestions = async () => {
  const questions = await Question.find()
    .populate("quiz", "title")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Questions retrieved successfully.",
    data: questions,
  };
};

// Get Single Question
const getQuestionById = async (questionId) => {
  const question = await Question.findById(questionId).populate(
    "quiz",
    "title",
  );

  if (!question) {
    throw new Error("Question not found.");
  }

  return {
    success: true,
    message: "Question retrieved successfully.",
    data: question,
  };
};

// Update Question
const updateQuestion = async (questionId, updateData) => {
  const question = await Question.findByIdAndUpdate(questionId, updateData, {
    new: true,
    runValidators: true,
  }).populate("quiz", "title");

  if (!question) {
    throw new Error("Question not found.");
  }

  return {
    success: true,
    message: "Question updated successfully.",
    data: question,
  };
};

// Delete Question
const deleteQuestion = async (questionId) => {
  const question = await Question.findByIdAndDelete(questionId);

  if (!question) {
    throw new Error("Question not found.");
  }

  return {
    success: true,
    message: "Question deleted successfully.",
  };
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
