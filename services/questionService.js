const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// ======================================
// Create Question
// ======================================
const createQuestion = async (questionData, userId) => {
  if (!questionData.question) {
    throw new Error("Question is required.");
  }

  if (!questionData.quiz) {
    throw new Error("Quiz ID is required.");
  }

  const quiz = await Quiz.findById(questionData.quiz);

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  if (quiz.status === "archived") {
    throw new Error("You cannot add questions to an archived quiz.");
  }

  // Automatically determine order
  const lastQuestion = await Question.findOne({
    quiz: questionData.quiz,
  }).sort({ order: -1 });

  const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

  const question = await Question.create({
    ...questionData,
    order: nextOrder,
    createdBy: userId,
  });

  const populatedQuestion = await Question.findById(question._id).populate({
    path: "quiz",
    select: "title status",
    populate: {
      path: "lesson",
      select: "title",
    },
  });

  return {
    success: true,
    message: "Question created successfully.",
    data: populatedQuestion,
  };
};

// ======================================
// Get All Questions
// ======================================
const getAllQuestions = async () => {
  const questions = await Question.find()
    .populate({
      path: "quiz",
      select: "title status",
      populate: {
        path: "lesson",
        select: "title",
      },
    })
    .sort({ order: 1 });

  return {
    success: true,
    message: "Questions retrieved successfully.",
    data: questions,
  };
};

// ======================================
// Get Single Question
// ======================================
const getQuestionById = async (questionId) => {
  const question = await Question.findById(questionId).populate({
    path: "quiz",
    select: "title status",
    populate: {
      path: "lesson",
      select: "title",
    },
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  return {
    success: true,
    message: "Question retrieved successfully.",
    data: question,
  };
};

// ======================================
// Update Question
// ======================================
const updateQuestion = async (questionId, updateData) => {
  const existingQuestion = await Question.findById(questionId);

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  const quiz = await Quiz.findById(existingQuestion.quiz);

  if (quiz && quiz.status === "archived") {
    throw new Error("Archived quizzes cannot be modified.");
  }

  const question = await Question.findByIdAndUpdate(questionId, updateData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "quiz",
    select: "title status",
    populate: {
      path: "lesson",
      select: "title",
    },
  });

  return {
    success: true,
    message: "Question updated successfully.",
    data: question,
  };
};

// ======================================
// Delete Question
// ======================================
const deleteQuestion = async (questionId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error("Question not found.");
  }

  await question.deleteOne();

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
