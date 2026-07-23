const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const Question = require("../models/Question");

// =========================
// Start Quiz
// =========================
const startQuiz = async (quizId, studentId) => {
  // Find quiz and populate Lesson -> Module -> Course
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

  if (!quiz.lesson) {
    throw new Error("The lesson associated with this quiz no longer exists.");
  }

  if (!quiz.lesson.module) {
    throw new Error("The module associated with this lesson no longer exists.");
  }

  if (!quiz.lesson.module.course) {
    throw new Error("The course associated with this module no longer exists.");
  }

  if (quiz.status !== "published") {
    throw new Error("This quiz is not available.");
  }

  const course = quiz.lesson.module.course;

  // ===== DEBUG =====
  console.log("========== START QUIZ DEBUG ==========");
  console.log("Student ID:", studentId);
  console.log("Course ID:", course._id);

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: course._id,
    status: "active",
  });

  console.log("Enrollment Found:", enrollment);
  console.log("======================================");
  // =================

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
// Submit Quiz (Phase 1)
// =========================
// Submit Quiz
const submitQuiz = async (attemptId, studentId, answers) => {
  // Find quiz attempt
  const attempt = await QuizAttempt.findById(attemptId);

  if (!attempt) {
    throw new Error("Quiz attempt not found.");
  }

  // Ensure the student owns this attempt
  if (attempt.student.toString() !== studentId.toString()) {
    throw new Error("You are not allowed to submit this quiz.");
  }

  // Ensure it hasn't already been submitted
  if (attempt.status !== "in_progress") {
    throw new Error("This quiz has already been submitted.");
  }

  // Find quiz
  const quiz = await Quiz.findById(attempt.quiz);

  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  // Load all published questions
  const questions = await Question.find({
    quiz: quiz._id,
    status: "published",
  }).sort({ order: 1 });

  if (questions.length === 0) {
    throw new Error("This quiz has no published questions.");
  }

  let totalScore = 0;
  let earnedScore = 0;
  const gradedAnswers = [];

  console.log("Student Answers:", answers);

  for (const question of questions) {
    totalScore += question.points;

    console.log("Question ID:", question._id.toString());

    const studentAnswer = answers.find(
      (a) => a.questionId === question._id.toString()
    );

    console.log("Matched Answer:", studentAnswer);

    const selectedAnswer = studentAnswer
      ? studentAnswer.answer
      : "";

    const isCorrect =
      selectedAnswer === question.correctAnswer;

    const pointsAwarded = isCorrect
      ? question.points
      : 0;

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
      : (earnedScore / totalScore) * 100;

  const passed = percentage >= quiz.passingScore;

 // Save the quiz attempt
attempt.answers = gradedAnswers;
attempt.score = earnedScore;
attempt.percentage = percentage;
attempt.passed = passed;
attempt.submittedAt = new Date();
attempt.status = "submitted";

await attempt.save();

return {
  success: true,
  message: "Quiz submitted successfully.",
  data: attempt,
};
module.exports = {
  startQuiz,
  submitQuiz,
}
 };