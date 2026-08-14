const mongoose = require("mongoose");

const Assessment = require("../models/Assessment");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const AssessmentQuestion = require("../models/AssessmentQuestion");
const Enrollment = require("../models/Enrollment");

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ======================================
// Normalize Answers
// ======================================

const normalizeAnswer = (answer) => {
  if (answer === null || answer === undefined) {
    return "";
  }

  return String(answer)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

// ======================================
// Compare Answers
// ======================================

const answersMatch = (question, selectedAnswer) => {
  if (
    selectedAnswer === null ||
    selectedAnswer === undefined
  ) {
    return false;
  }

  if (question.questionType === "essay") {
    return false;
  }

  return (
    normalizeAnswer(selectedAnswer) ===
    normalizeAnswer(question.correctAnswer)
  );
};

// ======================================
// Start Assessment
// ======================================

const startAssessment = async (
  assessmentId,
  studentId,
) => {
  if (!isValidObjectId(assessmentId)) {
    throw new Error("Invalid assessment ID.");
  }

  const assessment = await Assessment.findById(
    assessmentId,
  ).populate("course", "_id title slug");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (assessment.status !== "published") {
    throw new Error(
      "Assessment is not available.",
    );
  }

  if (!assessment.course) {
    throw new Error(
      "Assessment is not linked to a valid course.",
    );
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: assessment.course._id,
    status: {
      $in: ["active", "completed"],
    },
  });

  if (!enrollment) {
    throw new Error(
      "You are not enrolled in this course.",
    );
  }

  // --------------------------------------
  // Prevent Multiple Active Attempts
  // --------------------------------------

  const activeAttempt =
    await AssessmentAttempt.findOne({
      assessment: assessmentId,
      student: studentId,
      status: "in_progress",
    });

  if (activeAttempt) {
    throw new Error(
      "You already have an active assessment attempt.",
    );
  }

  // --------------------------------------
  // Attempt History
  // --------------------------------------

  const attempts =
    await AssessmentAttempt.find({
      assessment: assessmentId,
      student: studentId,
    }).sort({
      attemptNumber: -1,
    });

  if (attempts.length >= assessment.maxAttempts) {
    throw new Error(
      "Maximum assessment attempts reached.",
    );
  }

  // --------------------------------------
  // Cooldown
  // --------------------------------------

  const lastAttempt = attempts[0];

  if (
    lastAttempt?.cooldownUntil &&
    new Date() < lastAttempt.cooldownUntil
  ) {
    throw new Error(
      `You can retake this assessment after ${lastAttempt.cooldownUntil.toISOString()}.`,
    );
  }

  // --------------------------------------
  // Get Published Questions
  // --------------------------------------

  let questions;

  if (assessment.randomizeQuestions) {
    questions =
      await AssessmentQuestion.aggregate([
        {
          $match: {
            assessment: assessment._id,
            status: "published",
          },
        },
        {
          $sample: {
            size: assessment.totalQuestions,
          },
        },
      ]);
  } else {
    questions =
      await AssessmentQuestion.find({
        assessment: assessment._id,
        status: "published",
      })
        .sort({ order: 1 })
        .limit(assessment.totalQuestions)
        .lean();
  }

  if (
    questions.length < assessment.totalQuestions
  ) {
    throw new Error(
      `Assessment requires at least ${assessment.totalQuestions} published questions.`,
    );
  }

  // --------------------------------------
  // Calculate Marks
  // --------------------------------------

  const totalMarks = questions.reduce(
    (total, question) =>
      total + Number(question.points || 0),
    0,
  );

  // --------------------------------------
  // Timing
  // --------------------------------------

  const startedAt = new Date();

  const expiresAt = new Date(
    startedAt.getTime() +
      assessment.timeLimit * 60 * 1000,
  );

  // --------------------------------------
  // Create Attempt
  // --------------------------------------

  let attempt;

  try {
    attempt = await AssessmentAttempt.create({
      assessment: assessment._id,
      student: studentId,
      enrollment: enrollment._id,
      attemptNumber: attempts.length + 1,
      questionSet: questions.map(
        (question) => question._id,
      ),
      totalMarks,
      startedAt,
      expiresAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error(
        "You already have an active assessment attempt.",
      );
    }

    throw error;
  }

  // --------------------------------------
  // Never expose correct answers
  // --------------------------------------

  const safeQuestions = questions.map(
    (question) => ({
      _id: question._id,
      question: question.question,
      questionType: question.questionType,
      options: question.options,
      explanation: question.explanation,
      points: question.points,
      order: question.order,
    }),
  );

  return {
    success: true,
    message: "Assessment started successfully.",
    data: {
      attemptId: attempt._id,
      assessmentId: assessment._id,
      attemptNumber: attempt.attemptNumber,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      timeLimit: assessment.timeLimit,
      totalQuestions: safeQuestions.length,
      totalMarks,
      questions: safeQuestions,
    },
  };
};

// ======================================
// Submit Assessment
// ======================================

const submitAssessment = async (
  attemptId,
  studentId,
  answers,
) => {
  if (!isValidObjectId(attemptId)) {
    throw new Error("Invalid assessment attempt ID.");
  }

  if (!Array.isArray(answers)) {
    throw new Error(
      "Answers must be an array.",
    );
  }

  const attempt =
    await AssessmentAttempt.findById(attemptId);

  if (!attempt) {
    throw new Error(
      "Assessment attempt not found.",
    );
  }

  if (
    attempt.student.toString() !==
    studentId.toString()
  ) {
    throw new Error("Unauthorized.");
  }

  if (attempt.status !== "in_progress") {
    throw new Error(
      "Assessment has already been submitted.",
    );
  }

  const assessment = await Assessment.findById(
    attempt.assessment,
  );

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  // --------------------------------------
  // Time Enforcement
  // --------------------------------------

  const now = new Date();

  if (now > attempt.expiresAt) {
    attempt.status = "expired";
    attempt.submittedAt = now;

    await attempt.save();

    throw new Error(
      "Assessment time limit has expired.",
    );
  }

  // --------------------------------------
  // Only Questions From This Attempt
  // --------------------------------------

  const questions =
    await AssessmentQuestion.find({
      _id: {
        $in: attempt.questionSet,
      },
      assessment: assessment._id,
      status: "published",
    }).lean();

  if (
    questions.length !== attempt.questionSet.length
  ) {
    throw new Error(
      "Assessment questions are no longer available.",
    );
  }

  // --------------------------------------
  // Prevent Duplicate Answer Entries
  // --------------------------------------

  const seenQuestions = new Set();

  for (const answer of answers) {
    if (!answer?.questionId) {
      throw new Error(
        "Every answer must contain a questionId.",
      );
    }

    if (seenQuestions.has(answer.questionId)) {
      throw new Error(
        "Duplicate answers are not allowed.",
      );
    }

    seenQuestions.add(answer.questionId);
  }

  // --------------------------------------
  // Validate Question IDs
  // --------------------------------------

  const allowedQuestionIds = new Set(
    attempt.questionSet.map((id) =>
      id.toString(),
    ),
  );

  for (const answer of answers) {
    if (
      !allowedQuestionIds.has(
        String(answer.questionId),
      )
    ) {
      throw new Error(
        "One or more submitted questions do not belong to this assessment attempt.",
      );
    }
  }

  // --------------------------------------
  // Grade
  // --------------------------------------

  let earnedScore = 0;
  let totalScore = 0;

  const gradedAnswers = [];

  let requiresManualGrading = false;

  for (const question of questions) {
    totalScore += Number(question.points || 0);

    const submitted = answers.find(
      (answer) =>
        String(answer.questionId) ===
        String(question._id),
    );

    const selectedAnswer =
      submitted?.answer ?? null;

    let isCorrect = false;
    let pointsAwarded = 0;

    if (question.questionType === "essay") {
      requiresManualGrading = true;
    } else {
      isCorrect = answersMatch(
        question,
        selectedAnswer,
      );

      if (isCorrect) {
        pointsAwarded = question.points;
        earnedScore += pointsAwarded;
      }
    }

    gradedAnswers.push({
      question: question._id,
      selectedAnswer,
      isCorrect,
      pointsAwarded,
    });
  }

  // --------------------------------------
  // Percentage
  // --------------------------------------

  const percentage =
    totalScore === 0
      ? 0
      : Number(
          ((earnedScore / totalScore) * 100).toFixed(2),
        );

  const passed =
    !requiresManualGrading &&
    percentage >= assessment.passingScore;

  // --------------------------------------
  // Cooldown
  // --------------------------------------

  let cooldownUntil = null;

  if (!passed && assessment.cooldownDays > 0) {
    cooldownUntil = new Date(
      now.getTime() +
        assessment.cooldownDays *
          24 *
          60 *
          60 *
          1000,
    );
  }

  // --------------------------------------
  // Save Result
  // --------------------------------------

  attempt.answers = gradedAnswers;
  attempt.score = earnedScore;
  attempt.totalMarks = totalScore;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.cooldownUntil = cooldownUntil;
  attempt.submittedAt = now;

  attempt.status = requiresManualGrading
    ? "submitted"
    : "graded";

  await attempt.save();

  return {
    success: true,
    message: requiresManualGrading
      ? "Assessment submitted and is awaiting manual grading."
      : "Assessment submitted successfully.",
    data: {
      attemptId: attempt._id,
      assessmentId: attempt.assessment,
      attemptNumber: attempt.attemptNumber,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
      status: attempt.status,
      submittedAt: attempt.submittedAt,
      cooldownUntil: attempt.cooldownUntil,
      requiresManualGrading,
    },
  };
};

module.exports = {
  startAssessment,
  submitAssessment,
};