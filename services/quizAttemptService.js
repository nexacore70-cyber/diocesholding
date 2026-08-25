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

const createServiceError = (
  message,
  statusCode = 500,
) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const normalizeAnswer = (answer) => {
  if (answer === null || answer === undefined) {
    return "";
  }

  return String(answer).trim().toLowerCase();
};

const validateStudentId = (studentId) => {
  if (!isValidObjectId(studentId)) {
    throw createServiceError(
      "Invalid student identifier.",
      400,
    );
  }
};

// ======================================
// Shuffle
// ======================================

const shuffleArray = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
};

// ======================================
// Get Published Quiz
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
    isDeleted: false,
    isActive: true,
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

  const course =
    quiz.lesson.module.course;

  if (
    course.isDeleted ||
    course.status !== "published"
  ) {
    throw createServiceError(
      "The course associated with this quiz is unavailable.",
      400,
    );
  }

  // ======================================
  // Availability Window
  // ======================================

  const now = new Date();

  if (
    quiz.availableFrom &&
    now < new Date(quiz.availableFrom)
  ) {
    throw createServiceError(
      "This quiz is not yet available.",
      400,
    );
  }

  if (
    quiz.availableUntil &&
    now > new Date(quiz.availableUntil)
  ) {
    throw createServiceError(
      "This quiz is no longer available.",
      400,
    );
  }

  return quiz;
};

// ======================================
// Enrollment
// ======================================

const getStudentEnrollment = async (
  studentId,
  courseId,
) => {
  const enrollment =
    await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: "active",
    })
      .select(
        "_id student course status",
      )
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
// Existing Active Attempt
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
// Attempt Count
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
// Student Question Projection
// ======================================

const STUDENT_QUESTION_FIELDS =
  "_id question questionType options points order";

// ======================================
// Get Attempt Questions
// ======================================

