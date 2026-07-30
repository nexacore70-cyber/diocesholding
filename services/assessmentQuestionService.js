const Assessment = require("../models/Assessment");
const AssessmentQuestion = require("../models/AssessmentQuestion");

// ======================================
// Create Assessment Question
// ======================================
const createAssessmentQuestion = async (questionData, userId) => {
  if (!questionData.assessment) {
    throw new Error("Assessment ID is required.");
  }

  if (!questionData.question) {
    throw new Error("Question is required.");
  }

  const assessment = await Assessment.findById(questionData.assessment);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  const lastQuestion = await AssessmentQuestion.findOne({
    assessment: questionData.assessment,
  }).sort({ order: -1 });

  const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

  const question = await AssessmentQuestion.create({
    ...questionData,
    order: nextOrder,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Assessment question created successfully.",
    data: question,
  };
};

// ======================================
// Get All Assessment Questions
// ======================================
const getAllAssessmentQuestions = async () => {
  const questions = await AssessmentQuestion.find()
    .populate("assessment", "title")
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    message: "Assessment questions retrieved successfully.",
    data: questions,
  };
};

// ======================================
// Get Questions By Assessment
// ======================================
const getAssessmentQuestions = async (assessmentId) => {
  const questions = await AssessmentQuestion.find({
    assessment: assessmentId,
  }).sort({
    order: 1,
  });

  return {
    success: true,
    message: "Assessment questions retrieved successfully.",
    data: questions,
  };
};

// ======================================
// Get Single Question
// ======================================
const getAssessmentQuestionById = async (questionId) => {
  const question = await AssessmentQuestion.findById(questionId).populate(
    "assessment",
    "title",
  );

  if (!question) {
    throw new Error("Assessment question not found.");
  }

  return {
    success: true,
    message: "Assessment question retrieved successfully.",
    data: question,
  };
};

// ======================================
// Update Question
// ======================================
const updateAssessmentQuestion = async (questionId, updateData) => {
  const question = await AssessmentQuestion.findByIdAndUpdate(
    questionId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("assessment", "title");

  if (!question) {
    throw new Error("Assessment question not found.");
  }

  return {
    success: true,
    message: "Assessment question updated successfully.",
    data: question,
  };
};

// ======================================
// Delete Question
// ======================================
const deleteAssessmentQuestion = async (questionId) => {
  const question = await AssessmentQuestion.findByIdAndDelete(questionId);

  if (!question) {
    throw new Error("Assessment question not found.");
  }

  return {
    success: true,
    message: "Assessment question deleted successfully.",
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
