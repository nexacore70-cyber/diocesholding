const Quiz = require("../models/Quiz");
const generateSlug = require("../utils/generateSlug");

// ======================================
// Create Quiz
// ======================================
const createQuiz = async (quizData, userId) => {
  if (!quizData.title) {
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
    throw new Error("A quiz with this title already exists in this lesson.");
  }

  let slug = generateSlug(quizData.title);

  let existingSlug = await Quiz.findOne({
    slug,
    isDeleted: false,
  });

  let counter = 1;

  while (existingSlug) {
    slug = `${generateSlug(quizData.title)}-${counter}`;
    existingSlug = await Quiz.findOne({
      slug,
      isDeleted: false,
    });
    counter++;
  }

  const quiz = await Quiz.create({
    ...quizData,
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
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    message: "Quizzes retrieved successfully.",
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

  if (updateData.title) {
    const duplicate = await Quiz.findOne({
      _id: { $ne: quizId },
      lesson: updateData.lesson || quiz.lesson,
      title: updateData.title.trim(),
      isDeleted: false,
    });

    if (duplicate) {
      throw new Error(
        "Another quiz with this title already exists in this lesson.",
      );
    }

    let slug = generateSlug(updateData.title);

    let existingSlug = await Quiz.findOne({
      _id: { $ne: quizId },
      slug,
      isDeleted: false,
    });

    let counter = 1;

    while (existingSlug) {
      slug = `${generateSlug(updateData.title)}-${counter}`;

      existingSlug = await Quiz.findOne({
        _id: { $ne: quizId },
        slug,
        isDeleted: false,
      });

      counter++;
    }

    quiz.slug = slug;
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
// Delete Quiz (Soft Delete)
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
  deleteQuiz,
  restoreQuiz,
};
