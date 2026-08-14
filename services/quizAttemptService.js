const mongoose = require("mongoose");

const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const Question = require("../models/Question");

// ======================================
// Constants
// ======================================

const MAX_TIME_SPENT_SECONDS = 7 * 24 * 60 * 60;

// ======================================
// Helpers
// ======================================

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeAnswer = (answer) => {
  if (answer === null || answer === undefined) {
    return "";
  }

  return String(answer).trim().toLowerCase();
};

// ======================================
// Validate Student
// ======================================

const validateStudentId = (studentId) => {
  if (!isValidObjectId(studentId)) {
    throw createServiceError(
      "Invalid student identifier.",
      400,
    );
  }
};

// ======================================
// Get Quiz
// ======================================

const getPublishedQuiz = async (quizId) => {
  if (!isValidObjectId(quizId)) {
    throw createServiceError(
      "Invalid quiz identifier.",
      400,
    );
  }

  const quiz = await Quiz.findOne({
    _id: quizId,
    status: "published",
  })
    .populate({
      path: "lesson",
      select: "title module",
      populate: {
        path: "module",
        select: "title course",
        populate: {
          path: "course",
          select: "title status isDeleted",
        },
      },
    })
    .lean();

  if (!quiz) {
    throw createServiceError(
      "Quiz not found or unavailable.",
      404,
    );
  }

  if (
    !quiz.lesson ||
    !quiz.lesson.module ||
    !quiz.lesson.module.course
  ) {
    throw createServiceError(
      "This quiz is not properly linked to a course.",
      500,
    );
  }

  if (quiz.lesson.module.course.isDeleted) {
    throw createServiceError(
      "The course associated with this quiz is unavailable.",
      400,
    );
  }

  return quiz;
};

// ======================================
// Validate Enrollment
// ======================================

const getStudentEnrollment = async (
  studentId,
  courseId,
) => {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: "active",
  })
    .select("_id student course status")
    .lean();

  if (!enrollment) {
    throw createServiceError(
      "You are not actively enrolled in this course.",
      403,
    );
  }

  return enrollment;
};

// ======================================
// Get Attempt Count
// ======================================

const getAttemptCount = async (
  quizId,
  studentId,
) => {
  return QuizAttempt.countDocuments({
    quiz: quizId,
    student: studentId,
    isDeleted: false,
  });
};

// ======================================
// Check Existing Active Attempt
// ======================================

const getExistingActiveAttempt = async (
  quizId,
  studentId,
) => {
  return QuizAttempt.findOne({
    quiz: quizId,
    student: studentId,
    status: "in_progress",
    isActive: true,
    isDeleted: false,
  })
    .sort({
      startedAt: -1,
    })
    .lean();
};

// ======================================
// Start Quiz
// ======================================

const startQuiz = async (
  quizId,
  studentId,
) => {
  validateStudentId(studentId);

  const quiz = await getPublishedQuiz(quizId);

  const courseId = quiz.lesson.module.course._id;

  const enrollment = await getStudentEnrollment(
    studentId,
    courseId,
  );

  // ======================================
  // Prevent Multiple Active Attempts
  // ======================================

  const existingAttempt =
    await getExistingActiveAttempt(
      quizId,
      studentId,
    );

  if (existingAttempt) {
    return {
      success: true,
      message: "You already have an active quiz attempt.",
      data: existingAttempt,
      resumed: true,
    };
  }

  // ======================================
  // Maximum Attempts
  // ======================================

  const previousAttempts =
    await getAttemptCount(
      quizId,
      studentId,
    );

  const maxAttempts = Number(quiz.maxAttempts);

  if (
    Number.isInteger(maxAttempts) &&
    maxAttempts > 0 &&
    previousAttempts >= maxAttempts
  ) {
    throw createServiceError(
      "Maximum quiz attempts reached.",
      400,
    );
  }

  const attemptNumber =
    previousAttempts + 1;

  // ======================================
  // Create Attempt
  // ======================================

  try {
    const attempt =
      await QuizAttempt.create({
        quiz: quiz._id,
        student: studentId,
        enrollment: enrollment._id,
        attemptNumber,
        answers: [],
        startedAt: new Date(),
        status: "in_progress",
        isActive: true,
        isDeleted: false,
      });

    return {
      success: true,
      message: "Quiz started successfully.",
      data: attempt,
      resumed: false,
    };
  } catch (error) {
    // ======================================
    // Handle Concurrent Attempt Creation
    // ======================================

    if (error.code === 11000) {
      const activeAttempt =
        await getExistingActiveAttempt(
          quizId,
          studentId,
        );

      if (activeAttempt) {
        return {
          success: true,
          message:
            "You already have an active quiz attempt.",
          data: activeAttempt,
          resumed: true,
        };
      }

      throw createServiceError(
        "Unable to create quiz attempt. Please try again.",
        409,
      );
    }

    throw error;
  }
};

// ======================================
// Submit Quiz
// ======================================

