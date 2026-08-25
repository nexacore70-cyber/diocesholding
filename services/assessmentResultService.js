const mongoose = require("mongoose");

const AssessmentAttempt = require("../models/AssessmentAttempt");
const Assessment = require("../models/Assessment");

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ======================================
// Get Student Attempt By ID
// ======================================

const getStudentAttemptById = async (
  attemptId,
  studentId,
) => {
  if (!isValidObjectId(attemptId)) {
    throw new Error("Invalid assessment attempt ID.");
  }

  const attempt = await AssessmentAttempt.findOne({
    _id: attemptId,
    student: studentId,
  })
    .populate("assessment", "title passingScore")
    .populate("enrollment", "course status")
    .populate({
      path: "answers.question",
      select:
        "question questionType options explanation points",
    })
    .lean();

  if (!attempt) {
    throw new Error(
      "Assessment attempt not found.",
    );
  }

  return {
    success: true,
    message: "Assessment result retrieved successfully.",
    data: attempt,
  };
};

// ======================================
// Get Student Assessment History
// ======================================

const getStudentAssessmentAttempts = async (
  assessmentId,
  studentId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(
    assessmentId,
  ).select("_id title passingScore");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  const attempts = await AssessmentAttempt.find({
    assessment: assessmentId,
    student: studentId,
  })
    .select(
      [
        "attemptNumber",
        "startedAt",
        "expiresAt",
        "submittedAt",
        "score",
        "totalMarks",
        "percentage",
        "passed",
        "cooldownUntil",
        "status",
      ].join(" "),
    )
    .sort({
      attemptNumber: -1,
    })
    .lean();

  return {
    success: true,
    message:
      "Assessment attempt history retrieved successfully.",
    data: {
      assessment,
      attempts,
    },
  };
};

// ======================================
// Get All Assessment Attempts
// Tutor/Admin
// ======================================

const getAssessmentAttempts = async (
  assessmentId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(
    assessmentId,
  ).select("_id title passingScore");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  const attempts = await AssessmentAttempt.find({
    assessment: assessmentId,
  })
    .populate(
      "student",
      "firstName lastName email",
    )
    .populate(
      "enrollment",
      "course status",
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    success: true,
    message:
      "Assessment attempts retrieved successfully.",
    data: {
      assessment,
      attempts,
    },
  };
};

// ======================================
// Get Attempt By ID
// Tutor/Admin
// ======================================

const getAttemptById = async (
  attemptId,
) => {
  if (!isValidObjectId(attemptId)) {
    throw new Error(
      "Invalid assessment attempt ID.",
    );
  }

  const attempt =
    await AssessmentAttempt.findById(
      attemptId,
    )
      .populate(
        "student",
        "firstName lastName email",
      )
      .populate(
        "assessment",
        "title passingScore",
      )
      .populate({
        path: "answers.question",
        select:
          "question questionType options correctAnswer explanation points",
      })
      .lean();

  if (!attempt) {
    throw new Error(
      "Assessment attempt not found.",
    );
  }

  return {
    success: true,
    message:
      "Assessment attempt retrieved successfully.",
    data: attempt,
  };
};

module.exports = {
  getStudentAttemptById,
  getStudentAssessmentAttempts,
  getAssessmentAttempts,
  getAttemptById,
};