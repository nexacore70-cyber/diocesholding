const mongoose = require("mongoose");

const Assessment = require("../models/Assessment");
const AssessmentQuestion = require("../models/AssessmentQuestion");

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ======================================
// Create Question
// ======================================

const createAssessmentQuestion = async (
  questionData,
  userId,
) => {
  if (!questionData?.assessment) {
    throw new Error("Assessment ID is required.");
  }

  if (!isValidObjectId(questionData.assessment)) {
    throw new Error("Invalid assessment ID.");
  }

  const questionText = String(
    questionData.question || "",
  ).trim();

  if (!questionText) {
    throw new Error("Question is required.");
  }

  const assessment = await Assessment.findById(
    questionData.assessment,
  );

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (assessment.status === "published") {
    throw new Error(
      "Questions cannot be added to a published assessment.",
    );
  }

  const lastQuestion = await AssessmentQuestion.findOne({
    assessment: questionData.assessment,
  }).sort({ order: -1 });

  const nextOrder = lastQuestion
    ? lastQuestion.order + 1
    : 1;

  const allowedFields = [
    "assessment",
    "question",
    "questionType",
    "options",
    "correctAnswer",
    "explanation",
    "points",
    "status",
  ];

  const cleanData = {};

  for (const field of allowedFields) {
    if (questionData[field] !== undefined) {
      cleanData[field] = questionData[field];
    }
  }

  cleanData.assessment = questionData.assessment;
  cleanData.question = questionText;
  cleanData.order = nextOrder;
  cleanData.createdBy = userId;

  const question =
    await AssessmentQuestion.create(cleanData);

  return {
    success: true,
    message: "Assessment question created successfully.",
    data: question,
  };
};

// ======================================
// Get All Questions
// ======================================

const getAllAssessmentQuestions = async () => {
  const questions = await AssessmentQuestion.find()
    .populate("assessment", "title")
    .populate("createdBy", "firstName lastName")
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    success: true,
    message:
      "Assessment questions retrieved successfully.",
    data: questions,
  };
};

// ======================================
// Get Questions For Assessment
// ======================================

const getAssessmentQuestions = async (
  assessmentId,
  includeAnswers = false,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const projection = includeAnswers
    ? {}
    : "-correctAnswer";

  const questions = await AssessmentQuestion.find({
    assessment: assessmentId,
    status: "published",
  })
    .select(projection)
    .sort({ order: 1 })
    .lean();

  return {
    success: true,
    message:
      "Assessment questions retrieved successfully.",
    data: questions,
  };
};

// ======================================
// Get Single Question
// ======================================

const getAssessmentQuestionById = async (
  questionId,
) => {
  if (!isValidObjectId(questionId)) {
    throw new Error("Invalid question ID.");
  }

  const question =
    await AssessmentQuestion.findById(questionId)
      .select("-correctAnswer")
      .populate("assessment", "title")
      .lean();

  if (!question) {
    throw new Error(
      "Assessment question not found.",
    );
  }

  return {
    success: true,
    message:
      "Assessment question retrieved successfully.",
    data: question,
  };
};

// ======================================
// Update Question
// ======================================

const updateAssessmentQuestion = async (
  questionId,
  updateData,
  userId,
) => {
  if (!isValidObjectId(questionId)) {
    throw new Error("Invalid question ID.");
  }

  const question =
    await AssessmentQuestion.findById(questionId);

  if (!question) {
    throw new Error(
      "Assessment question not found.",
    );
  }

  if (
    question.createdBy.toString() !== userId.toString()
  ) {
    throw new Error(
      "You are not allowed to modify this question.",
    );
  }

  const assessment = await Assessment.findById(
    question.assessment,
  );

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (assessment.status === "published") {
    throw new Error(
      "Questions in a published assessment cannot be modified.",
    );
  }

  const allowedFields = [
    "question",
    "questionType",
    "options",
    "correctAnswer",
    "explanation",
    "points",
    "status",
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      question[field] = updateData[field];
    }
  }

  await question.save();

  return {
    success: true,
    message:
      "Assessment question updated successfully.",
    data: question,
  };
};

// ======================================
// Delete Question
// ======================================

const deleteAssessmentQuestion = async (
  questionId,
  userId,
) => {
  if (!isValidObjectId(questionId)) {
    throw new Error("Invalid question ID.");
  }

  const question =
    await AssessmentQuestion.findById(questionId);

  if (!question) {
    throw new Error(
      "Assessment question not found.",
    );
  }

  if (
    question.createdBy.toString() !== userId.toString()
  ) {
    throw new Error(
      "You are not allowed to delete this question.",
    );
  }

  const assessment = await Assessment.findById(
    question.assessment,
  );

  if (
    assessment &&
    assessment.status === "published"
  ) {
    throw new Error(
      "Questions in a published assessment cannot be deleted.",
    );
  }

  await question.deleteOne();

  return {
    success: true,
    message:
      "Assessment question deleted successfully.",
  };
};

module.exports = {
  createAssessmentQuestion,
  getAllAssessmentQuestions,
  getAssessmentQuestions,
  getAssessmentQuestionById,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
};