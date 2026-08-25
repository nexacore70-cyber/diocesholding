const Quiz = require("../models/Quiz");
const generateSlug = require("../utils/generateSlug");

// ======================================
// Create Quiz
// ======================================

const createQuiz = async (quizData, userId) => {
  if (!quizData.title?.trim()) {
    throw new Error("Quiz title is required.");
  }

  if (!quizData.lesson) {
    throw new Error("Lesson ID is required.");
  }

  const existingQuiz = await Quiz.findOne({
    title: quizData.title.trim(),
    lesson: quizData.lesson,
    isDeleted: false,
  });

  if (existingQuiz) {
    throw new Error(
      "A quiz with this title already exists in this lesson.",
    );
  }

  const baseSlug = generateSlug(quizData.title);
  let slug = baseSlug;
  let counter = 1;

  while (
    await Quiz.findOne({
      slug,
      isDeleted: false,
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const quiz = await Quiz.create({
    ...quizData,
    title: quizData.title.trim(),
    slug,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Quiz created successfully.",
    data: quiz,
  };
};

// ======================================
// Get All Quizzes
// ======================================

const getAllQuizzes = async () => {
  const quizzes = await Quiz.find({
    isDeleted: false,
  })
    .populate("lesson", "title order")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Quizzes retrieved successfully.",
    count: quizzes.length,
    data: quizzes,
  };
};

// ======================================
// Get Quiz By ID
// ======================================

const getQuizById = async (quizId) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: false,
  }).populate("lesson", "title order");

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  return {
    success: true,
    message: "Quiz retrieved successfully.",
    data: quiz,
  };
};

// ======================================
// Update Quiz
// ======================================

const updateQuiz = async (quizId, updateData) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: false,
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  if (updateData.title?.trim()) {
    const title = updateData.title.trim();

    const duplicate = await Quiz.findOne({
      _id: { $ne: quizId },
      lesson: updateData.lesson || quiz.lesson,
      title,
      isDeleted: false,
    });

    if (duplicate) {
      throw new Error(
        "Another quiz with this title already exists in this lesson.",
      );
    }

    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (
      await Quiz.findOne({
        _id: { $ne: quizId },
        slug,
        isDeleted: false,
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    quiz.slug = slug;
    quiz.title = title;
  }

  Object.assign(quiz, updateData);

  await quiz.save();

  await quiz.populate("lesson", "title order");

  return {
    success: true,
    message: "Quiz updated successfully.",
    data: quiz,
  };
};

// ======================================
// Publish Quiz
// ======================================

const publishQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: false,
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  if (quiz.totalQuestions < 1) {
    throw new Error(
      "A quiz must contain at least one question before publishing.",
    );
  }

  quiz.status = "published";

  await quiz.save();

  return {
    success: true,
    message: "Quiz published successfully.",
    data: quiz,
  };
};

// ======================================
// Archive Quiz
// ======================================

const archiveQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: false,
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  quiz.status = "archived";

  await quiz.save();

  return {
    success: true,
    message: "Quiz archived successfully.",
    data: quiz,
  };
};

// ======================================
// Delete Quiz
// ======================================

const deleteQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: false,
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  quiz.isDeleted = true;
  quiz.isActive = false;

  await quiz.save();

  return {
    success: true,
    message: "Quiz deleted successfully.",
  };
};

// ======================================
// Restore Quiz
// ======================================

const restoreQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({
    _id: quizId,
    isDeleted: true,
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  quiz.isDeleted = false;
  quiz.isActive = true;

  await quiz.save();

  return {
    success: true,
    message: "Quiz restored successfully.",
    data: quiz,
  };
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  publishQuiz,
  archiveQuiz,
  deleteQuiz,
  restoreQuiz,
};