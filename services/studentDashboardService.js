const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Assignment = require("../models/Assignment");
const QuizAttempt = require("../models/QuizAttempt");
const Certificate = require("../models/Certificate");
const Wishlist = require("../models/Wishlist");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

// ======================================
// Student Dashboard Overview
// ======================================
const getStudentOverview = async (studentId) => {
  const totalEnrollments = await Enrollment.countDocuments({
    student: studentId,
  });

  const activeCourses = await Enrollment.countDocuments({
    student: studentId,
    status: "active",
  });

  const completedCourses = await Enrollment.countDocuments({
    student: studentId,
    status: "completed",
  });

  const certificates = await Certificate.countDocuments({
    student: studentId,
  });

  const wishlist = await Wishlist.countDocuments({
    student: studentId,
  });

  return {
    totalEnrollments,
    activeCourses,
    completedCourses,
    certificates,
    wishlist,
  };
};

// ======================================
// My Courses
// ======================================
const getMyCourses = async (studentId) => {
  return Enrollment.find({
    student: studentId,
  })
    .populate("course")
    .sort({
      createdAt: -1,
    });
};

// ======================================
// Continue Learning
// ======================================
const getContinueLearning = async (studentId) => {
  return LessonProgress.find({
    student: studentId,
    completed: false,
  })
    .populate("lesson")
    .sort({
      updatedAt: -1,
    })
    .limit(10);
};

// ======================================
// Recent Lessons
// ======================================
const getRecentLessons = async (studentId) => {
  return LessonProgress.find({
    student: studentId,
  })
    .populate("lesson")
    .sort({
      updatedAt: -1,
    })
    .limit(10);
};

// ======================================
// Upcoming Assignments
// ======================================
const getUpcomingAssignments = async (studentId) => {
  const enrollments = await Enrollment.find({
    student: studentId,
  }).select("course");

  const courseIds = enrollments.map((enrollment) => enrollment.course);

  return Assignment.find({
    course: {
      $in: courseIds,
    },
    dueDate: {
      $gte: new Date(),
    },
  })
    .populate("course", "title")
    .sort({
      dueDate: 1,
    })
    .limit(10);
};

// ======================================
// Quiz History
// ======================================
const getQuizHistory = async (studentId) => {
  return QuizAttempt.find({
    student: studentId,
  })
    .populate("quiz", "title")
    .sort({
      createdAt: -1,
    })
    .limit(10);
};

// ======================================
// Student Certificates
// ======================================
const getStudentCertificates = async (studentId) => {
  return Certificate.find({
    student: studentId,
  })
    .populate("course", "title")
    .sort({
      createdAt: -1,
    });
};

// ======================================
// Wishlist
// ======================================
const getStudentWishlist = async (studentId) => {
  return Wishlist.find({
    student: studentId,
  })
    .populate("course")
    .sort({
      createdAt: -1,
    });
};

// ======================================
// Recent Payments
// ======================================
const getRecentPayments = async (studentId) => {
  return Payment.find({
    student: studentId,
  })
    .populate("course", "title")
    .sort({
      createdAt: -1,
    })
    .limit(10);
};

// ======================================
// Notifications
// ======================================
const getStudentNotifications = async (studentId) => {
  return Notification.find({
    recipient: studentId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(20);
};

// ======================================
// Learning Progress
// ======================================
const getLearningProgress = async (studentId) => {
  const enrollments = await Enrollment.find({
    student: studentId,
  });

  const progress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const completedLessons = await LessonProgress.countDocuments({
        student: studentId,
        course: enrollment.course,
        completed: true,
      });

      const totalLessons = await Lesson.countDocuments({
        course: enrollment.course,
      });

      return {
        course: enrollment.course,
        completedLessons,
        totalLessons,
        progress:
          totalLessons > 0
            ? Number(((completedLessons / totalLessons) * 100).toFixed(2))
            : 0,
      };
    }),
  );

  return progress;
};

// ======================================
// Complete Student Dashboard
// ======================================
const getStudentDashboard = async (studentId) => {
  const overview = await getStudentOverview(studentId);

  const myCourses = await getMyCourses(studentId);

  const continueLearning = await getContinueLearning(studentId);

  const recentLessons = await getRecentLessons(studentId);

  const upcomingAssignments = await getUpcomingAssignments(studentId);

  const quizHistory = await getQuizHistory(studentId);

  const certificates = await getStudentCertificates(studentId);

  const wishlist = await getStudentWishlist(studentId);

  const recentPayments = await getRecentPayments(studentId);

  const notifications = await getStudentNotifications(studentId);

  const learningProgress = await getLearningProgress(studentId);

  return {
    success: true,
    message: "Student dashboard retrieved successfully.",
    data: {
      overview,
      myCourses,
      continueLearning,
      recentLessons,
      upcomingAssignments,
      quizHistory,
      certificates,
      wishlist,
      recentPayments,
      notifications,
      learningProgress,
    },
  };
};

module.exports = {
  getStudentOverview,
  getMyCourses,
  getContinueLearning,
  getRecentLessons,
  getUpcomingAssignments,
  getQuizHistory,
  getStudentCertificates,
  getStudentWishlist,
  getRecentPayments,
  getStudentNotifications,
  getLearningProgress,
  getStudentDashboard,
};
