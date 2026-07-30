const Assessment = require("../models/Assessment");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const AssessmentQuestion = require("../models/AssessmentQuestion");
const Enrollment = require("../models/Enrollment");

// ======================================
// Start Assessment
// ======================================
const startAssessment = async (assessmentId, studentId) => {
  const assessment = await Assessment.findById(assessmentId).populate("course");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  if (assessment.status !== "published") {
    throw new Error("Assessment is not available.");
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: assessment.course._id,
    status: {
      $in: ["active", "completed"],
    },
  });

  if (!enrollment) {
    throw new Error("You are not enrolled in this course.");
  }

  const previousAttempts = await AssessmentAttempt.find({
    assessment: assessmentId,
    student: studentId,
  }).sort({
    attemptNumber: -1,
  });

  if (previousAttempts.length >= assessment.maxAttempts) {
    throw new Error("Maximum assessment attempts reached.");
  }

  if (previousAttempts.length > 0) {
    const lastAttempt = previousAttempts[0];

    if (lastAttempt.cooldownUntil && new Date() < lastAttempt.cooldownUntil) {
      throw new Error(
        `You can retake this assessment after ${lastAttempt.cooldownUntil.toDateString()}.`,
      );
    }
  }

  const attempt = await AssessmentAttempt.create({
    assessment: assessmentId,
    student: studentId,
    enrollment: enrollment._id,
    attemptNumber: previousAttempts.length + 1,
  });

  return {
    success: true,
    message: "Assessment started successfully.",
    data: attempt,
  };
};

// ======================================
// Submit Assessment
// ======================================
const submitAssessment = async (attemptId, studentId, answers) => {
  const attempt = await AssessmentAttempt.findById(attemptId);

  if (!attempt) {
    throw new Error("Assessment attempt not found.");
  }

  if (attempt.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized.");
  }

  if (attempt.status !== "in_progress") {
    throw new Error("Assessment already submitted.");
  }

  const assessment = await Assessment.findById(attempt.assessment);

  const questions = await AssessmentQuestion.find({
    assessment: assessment._id,
    status: "published",
  }).sort({
    order: 1,
  });

  if (!questions.length) {
    throw new Error("No published questions found.");
  }

  let totalScore = 0;
  let earnedScore = 0;

  const gradedAnswers = [];

  for (const question of questions) {
    totalScore += question.points;

    const studentAnswer = answers.find(
      (a) => a.questionId === question._id.toString(),
    );

    const selectedAnswer = studentAnswer ? studentAnswer.answer : "";

    const isCorrect = selectedAnswer === question.correctAnswer;

    const pointsAwarded = isCorrect ? question.points : 0;

    if (isCorrect) {
      earnedScore += question.points;
    }

    gradedAnswers.push({
      question: question._id,
      selectedAnswer,
      isCorrect,
      pointsAwarded,
    });
  }

  const percentage = totalScore === 0 ? 0 : (earnedScore / totalScore) * 100;

  const passed = percentage >= assessment.passingScore;

  attempt.answers = gradedAnswers;
  attempt.score = earnedScore;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  attempt.status = "submitted";

  if (!passed) {
    attempt.cooldownUntil = new Date(
      Date.now() + assessment.cooldownDays * 24 * 60 * 60 * 1000,
    );
  }

  await attempt.save();

  return {
    success: true,
    message: "Assessment submitted successfully.",
    data: attempt,
  };
};

module.exports = {
  startAssessment,
  submitAssessment,
};