const getAttemptQuestions = async (
  questionSet,
) => {
  return Question.find({
    _id: {
      $in: questionSet,
    },
    status: "published",
  })
    .select(STUDENT_QUESTION_FIELDS)
    .sort({
      order: 1,
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

  const quiz =
    await getPublishedQuiz(quizId);

  const courseId =
    quiz.lesson.module.course._id;

  const enrollment =
    await getStudentEnrollment(
      studentId,
      courseId,
    );

  // ======================================
  // Existing Active Attempt
  // ======================================

  const existingAttempt =
    await getExistingActiveAttempt(
      quizId,
      studentId,
    );

  if (existingAttempt) {
    const now = new Date();

    if (
      existingAttempt.expiresAt &&
      now >= new Date(
        existingAttempt.expiresAt,
      )
    ) {
      await QuizAttempt.updateOne(
        {
          _id: existingAttempt._id,
          status: "in_progress",
        },
        {
          $set: {
            status: "expired",
            isActive: false,
            submittedAt: now,
            timeSpent: Math.min(
              Math.max(
                0,
                Math.floor(
                  (
                    now.getTime() -
                    new Date(
                      existingAttempt.startedAt,
                    ).getTime()
                  ) / 1000,
                ),
              ),
              MAX_TIME_SPENT_SECONDS,
            ),
          },
        },
      );
    } else {
      const questions =
        await getAttemptQuestions(
          existingAttempt.questionSet,
        );

      return {
        success: true,
        message:
          "You already have an active quiz attempt.",
        resumed: true,
        data: {
          attempt: existingAttempt,
          questions,
        },
      };
    }
  }

  // ======================================
  // Maximum Attempts
  // ======================================

  const previousAttempts =
    await getAttemptCount(
      quizId,
      studentId,
    );

  const maxAttempts =
    Number(quiz.maxAttempts);

  if (
    previousAttempts >= maxAttempts
  ) {
    throw createServiceError(
      "Maximum quiz attempts reached.",
      400,
    );
  }

  // ======================================
  // Fetch Published Questions
  // ======================================

  let questions =
    await Question.find({
      quiz: quiz._id,
      status: "published",
    })
      .select(
        STUDENT_QUESTION_FIELDS,
      )
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
  // Shuffle Questions
  // ======================================

  if (quiz.shuffleQuestions) {
    questions =
      shuffleArray(questions);
  }

  // ======================================
  // Shuffle Answers
  // ======================================

  if (quiz.shuffleAnswers) {
    questions = questions.map(
      (question) => ({
        ...question,
        options:
          Array.isArray(
            question.options,
          )
            ? shuffleArray(
                question.options,
              )
            : [],
      }),
    );
  }

  // ======================================
  // Calculate Marks
  // ======================================

  const totalMarks =
    questions.reduce(
      (total, question) =>
        total +
        (Number(question.points) || 0),
      0,
    );

  const attemptNumber =
    previousAttempts + 1;

  const startedAt = new Date();

  const timeLimitMinutes =
    Number(quiz.timeLimit) || 30;

  const expiresAt = new Date(
    startedAt.getTime() +
      timeLimitMinutes *
        60 *
        1000,
  );

  // ======================================
  // Create Attempt
  // ======================================

  try {
    const attempt =
      await QuizAttempt.create({
        quiz: quiz._id,
        student: studentId,
        enrollment:
          enrollment._id,
        attemptNumber,
        questionSet:
          questions.map(
            (question) =>
              question._id,
          ),
        answers: [],
        startedAt,
        expiresAt,
        totalMarks,
        status: "in_progress",
        isActive: true,
        isDeleted: false,
      });

    return {
      success: true,
      message:
        "Quiz started successfully.",
      resumed: false,
      data: {
        attempt,
        questions,
      },
    };
  } catch (error) {
    if (error.code === 11000) {
      const activeAttempt =
        await getExistingActiveAttempt(
          quizId,
          studentId,
        );

      if (activeAttempt) {
        const questions =
          await getAttemptQuestions(
            activeAttempt.questionSet,
          );

        return {
          success: true,
          message:
            "You already have an active quiz attempt.",
          resumed: true,
          data: {
            attempt:
              activeAttempt,
            questions,
          },
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

  if (
    attempt.status !==
    "in_progress"
  ) {
    throw createServiceError(
      "This quiz attempt has already been submitted.",
      400,
    );
  }

  const quiz =
    await Quiz.findOne({
      _id: attempt.quiz,
      status: "published",
      isDeleted: false,
    }).lean();

  if (!quiz) {
    throw createServiceError(
      "Quiz not found or unavailable.",
      404,
    );
  }

  // ======================================
  // Check Expiry
  // ======================================

  const submittedAt =
    new Date();

  const expired =
    attempt.expiresAt &&
    submittedAt >=
      new Date(
        attempt.expiresAt,
      );

  // ======================================
  // Fetch Attempt Questions
  // ======================================

  const questions =
    await Question.find({
      _id: {
        $in: attempt.questionSet,
      },
      status: "published",
    })
      .sort({
        order: 1,
      })
      .lean();

  if (!questions.length) {
    throw createServiceError(
      "No valid questions found for this attempt.",
      400,
    );
  }

  // ======================================
  // Answer Map
  // ======================================

  const answerMap =
    new Map();

  for (
    const submittedAnswer of answers
  ) {
    if (
      !submittedAnswer ||
      !submittedAnswer.questionId
    ) {
      continue;
    }

    const questionId =
      String(
        submittedAnswer.questionId,
      );

    if (
      !isValidObjectId(
        questionId,
      )
    ) {
      throw createServiceError(
        `Invalid question identifier: ${questionId}`,
        400,
      );
    }

    // Only allow questions belonging
    // to this attempt.
    const belongsToAttempt =
      attempt.questionSet.some(
        (id) =>
          id.toString() ===
          questionId,
      );

    if (!belongsToAttempt) {
      throw createServiceError(
        "One or more submitted questions do not belong to this quiz attempt.",
        400,
      );
    }

    answerMap.set(
      questionId,
      submittedAnswer.answer ??
        "",
    );
  }

  // ======================================
  // Grade
  // ======================================

  let earnedScore = 0;
  let totalMarks = 0;

  const gradedAnswers = [];

  for (
    const question of questions
  ) {
    const questionId =
      question._id.toString();

    const selectedAnswer =
      answerMap.get(
        questionId,
      ) ?? "";

    const normalizedStudentAnswer =
      normalizeAnswer(
        selectedAnswer,
      );

    const normalizedCorrectAnswer =
      normalizeAnswer(
        question.correctAnswer,
      );

    const isCorrect =
      normalizedStudentAnswer !==
        "" &&
      normalizedStudentAnswer ===
        normalizedCorrectAnswer;

    const points =
      Number(
        question.points,
      ) || 0;

    const pointsAwarded =
      isCorrect ? points : 0;

    totalMarks += points;
    earnedScore +=
      pointsAwarded;

    gradedAnswers.push({
      question:
        question._id,
      selectedAnswer:
        String(
          selectedAnswer,
        ).trim(),
      isCorrect,
      pointsAwarded,
    });
  }

  // ======================================
  // Percentage
  // ======================================

  const percentage =
    totalMarks > 0
      ? Number(
          (
            (earnedScore /
              totalMarks) *
            100
          ).toFixed(2),
        )
      : 0;

  const passed =
    percentage >=
    Number(
      quiz.passingScore,
    );

  // ======================================
  // Time
  // ======================================

  const calculatedTimeSpent =
    Math.max(
      0,
      Math.floor(
        (
          submittedAt.getTime() -
          new Date(
            attempt.startedAt,
          ).getTime()
        ) / 1000,
      ),
    );

  const timeSpent =
    Math.min(
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
        status:
          "in_progress",
        isDeleted: false,
      },
      {
        $set: {
          answers:
            gradedAnswers,
          score:
            earnedScore,
          totalMarks,
          percentage,
          passed,
          submittedAt,
          timeSpent,
          status: expired
            ? "expired"
            : "graded",
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
    message: expired
      ? "Quiz time expired. Your answers have been submitted."
      : "Quiz submitted successfully.",
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
        "title description instructions passingScore maxAttempts timeLimit showCorrectAnswers allowReview",
      )
      .populate(
        "enrollment",
        "course status",
      )
      .populate(
        "answers.question",
        "question questionType options points explanation",
      )
      .lean();

  if (!attempt) {
    throw createServiceError(
      "Quiz attempt not found.",
      404,
    );
  }

  // ======================================
  // Expire stale attempt when retrieved
  // ======================================

  if (
    attempt.status ===
      "in_progress" &&
    attempt.expiresAt &&
    new Date() >=
      new Date(
        attempt.expiresAt,
      )
  ) {
    await QuizAttempt.updateOne(
      {
        _id: attempt._id,
        status:
          "in_progress",
      },
      {
        $set: {
          status: "expired",
          isActive: false,
          submittedAt:
            new Date(),
        },
      },
    );

    attempt.status =
      "expired";
    attempt.isActive =
      false;
  }

  return {
    success: true,
    data: attempt,
  };
};

// ======================================
// Get Student Attempts
// ======================================

const getStudentQuizAttempts =
  async (
    studentId,
    quizId,
  ) => {
    validateStudentId(
      studentId,
    );

    const query = {
      student: studentId,
      isDeleted: false,
    };

    if (
      quizId !== undefined
    ) {
      if (
        !isValidObjectId(
          quizId,
        )
      ) {
        throw createServiceError(
          "Invalid quiz identifier.",
          400,
        );
      }

      query.quiz =
        quizId;
    }

    const attempts =
      await QuizAttempt.find(
        query,
      )
        .populate(
          "quiz",
          "title passingScore maxAttempts timeLimit",
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      success: true,
      count:
        attempts.length,
      data: attempts,
    };
  };

module.exports = {
  startQuiz,
  submitQuiz,
  getQuizAttemptById,
  getStudentQuizAttempts,
};