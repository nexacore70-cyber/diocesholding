const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");
const Review = require("../models/Review");

// ======================================
// Get Tutor Overview
// ======================================
const getTutorOverview = async (tutorId) => {
  const totalCourses = await Course.countDocuments({
    tutor: tutorId,
    isDeleted: false,
  });

  const publishedCourses = await Course.countDocuments({
    tutor: tutorId,
    status: "published",
    isDeleted: false,
  });

  const draftCourses = await Course.countDocuments({
    tutor: tutorId,
    status: "draft",
    isDeleted: false,
  });

  const totalStudents = await Enrollment.countDocuments({
    tutor: tutorId,
  });

  const completedStudents = await Enrollment.countDocuments({
    tutor: tutorId,
    status: "completed",
  });

  const wallet = await Wallet.findOne({
    owner: tutorId,
  });

  return {
    totalCourses,
    publishedCourses,
    draftCourses,
    totalStudents,
    completedStudents,
    availableBalance: wallet?.availableBalance || 0,
    totalEarned: wallet?.totalEarned || 0,
    totalWithdrawn: wallet?.totalWithdrawn || 0,
  };
};

// ======================================
// Get Tutor Courses
// ======================================
const getTutorCourses = async (tutorId) => {
  return Course.find({
    tutor: tutorId,
    isDeleted: false,
  })
    .select("title slug amount currency status isFeatured createdAt updatedAt")
    .sort({ createdAt: -1 });
};

// ======================================
// Get Tutor Students
// ======================================
const getTutorStudents = async (tutorId) => {
  return Enrollment.find({
    tutor: tutorId,
  })
    .populate("student", "firstName lastName email")
    .populate("course", "title")
    .sort({ createdAt: -1 });
};

// ======================================
// Get Tutor Revenue
// ======================================
const getTutorRevenue = async (tutorId) => {
  const payments = await Payment.find({
    tutor: tutorId,
    status: "successful",
  });

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return {
    totalRevenue,
    totalPayments: payments.length,
  };
};

// ======================================
// Get Monthly Revenue
// ======================================
const getTutorMonthlyRevenue = async (tutorId) => {
  return Payment.aggregate([
    {
      $match: {
        tutor: tutorId,
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        revenue: {
          $sum: "$amount",
        },
        payments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);
};

// ======================================
// Get Recent Enrollments
// ======================================
const getTutorRecentEnrollments = async (tutorId) => {
  return Enrollment.find({
    tutor: tutorId,
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(10);
};

// ======================================
// Get Recent Payments
// ======================================
const getTutorRecentPayments = async (tutorId) => {
  return Payment.find({
    tutor: tutorId,
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(10);
};

// ======================================
// Get Course Performance
// ======================================
const getTutorCoursePerformance = async (tutorId) => {
  const courses = await Course.find({
    tutor: tutorId,
    isDeleted: false,
  });

  const performance = await Promise.all(
    courses.map(async (course) => {
      const students = await Enrollment.countDocuments({
        course: course._id,
      });

      const completed = await Enrollment.countDocuments({
        course: course._id,
        status: "completed",
      });

      const revenue = await Payment.aggregate([
        {
          $match: {
            course: course._id,
            status: "successful",
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$amount",
            },
          },
        },
      ]);

      const reviews = await Review.find({
        course: course._id,
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      return {
        courseId: course._id,
        title: course.title,
        students,
        completed,
        completionRate:
          students > 0 ? Number(((completed / students) * 100).toFixed(2)) : 0,
        revenue: revenue[0]?.revenue || 0,
        averageRating: Number(averageRating.toFixed(1)),
      };
    }),
  );

  return performance.sort((a, b) => b.revenue - a.revenue);
};

// ======================================
// Get Tutor Notifications
// ======================================
const getTutorNotifications = async (tutorId) => {
  return Notification.find({
    recipient: tutorId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(20);
};

// ======================================
// Get Tutor Dashboard
// ======================================
const getTutorDashboard = async (tutorId) => {
  const overview = await getTutorOverview(tutorId);

  const courses = await getTutorCourses(tutorId);

  const students = await getTutorStudents(tutorId);

  const revenue = await getTutorRevenue(tutorId);

  const monthlyRevenue = await getTutorMonthlyRevenue(tutorId);

  const recentEnrollments = await getTutorRecentEnrollments(tutorId);

  const recentPayments = await getTutorRecentPayments(tutorId);

  const coursePerformance = await getTutorCoursePerformance(tutorId);

  const notifications = await getTutorNotifications(tutorId);

  return {
    success: true,
    message: "Tutor dashboard retrieved successfully.",
    data: {
      overview,
      revenue,
      monthlyRevenue,
      courses,
      students,
      recentEnrollments,
      recentPayments,
      coursePerformance,
      notifications,
    },
  };
};

module.exports = {
  getTutorOverview,
  getTutorCourses,
  getTutorStudents,
  getTutorRevenue,
  getTutorMonthlyRevenue,
  getTutorRecentEnrollments,
  getTutorRecentPayments,
  getTutorCoursePerformance,
  getTutorNotifications,
  getTutorDashboard,
};
