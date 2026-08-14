const mongoose = require("mongoose");

const Assessment = require("../models/Assessment");
const AssessmentQuestion = require("../models/AssessmentQuestion");
const Course = require("../models/Course");

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ======================================
// Create Assessment
// ======================================

const createAssessment = async (assessmentData, userId) => {
  if (!assessmentData?.course) {
    throw new Error("Course ID is required.");
  }

  if (!isValidObjectId(assessmentData.course)) {
    throw new Error("Invalid course ID.");
  }

  const title = String(assessmentData.title || "").trim();

  if (!title) {
    throw new Error("Assessment title is required.");
  }

  const course = await Course.findById(assessmentData.course)
    .select("_id");

  if (!course) {
    throw new Error("Course not found.");
  }

  const existingAssessment = await Assessment.findOne({
    course: assessmentData.course,
  });

  if (existingAssessment) {
    throw new Error(
      "This course already has an assessment.",
    );
  }

  const allowedFields = [
    "course",
    "title",
    "description",
    "instructions",
    "passingScore",
    "timeLimit",
    "totalQuestions",
    "maxAttempts",
    "cooldownDays",
    "randomizeQuestions",
    "showResultImmediately",
    "certificateRequired",
  ];

  const cleanData = {};

  for (const field of allowedFields) {
    if (assessmentData[field] !== undefined) {
      cleanData[field] = assessmentData[field];
    }
  }

  cleanData.course = assessmentData.course;
  cleanData.title = title;
  cleanData.createdBy = userId;

  const assessment = await Assessment.create(cleanData);

  return {
    success: true,
    message: "Assessment created successfully.",
    data: assessment,
  };
};

// ======================================
// Get All Assessments
// ======================================

const getAllAssessments = async () => {
  const assessments = await Assessment.find()
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();

  return {
    success: true,
    message: "Assessments retrieved successfully.",
    data: assessments,
  };
};

// ======================================
// Get By ID
// ======================================

const getAssessmentById = async (assessmentId) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(assessmentId)
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName")
    .lean();

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  return {
    success: true,
    message: "Assessment retrieved successfully.",
    data: assessment,
  };
};

// ======================================
// Get By Course
// ======================================

const getAssessmentByCourse = async (courseId) => {
  if (!isValidObjectId(courseId)) {
    throw new Error("Invalid course ID.");
  }

  const assessment = await Assessment.findOne({
    course: courseId,
  })
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName")
    .lean();

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  return {
    success: true,
    message: "Assessment retrieved successfully.",
    data: assessment,
  };
};

// ======================================
// Update Assessment
// ======================================

const updateAssessment = async (
  assessmentId,
  updateData,
  userId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (
    assessment.createdBy.toString() !== userId.toString()
  ) {
    throw new Error(
      "You are not allowed to modify this assessment.",
    );
  }

  if (assessment.status === "published") {
    throw new Error(
      "Published assessments cannot be modified.",
    );
  }

  const allowedFields = [
    "title",
    "description",
    "instructions",
    "passingScore",
    "timeLimit",
    "totalQuestions",
    "maxAttempts",
    "cooldownDays",
    "randomizeQuestions",
    "showResultImmediately",
    "certificateRequired",
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      assessment[field] = updateData[field];
    }
  }

  await assessment.save();

  return {
    success: true,
    message: "Assessment updated successfully.",
    data: assessment,
  };
};

// ======================================
// Publish Assessment
// ======================================

const publishAssessment = async (
  assessmentId,
  userId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (
    assessment.createdBy.toString() !== userId.toString()
  ) {
    throw new Error(
      "You are not allowed to publish this assessment.",
    );
  }

  if (assessment.status === "published") {
    throw new Error("Assessment is already published.");
  }

  const questionCount = await AssessmentQuestion.countDocuments({
    assessment: assessmentId,
    status: "published",
  });

  if (questionCount < assessment.totalQuestions) {
    throw new Error(
      `Assessment requires at least ${assessment.totalQuestions} published questions before it can be published.`,
    );
  }

  assessment.status = "published";

  await assessment.save();

  return {
    success: true,
    message: "Assessment published successfully.",
    data: assessment,
  };
};

// ======================================
// Archive Assessment
// ======================================

const archiveAssessment = async (
  assessmentId,
  userId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (
    assessment.createdBy.toString() !== userId.toString()
  ) {
    throw new Error(
      "You are not allowed to archive this assessment.",
    );
  }

  assessment.status = "archived";

  await assessment.save();

  return {
    success: true,
    message: "Assessment archived successfully.",
    data: assessment,
  };
};

// ======================================
// Delete Assessment
// ======================================

const deleteAssessment = async (
  assessmentId,
  userId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (
    assessment.createdBy.toString() !== userId.toString()
  ) {
    throw new Error(
      "You are not allowed to delete this assessment.",
    );
  }

  if (assessment.status === "published") {
    throw new Error(
      "Published assessments cannot be deleted. Archive them instead.",
    );
  }

  const attemptsExist =
    await mongoose.model("AssessmentAttempt").exists({
      assessment: assessmentId,
    });

  if (attemptsExist) {
    throw new Error(
      "Assessment has existing attempts and cannot be deleted.",
    );
  }

  await AssessmentQuestion.deleteMany({
    assessment: assessmentId,
  });

  await assessment.deleteOne();

  return {
    success: true,
    message: "Assessment deleted successfully.",
  };
};

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentByCourse,
  updateAssessment,
  publishAssessment,
  archiveAssessment,
  deleteAssessment,
};