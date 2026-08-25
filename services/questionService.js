const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// ======================================
// Create Question
// ======================================

const createQuestion = async (questionData, userId) => {
  const {
    quiz,
    question,
    questionType,
    options,
    correctAnswer,
    explanation,
    points,
    order,
  } = questionData;

  if (!quiz) {
    throw new Error("Quiz ID is required.");
  }

  if (!question || !question.trim()) {
    throw new Error("Question is required.");
  }

  // ======================================
  // Check Quiz
  // ======================================

  const existingQuiz = await Quiz.findOne({
    _id: quiz,
    isDeleted: false,
  });

  if (!existingQuiz) {
    throw new Error("Quiz not found.");
  }

  // ======================================
  // Prevent Duplicate Question Order
  // ======================================

  const existingOrder = await Question.findOne({
    quiz,
    order: order || 1,
  });

  if (existingOrder) {
    throw new Error(
      "A question already exists at this order position.",
    );
  }

  // ======================================
  // Create Question
  // ======================================

  const newQuestion = await Question.create({
    quiz,
    question: question.trim(),
    questionType: questionType || "multiple_choice",
    options: options || [],
    correctAnswer,
    explanation: explanation || "",
    points: points || 1,
    order: order || 1,
    status: "draft",
    createdBy: userId,
  });

  // ======================================
  // Update Quiz Totals
  // ======================================

  await updateQuizTotals(quiz);

  return {
    success: true,
    message: "Question created successfully.",
    data: newQuestion,
  };
};

// ======================================
// Update Quiz Totals
// ======================================

const updateQuizTotals = async (quizId) => {
  const result = await Question.aggregate([
    {
      $match: {
        quiz: quizId,
        status: "published",
      },
    },
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        totalMarks: { $sum: "$points" },
      },
    },
  ]);

  const totals = result[0] || {
    totalQuestions: 0,
    totalMarks: 0,
  };

  await Quiz.findByIdAndUpdate(quizId, {
    totalQuestions: totals.totalQuestions,
    totalMarks: totals.totalMarks,
  });
};

// ======================================
// Get Questions By Quiz
// ======================================

const getQuestionsByQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: false,
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  const questions = await Question.find({
    quiz: quizId,
  }).sort({
    order: 1,
    createdAt: 1,
  });

  return {
    success: true,
    count: questions.length,
    data: questions,
  };
};

// ======================================
// Get Question By ID
// ======================================

const getQuestionById = async (questionId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error("Question not found.");
  }

  return {
    success: true,
    data: question,
  };
};

// ======================================
// Update Question
// ======================================

const updateQuestion = async (
  questionId,
  updateData,
) => {
  const question = await Question.findById(
    questionId,
  );

  if (!question) {
    throw new Error("Question not found.");
  }

  // ======================================
  // Prevent Duplicate Order
  // ======================================

  if (updateData.order !== undefined) {
    const duplicateOrder =
      await Question.findOne({
        _id: { $ne: questionId },
        quiz: question.quiz,
        order: updateData.order,
      });

    if (duplicateOrder) {
      throw new Error(
        "Another question already uses this order position.",
      );
    }
  }

  Object.assign(question, updateData);

  await question.save();

  await updateQuizTotals(question.quiz);

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
  const question = await Question.findById(
    questionId,
  );

  if (!question) {
    throw new Error("Question not found.");
  }

  const quizId = question.quiz;

  await Question.findByIdAndDelete(questionId);

  await updateQuizTotals(quizId);

  return {
    success: true,
    message: "Question deleted successfully.",
  };
};

// ======================================
// Publish Question
// ======================================

const publishQuestion = async (questionId) => {
  const question = await Question.findById(
    questionId,
  );

  if (!question) {
    throw new Error("Question not found.");
  }

  question.status = "published";

  await question.save();

  await updateQuizTotals(question.quiz);

  return {
    success: true,
    message: "Question published successfully.",
    data: question,
  };
};

// ======================================
// Unpublish Question
// ======================================

const unpublishQuestion = async (questionId) => {
  const question = await Question.findById(
    questionId,
  );

  if (!question) {
    throw new Error("Question not found.");
  }

  question.status = "draft";

  await question.save();

  await updateQuizTotals(question.quiz);

  return {
    success: true,
    message: "Question moved back to draft.",
    data: question,
  };
};

// ======================================
// Export
// ======================================

module.exports = {
  createQuestion,
  getQuestionsByQuiz,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  publishQuestion,
  unpublishQuestion,
};