const submitQuiz = async (
  attemptId,
  studentId,
  answers,
) => {
  validateStudentId(studentId);

  if (!isValidObjectId(attemptId)) {
    throw createServiceError(
      "Invalid quiz attempt identifier.",
      400,
    );
  }

  if (!Array.isArray(answers)) {
    throw createServiceError(
      "Answers must be an array.",
      400,
    );
  }

  // ======================================
  // Fetch Attempt
  // ======================================

  const attempt =
    await QuizAttempt.findOne({
      _id: attemptId,
      student: studentId,
      isDeleted: false,
    });

  if (!attempt) {
    throw createServiceError(
      "Quiz attempt not found.",
      404,
    );
  }

  if (attempt.status !== "in_progress") {
    throw createServiceError(
      "This quiz attempt has already been submitted.",
      400,
    );
  }

  // ======================================
  // Fetch Quiz
  // ======================================

  const quiz = await Quiz.findById(
    attempt.quiz,
  ).lean();

  if (!quiz) {
    throw createServiceError(
      "Quiz not found.",
      404,
    );
  }

  if (quiz.status !== "published") {
    throw createServiceError(
      "This quiz is no longer available.",
      400,
    );
  }

  // ======================================
  // Fetch Published Questions
  // ======================================

  const questions = await Question.find({
    quiz: quiz._id,
    status: "published",
    isDeleted: {
      $ne: true,
    },
  })
    .sort({
      order: 1,
      createdAt: 1,
    })
    .lean();

  if (!questions.length) {
    throw createServiceError(
      "This quiz has no published questions.",
      400,
    );
  }

  // ======================================
  // Normalize Submitted Answers
  // ======================================

  const answerMap = new Map();

  for (const submittedAnswer of answers) {
    if (
      !submittedAnswer ||
      !submittedAnswer.questionId
    ) {
      continue;
    }

    const questionId =
      String(submittedAnswer.questionId);

    if (!isValidObjectId(questionId)) {
      throw createServiceError(
        `Invalid question identifier: ${questionId}`,
        400,
      );
    }

    // Prevent duplicate answers for the same question.
    answerMap.set(
      questionId,
      submittedAnswer.answer ?? "",
    );
  }

  // ======================================
  // Grade Quiz
  // ======================================

  let totalScore = 0;
  let earnedScore = 0;

  const gradedAnswers = [];

  for (const question of questions) {
    const questionId =
      question._id.toString();

    const selectedAnswer =
      answerMap.get(questionId) ?? "";

    const normalizedStudentAnswer =
      normalizeAnswer(selectedAnswer);

    const normalizedCorrectAnswer =
      normalizeAnswer(
        question.correctAnswer,
      );

    const isCorrect =
      normalizedStudentAnswer !== "" &&
      normalizedStudentAnswer ===
      normalizedCorrectAnswer;

    const points =
      Number(question.points) || 0;

    const pointsAwarded =
      isCorrect ? points : 0;

    totalScore += points;
    earnedScore += pointsAwarded;

    gradedAnswers.push({
      question: question._id,
      selectedAnswer: String(
        selectedAnswer,
      ).trim(),
      isCorrect,
      pointsAwarded,
    });
  }

  // ======================================
  // Calculate Percentage
  // ======================================

  const percentage =
    totalScore > 0
      ? Number(
        (
          (earnedScore / totalScore) *
          100
        ).toFixed(2),
      )
      : 0;

  const passingScore =
    Number(quiz.passingScore) || 0;

  const passed =
    percentage >= passingScore;

  // ======================================
  // Calculate Time Spent
  // ======================================

  const submittedAt = new Date();

  const calculatedTimeSpent = Math.max(
    0,
    Math.floor(
      (submittedAt.getTime() -
        attempt.startedAt.getTime()) /
      1000,
    ),
  );

  const timeSpent = Math.min(
    calculatedTimeSpent,
    MAX_TIME_SPENT_SECONDS,
  );

  // ======================================
  // Atomic Submission
  // ======================================

  const updatedAttempt =
    await QuizAttempt.findOneAndUpdate(
      {
        _id: attempt._id,
        student: studentId,
        status: "in_progress",
        isDeleted: false,
      },
      {
        $set: {
          answers: gradedAnswers,
          score: earnedScore,
          totalMarks: totalScore,
          percentage,
          passed,
          submittedAt,
          timeSpent,
          status: "graded",
          isActive: false,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

  if (!updatedAttempt) {
    throw createServiceError(
      "This quiz attempt has already been submitted.",
      409,
    );
  }

  return {
    success: true,
    message: "Quiz submitted successfully.",
    data: updatedAttempt,
  };
};

// ======================================
// Get Attempt By ID
// ======================================

const getQuizAttemptById = async (
  attemptId,
  studentId,
) => {
  validateStudentId(studentId);

  if (!isValidObjectId(attemptId)) {
    throw createServiceError(
      "Invalid quiz attempt identifier.",
      400,
    );
  }

  const attempt =
    await QuizAttempt.findOne({
      _id: attemptId,
      student: studentId,
      isDeleted: false,
    })
      .populate(
        "quiz",
        "title passingScore maxAttempts",
      )
      .populate(
        "enrollment",
        "course status",
      )
      .populate(
        "answers.question",
        "question options points",
      )
      .lean();

  if (!attempt) {
    throw createServiceError(
      "Quiz attempt not found.",
      404,
    );
  }

  return {
    success: true,
    data: attempt,
  };
};

// ======================================
// Get Student Quiz Attempts
// ======================================

const getStudentQuizAttempts = async (
  studentId,
  quizId,
) => {
  validateStudentId(studentId);

  const query = {
    student: studentId,
    isDeleted: false,
  };

  if (quizId !== undefined) {
    if (!isValidObjectId(quizId)) {
      throw createServiceError(
        "Invalid quiz identifier.",
        400,
      );
    }

    query.quiz = quizId;
  }

  const attempts =
    await QuizAttempt.find(query)
      .populate(
        "quiz",
        "title passingScore maxAttempts",
      )
      .sort({
        createdAt: -1,
      })
      .lean();

  return {
    success: true,
    count: attempts.length,
    data: attempts,
  };
};

// ======================================
// Export
// ======================================

module.exports = {
  startQuiz,
  submitQuiz,
  getQuizAttemptById,
  getStudentQuizAttempts,
};