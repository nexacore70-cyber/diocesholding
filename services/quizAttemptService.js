const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const Question = require("../models/Question");

// =========================
// Start Quiz
// =========================
const startQuiz = async (quizId, studentId) => {
  const quiz = await Quiz.findById(quizId).populate({
    path: "lesson",
    populate: {
      path: "module",
      populate: {
        path: "course",
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  if (!quiz.lesson?.module?.course) {
    throw new Error("This quiz is not properly linked to a course.");
  }

  if (quiz.status !== "published") {
    throw new Error("This quiz is not available.");
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: quiz.lesson.module.course._id,
    status: "active",
  }).lean();

  if (!enrollment) {
    throw new Error("You are not enrolled in this course.");
  }

  const previousAttempts = await QuizAttempt.countDocuments({
    quiz: quizId,
    student: studentId,
  });

  if (previousAttempts >= quiz.maxAttempts) {
    throw new Error("Maximum quiz attempts reached.");
  }

  const attempt = await QuizAttempt.create({
    quiz: quizId,
    student: studentId,
    enrollment: enrollment._id,
    attemptNumber: previousAttempts + 1,
  });

  return {
    success: true,
    message: "Quiz started successfully.",
    data: attempt,
  };
};

// =========================
// Submit Quiz
// =========================
const submitQuiz = async (attemptId, studentId, answers) => {
  if (!Array.isArray(answers)) {
    throw new Error("Answers must be an array.");
  }

  const attempt = await QuizAttempt.findById(attemptId);

  if (!attempt) {
    throw new Error("Quiz attempt not found.");
  }

  if (attempt.student.toString() !== studentId.toString()) {
    throw new Error("You are not allowed to submit this quiz.");
  }

  if (attempt.status !== "in_progress") {
    throw new Error("This quiz has already been submitted.");
  }

  const quiz = await Quiz.findById(attempt.quiz);

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  const questions = await Question.find({
    quiz: quiz._id,
    status: "published",
  }).sort({ order: 1 });

  if (!questions.length) {
    throw new Error("This quiz has no published questions.");
  }

  let totalScore = 0;
  let earnedScore = 0;

  const gradedAnswers = [];

  for (const question of questions) {
    totalScore += question.points;

    const studentAnswer = answers.find(
      (a) => a.questionId === question._id.toString(),
    );

    const selectedAnswer = studentAnswer?.answer ?? "";

    const isCorrect =
      String(selectedAnswer).trim().toLowerCase() ===
      String(question.correctAnswer).trim().toLowerCase();

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

  const percentage =
    totalScore === 0
      ? 0
      : Number(((earnedScore / totalScore) * 100).toFixed(2));

  const passed = percentage >= quiz.passingScore;

  attempt.answers = gradedAnswers;
  attempt.score = earnedScore;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  attempt.status = "graded";

  await attempt.save();

  return {
    success: true,
    message: "Quiz submitted successfully.",
    data: attempt,
  };
};

module.exports = {
  startQuiz,
  submitQuiz,
};
