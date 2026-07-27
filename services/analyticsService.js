const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const Wallet = require("../models/Wallet");
const Withdrawal = require("../models/Withdrawal");

// ======================================
// Get Monthly Revenue
// ======================================
const getMonthlyRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        totalRevenue: {
          $sum: "$amount",
        },
        totalPayments: {
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

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return revenue.map((item) => ({
    year: item._id.year,
    month: months[item._id.month],
    revenue: item.totalRevenue,
    payments: item.totalPayments,
  }));
};

// ======================================
// Get Revenue by Payment Gateway
// ======================================
const getRevenueByGateway = async () => {
  const gateways = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: "$gateway",
        totalPayments: {
          $sum: 1,
        },
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
  ]);

  return gateways.map((gateway) => ({
    gateway: gateway._id || "Unknown",
    payments: gateway.totalPayments,
    revenue: gateway.totalRevenue,
  }));
};

// ======================================
// Get Overall Course Completion Analytics
// ======================================
const getCourseCompletionAnalytics = async () => {
  const totalCompleted = await Enrollment.countDocuments({
    status: "completed",
  });

  const totalActive = await Enrollment.countDocuments({
    status: "active",
  });

  const totalEnrollments = await Enrollment.countDocuments();

  const completionRate =
    totalEnrollments > 0
      ? Number(((totalCompleted / totalEnrollments) * 100).toFixed(2))
      : 0;

  return {
    totalCompleted,
    totalActive,
    totalEnrollments,
    completionRate,
  };
};

// ======================================
// Get Monthly User Growth
// ======================================
const getMonthlyUserGrowth = async () => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        totalUsers: {
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

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return users.map((item) => ({
    year: item._id.year,
    month: months[item._id.month],
    users: item.totalUsers,
  }));
};

// ======================================
// Get Top Selling Courses
// ======================================
const getTopSellingCourses = async () => {
  const courses = await Enrollment.aggregate([
    {
      $group: {
        _id: "$course",
        totalStudents: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalStudents: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $project: {
        _id: 0,
        courseId: "$course._id",
        title: "$course.title",
        slug: "$course.slug",
        amount: "$course.pricing.amount",
        currency: "$course.pricing.currency",
        isFree: "$course.pricing.isFree",
        totalStudents: 1,
        tutor: "$course.tutor",
      },
    },
  ]);

  return courses;
};

// ======================================
// Dashboard Overview
// ======================================

const getOverviewStats = async () => {
  const totalEnrollments = await Enrollment.countDocuments();

  const activeStudents = await Enrollment.distinct("student", {
    status: "active",
  });

  const activeCourses = await Enrollment.distinct("course", {
    status: "active",
  });

  const successfulPayments = await Payment.countDocuments({
    status: "successful",
  });

  const totalPayments = await Payment.countDocuments();

  const revenueResult = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const totalRevenue =
    revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  const publishedCourses = await Course.countDocuments({
    status: "published",
    isDeleted: false,
  });

  const averageRevenuePerStudent =
    totalEnrollments > 0 ? totalRevenue / totalEnrollments : 0;

  const averageRevenuePerCourse =
    publishedCourses > 0 ? totalRevenue / publishedCourses : 0;

  const averageStudentsPerCourse =
    publishedCourses > 0 ? totalEnrollments / publishedCourses : 0;

  const conversionRate =
    totalPayments > 0
      ? Number(((successfulPayments / totalPayments) * 100).toFixed(2))
      : 0;

  let platformHealth = "Needs Attention";

  if (conversionRate >= 90) {
    platformHealth = "Excellent";
  } else if (conversionRate >= 70) {
    platformHealth = "Good";
  } else if (conversionRate >= 50) {
    platformHealth = "Fair";
  }

  return {
    activeStudents: activeStudents.length,
    activeCourses: activeCourses.length,
    averageRevenuePerStudent,
    averageRevenuePerCourse,
    averageStudentsPerCourse,
    conversionRate,
    platformHealth,
  };
};

// ======================================
// Activity Feed
// ======================================

const getActivityFeed = async () => {
  const activities = [];

  // ==============================
  // Recent Payments
  // ==============================

  const payments = await Payment.find({
    status: "successful",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  payments.forEach((payment) => {
    activities.push({
      type: "payment",
      title: "Payment Received",
      description: `${payment.student.firstName} ${payment.student.lastName} paid ₦${payment.amount} for ${payment.course.title}`,
      createdAt: payment.createdAt,
    });
  });

  // ==============================
  // Recent Enrollments
  // ==============================

  const enrollments = await Enrollment.find()
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  enrollments.forEach((enrollment) => {
    activities.push({
      type: "enrollment",
      title: "New Enrollment",
      description: `${enrollment.student.firstName} ${enrollment.student.lastName} enrolled in ${enrollment.course.title}`,
      createdAt: enrollment.createdAt,
    });
  });

  // ==============================
  // Recent Users
  // ==============================

  const users = await User.find()
    .select("firstName lastName roles createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  users.forEach((user) => {
    activities.push({
      type: "user",
      title: "New User",
      description: `${user.firstName} ${user.lastName} joined as ${user.roles[0]}`,
      createdAt: user.createdAt,
    });
  });

  // ==============================
  // Sort everything together
  // ==============================

  activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return activities.slice(0, 15);
};

// ======================================
// Get Top Tutors
// ======================================
const getTopTutors = async () => {
  const tutors = await Course.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "published",
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tutor",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        coursePrice: "$pricing.amount",
        totalStudents: {
          $size: "$enrollments",
        },
      },
    },
    {
      $group: {
        _id: "$tutorId",

        firstName: {
          $first: "$firstName",
        },

        lastName: {
          $first: "$lastName",
        },

        totalCourses: {
          $sum: 1,
        },

        totalStudents: {
          $sum: "$totalStudents",
        },

        totalRevenue: {
          $sum: {
            $multiply: ["$coursePrice", "$totalStudents"],
          },
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
        totalStudents: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  return tutors;
};

const getStudentDashboardAnalytics = async (studentId) => {
  // ==========================
  // OVERVIEW
  // ==========================

  const totalEnrollments = await Enrollment.countDocuments({
    student: studentId,
    isDeleted: false,
  });

  const activeCourses = await Enrollment.countDocuments({
    student: studentId,
    status: "active",
    isDeleted: false,
  });

  const completedCourses = await Enrollment.countDocuments({
    student: studentId,
    status: "completed",
    isDeleted: false,
  });

  const certificates = await Enrollment.countDocuments({
    student: studentId,
    certificateIssued: true,
    isDeleted: false,
  });

  const completionRate =
    totalEnrollments > 0
      ? Number(((completedCourses / totalEnrollments) * 100).toFixed(2))
      : 0;

  const overview = {
    enrolledCourses: totalEnrollments,
    activeCourses,
    completedCourses,
    certificates,
    completionRate,
  };

  // ==========================
  // CONTINUE LEARNING
  // ==========================

  const continueLearning = await Enrollment.find({
    student: studentId,
    status: "active",
    isDeleted: false,
  })
    .populate("course", "title thumbnail slug")
    .sort({ updatedAt: -1 });

  // ==========================
  // RECENT ENROLLMENTS
  // ==========================

  const recentEnrollments = await Enrollment.find({
    student: studentId,
    isDeleted: false,
  })
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  // ==========================
  // RECENT PAYMENTS
  // ==========================

  const recentPayments = await Payment.find({
    student: studentId,
    isDeleted: false,
  })
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  // ==========================
  // CERTIFICATES
  // ==========================

  const studentCertificates = await Enrollment.find({
    student: studentId,
    certificateIssued: true,
    isDeleted: false,
  })
    .populate("course", "title")
    .sort({ completedAt: -1 });

  // ==========================
  // LEARNING STATISTICS
  // ==========================

  const learningStats = {
    completedLessons: 0,
    completedQuizzes: 0,
    completedAssignments: 0,
    totalLearningHours: 0,
  };

  // ==========================
  // RECENT ACTIVITY
  // ==========================

  const enrollmentActivities = recentEnrollments.map((item) => ({
    type: "enrollment",
    title: "Course Enrolled",
    description: `You enrolled in ${item.course?.title}`,
    createdAt: item.createdAt,
  }));

  const paymentActivities = recentPayments.map((item) => ({
    type: "payment",
    title: "Payment Successful",
    description: `You paid ₦${item.amount} for ${item.course?.title}`,
    createdAt: item.createdAt,
  }));

  const recentActivity = [...enrollmentActivities, ...paymentActivities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // ==========================
  // UPCOMING DEADLINES
  // ==========================

  const upcomingDeadlines = [];

  // ==========================
  // NOTIFICATIONS
  // ==========================

  let notifications = [];

  if (typeof Notification !== "undefined") {
    notifications = await Notification.find({
      recipient: studentId,
    })
      .sort({ createdAt: -1 })
      .limit(5);
  }

  // ==========================
  // RETURN
  // ==========================

  return {
    overview,
    continueLearning,
    recentEnrollments,
    recentPayments,
    certificates: studentCertificates,
    learningStats,
    recentActivity,
    upcomingDeadlines,
    notifications,
  };
};

// ======================================
// Get Course Performance
// ======================================
const getCoursePerformance = async () => {
  const performance = await Course.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "published",
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,

        students: {
          $size: "$enrollments",
        },

        completed: {
          $size: {
            $filter: {
              input: "$enrollments",
              as: "enrollment",
              cond: {
                $eq: ["$$enrollment.status", "completed"],
              },
            },
          },
        },

        revenue: {
          $multiply: [
            {
              $size: "$enrollments",
            },
            "$pricing.amount",
          ],
        },

        rating: "$ratings.average",
      },
    },
  ]);

  return performance.map((course) => ({
    ...course,
    completionRate:
      course.students === 0
        ? 0
        : Number(((course.completed / course.students) * 100).toFixed(2)),
  }));
};

// ======================================
// Get Revenue Trend
// ======================================
const getRevenueTrend = async () => {
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        revenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const current =
    revenue.find(
      (item) =>
        item._id.year === currentYear && item._id.month === currentMonth + 1,
    )?.revenue || 0;

  const previous =
    revenue.find(
      (item) =>
        item._id.year === previousYear && item._id.month === previousMonth + 1,
    )?.revenue || 0;

  let growth = 0;

  if (previous > 0) {
    growth = Number((((current - previous) / previous) * 100).toFixed(2));
  }

  return {
    currentMonth: current,
    previousMonth: previous,
    growth,
    status: growth > 0 ? "up" : growth < 0 ? "down" : "stable",
  };
};

// ======================================
// Dashboard Notifications
// ======================================

const getNotifications = async () => {
  const notifications = [];

  // Pending Withdrawals
  const pendingWithdrawals = await Withdrawal.countDocuments({
    status: "pending",
  });

  if (pendingWithdrawals > 0) {
    notifications.push({
      type: "warning",
      title: "Pending Withdrawals",
      message: `${pendingWithdrawals} withdrawal request(s) require approval.`,
    });
  }

  // Draft Courses
  const draftCourses = await Course.countDocuments({
    status: "draft",
    isDeleted: false,
  });

  if (draftCourses > 0) {
    notifications.push({
      type: "info",
      title: "Draft Courses",
      message: `${draftCourses} course(s) are still in draft.`,
    });
  }

  // Pending Payments
  const pendingPayments = await Payment.countDocuments({
    status: "pending",
  });

  if (pendingPayments > 0) {
    notifications.push({
      type: "warning",
      title: "Pending Payments",
      message: `${pendingPayments} payment(s) are awaiting completion.`,
    });
  }

  // Revenue Milestone
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

  if (totalRevenue >= 1000000) {
    notifications.push({
      type: "success",
      title: "Revenue Milestone",
      message: "Platform revenue has exceeded ₦1,000,000.",
    });
  }

  // New Tutor
  const latestTutor = await User.findOne({
    roles: "tutor",
  })
    .sort({ createdAt: -1 })
    .select("firstName lastName");

  if (latestTutor) {
    notifications.push({
      type: "info",
      title: "New Tutor",
      message: `${latestTutor.firstName} ${latestTutor.lastName} joined as a tutor.`,
    });
  }

  return notifications;
};

// ======================================
// System Health
// ======================================

const getSystemHealth = async () => {
  const database =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const totalPayments = await Payment.countDocuments();

  const successfulPayments = await Payment.countDocuments({
    status: "successful",
  });

  const paymentSuccessRate =
    totalPayments === 0
      ? 100
      : Number(((successfulPayments / totalPayments) * 100).toFixed(2));

  const totalWallets = await Wallet.countDocuments();

  const walletIntegrity = totalWallets > 0 ? "healthy" : "warning";

  return {
    database,
    apiStatus: "online",
    paymentSuccessRate,
    walletIntegrity,
  };
};

// ======================================
// Enrollment Chart
// ======================================
const getEnrollmentChart = async () => {
  const chart = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        enrollments: {
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
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: {
          $arrayElemAt: [
            [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            "$_id.month",
          ],
        },
        enrollments: 1,
      },
    },
  ]);

  return chart;
};

// ======================================
// Revenue Chart
// ======================================
const getRevenueChart = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: {
          $arrayElemAt: [
            [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            "$_id.month",
          ],
        },
        revenue: 1,
      },
    },
  ]);

  return revenue;
};

// ======================================
// User Growth Chart
// ======================================
const getUserGrowthChart = async () => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        users: {
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
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: {
          $arrayElemAt: [
            [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            "$_id.month",
          ],
        },
        users: 1,
      },
    },
  ]);

  return users;
};

// ======================================
// Course Performance Chart
// ======================================
const getCoursePerformanceChart = async () => {
  const performance = await Course.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "published",
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        _id: 0,
        courseId: "$_id",
        title: "$title",
        students: {
          $size: "$enrollments",
        },
        revenue: {
          $multiply: [
            "$pricing.amount",
            {
              $size: "$enrollments",
            },
          ],
        },
      },
    },
    {
      $sort: {
        students: -1,
      },
    },
  ]);

  return performance;
};

// ======================================
// Get Daily Revenue
// ======================================
const getDailyRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
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
        "_id.day": 1,
      },
    },
  ]);

  return revenue.map((item) => ({
    date: `${item._id.day}/${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    payments: item.payments,
  }));
};

// ======================================
// Get Weekly Revenue
// ======================================
const getWeeklyRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$createdAt" },
          week: { $isoWeek: "$createdAt" },
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
        "_id.week": 1,
      },
    },
  ]);

  return revenue.map((item) => ({
    year: item._id.year,
    week: item._id.week,
    revenue: item.revenue,
    payments: item.payments,
  }));
};

// ======================================
// Get Yearly Revenue
// ======================================
const getYearlyRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
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
      },
    },
  ]);

  return revenue.map((item) => ({
    year: item._id.year,
    revenue: item.revenue,
    payments: item.payments,
  }));
};

// ======================================
// Get Lifetime Revenue
// ======================================
const getLifetimeRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
        totalPayments: {
          $sum: 1,
        },
      },
    },
  ]);

  return revenue.length
    ? revenue[0]
    : {
        totalRevenue: 0,
        totalPayments: 0,
      };
};

// ======================================
// Get Today's Revenue
// ======================================
const getTodayRevenue = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$amount",
        },
        payments: {
          $sum: 1,
        },
      },
    },
  ]);

  return revenue.length
    ? revenue[0]
    : {
        revenue: 0,
        payments: 0,
      };
};

// ======================================
// Get Yesterday's Revenue
// ======================================
const getYesterdayRevenue = async () => {
  const start = new Date();
  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$amount",
        },
        payments: {
          $sum: 1,
        },
      },
    },
  ]);

  return revenue.length
    ? revenue[0]
    : {
        revenue: 0,
        payments: 0,
      };
};

// ======================================
// Get Monthly Enrollments
// ======================================
const getMonthlyEnrollments = async () => {
  const enrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        enrollments: {
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

  return enrollments.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    enrollments: item.enrollments,
  }));
};

// ======================================
// Get Daily Enrollments
// ======================================
const getDailyEnrollments = async () => {
  const enrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        enrollments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);

  return enrollments.map((item) => ({
    date: `${item._id.day}/${item._id.month}/${item._id.year}`,
    enrollments: item.enrollments,
  }));
};

// ======================================
// Get Weekly Enrollments
// ======================================
const getWeeklyEnrollments = async () => {
  const enrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$createdAt" },
          week: { $isoWeek: "$createdAt" },
        },
        enrollments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.week": 1,
      },
    },
  ]);

  return enrollments.map((item) => ({
    year: item._id.year,
    week: item._id.week,
    enrollments: item.enrollments,
  }));
};

// ======================================
// Get Yearly Enrollments
// ======================================
const getYearlyEnrollments = async () => {
  const enrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
        },
        enrollments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
      },
    },
  ]);

  return enrollments.map((item) => ({
    year: item._id.year,
    enrollments: item.enrollments,
  }));
};

// ======================================
// Get Enrollment Status Breakdown
// ======================================
const getEnrollmentStatusBreakdown = async () => {
  const statuses = await Enrollment.aggregate([
    {
      $group: {
        _id: "$status",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);

  return statuses.map((item) => ({
    status: item._id,
    total: item.total,
  }));
};

// ======================================
// Get Top Enrolled Courses
// ======================================
const getTopEnrolledCourses = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: "$course",
        students: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        students: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $project: {
        _id: 0,
        courseId: "$course._id",
        title: "$course.title",
        students: 1,
      },
    },
  ]);
};

// ======================================
// Get Active Students
// ======================================
const getActiveStudents = async () => {
  const students = await Enrollment.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $group: {
        _id: "$student",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        email: "$student.email",
      },
    },
  ]);

  return students;
};

// ======================================
// Get Inactive Students
// ======================================
const getInactiveStudents = async () => {
  const activeStudentIds = await Enrollment.distinct("student", {
    status: "active",
  });

  return User.find({
    roles: "student",
    _id: {
      $nin: activeStudentIds,
    },
  }).select("firstName lastName email");
};

// ======================================
// Get Student Completion Leaderboard
// ======================================
const getStudentLeaderboard = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: "$student",
        completedCourses: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },
        enrolledCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        completedCourses: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        completedCourses: 1,
        enrolledCourses: 1,
      },
    },
  ]);
};

// ======================================
// Get Student Growth
// ======================================
const getStudentGrowth = async () => {
  return User.aggregate([
    {
      $match: {
        roles: "student",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        students: {
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
// Get Students With Certificates
// ======================================
const getStudentsWithCertificates = async () => {
  return Enrollment.aggregate([
    {
      $match: {
        certificateIssued: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        completedAt: 1,
      },
    },
  ]);
};

// ======================================
// Get Student Completion Rate
// ======================================
const getStudentCompletionRate = async () => {
  const total = await Enrollment.countDocuments();

  const completed = await Enrollment.countDocuments({
    status: "completed",
  });

  return {
    totalEnrollments: total,
    completedEnrollments: completed,
    completionRate:
      total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2)),
  };
};

// ======================================
// Get Tutor Growth
// ======================================
const getTutorGrowth = async () => {
  return User.aggregate([
    {
      $match: {
        roles: "tutor",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        tutors: {
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
// Get Tutor Revenue
// ======================================
const getTutorRevenue = async () => {
  return Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tutor",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        revenue: {
          $multiply: [
            "$pricing.amount",
            {
              $size: "$enrollments",
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$tutorId",
        firstName: {
          $first: "$firstName",
        },
        lastName: {
          $first: "$lastName",
        },
        revenue: {
          $sum: "$revenue",
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Course Statistics
// ======================================
const getTutorCourseStatistics = async () => {
  return Course.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$tutor",
        totalCourses: {
          $sum: 1,
        },
        publishedCourses: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "published"],
              },
              1,
              0,
            ],
          },
        },
        draftCourses: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "draft"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        _id: 0,
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        totalCourses: 1,
        publishedCourses: 1,
        draftCourses: 1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Enrollment Statistics
// ======================================
const getTutorEnrollmentStatistics = async () => {
  return Course.aggregate([
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        tutor: 1,
        students: {
          $size: "$enrollments",
        },
      },
    },
    {
      $group: {
        _id: "$tutor",
        totalStudents: {
          $sum: "$students",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $sort: {
        totalStudents: -1,
      },
    },
    {
      $project: {
        _id: 0,
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        totalStudents: 1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Ratings
// ======================================
const getTutorRatings = async () => {
  return Course.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "published",
      },
    },
    {
      $group: {
        _id: "$tutor",
        averageRating: {
          $avg: "$ratings.average",
        },
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $project: {
        _id: 0,
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        averageRating: 1,
        totalCourses: 1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Wallet Statistics
// ======================================
const getTutorWalletStatistics = async () => {
  return Wallet.aggregate([
    {
      $match: {
        ownerType: "tutor",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        _id: 0,
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        availableBalance: 1,
        pendingBalance: 1,
        totalEarned: 1,
        totalWithdrawn: 1,
      },
    },
    {
      $sort: {
        totalEarned: -1,
      },
    },
  ]);
};

// ======================================
// Get Payment Method Analytics
// ======================================
const getPaymentMethodAnalytics = async () => {
  return Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        totalPayments: {
          $sum: 1,
        },
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
    {
      $project: {
        _id: 0,
        paymentMethod: "$_id",
        totalPayments: 1,
        totalRevenue: 1,
      },
    },
  ]);
};

// ======================================
// Get Payment Status Analytics
// ======================================
const getPaymentStatusAnalytics = async () => {
  return Payment.aggregate([
    {
      $group: {
        _id: "$status",
        total: {
          $sum: 1,
        },
        revenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        total: 1,
        revenue: 1,
      },
    },
  ]);
};

// ======================================
// Get Gateway Analytics
// ======================================
const getGatewayAnalytics = async () => {
  return Payment.aggregate([
    {
      $group: {
        _id: "$gateway",
        totalPayments: {
          $sum: 1,
        },
        successfulPayments: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "successful"],
              },
              1,
              0,
            ],
          },
        },
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
    {
      $project: {
        _id: 0,
        gateway: "$_id",
        totalPayments: 1,
        successfulPayments: 1,
        totalRevenue: 1,
      },
    },
  ]);
};

// ======================================
// Get Refund Analytics
// ======================================
const getRefundAnalytics = async () => {
  const refundedPayments = await Payment.countDocuments({
    status: "refunded",
  });

  const refundedRevenue = await Payment.aggregate([
    {
      $match: {
        status: "refunded",
      },
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return {
    refundedPayments,
    refundedAmount: refundedRevenue.length > 0 ? refundedRevenue[0].amount : 0,
  };
};

// ======================================
// Get Failed Payment Analytics
// ======================================
const getFailedPaymentAnalytics = async () => {
  return Payment.aggregate([
    {
      $match: {
        status: "failed",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        failedPayments: {
          $sum: 1,
        },
        failedAmount: {
          $sum: "$amount",
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
// Get Average Transaction Value
// ======================================
const getAverageTransactionValue = async () => {
  const stats = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
        totalPayments: {
          $sum: 1,
        },
        averageTransaction: {
          $avg: "$amount",
        },
      },
    },
  ]);

  return stats.length
    ? stats[0]
    : {
        totalRevenue: 0,
        totalPayments: 0,
        averageTransaction: 0,
      };
};

// ======================================
// Get Largest Transactions
// ======================================
const getLargestTransactions = async () => {
  return Payment.find({
    status: "successful",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      amount: -1,
    })
    .limit(10);
};

// ======================================
// Get Recent Transactions
// ======================================
const getRecentTransactions = async () => {
  return Payment.find()
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      createdAt: -1,
    })
    .limit(20);
};

// ======================================
// Get Company Wallet Analytics
// ======================================
const getCompanyWalletAnalytics = async () => {
  return Wallet.findOne({
    ownerType: "company",
  }).select(
    "availableBalance pendingBalance totalEarned totalWithdrawn totalDeposited updatedAt",
  );
};

// ======================================
// Get Tutor Wallet Leaderboard
// ======================================
const getTutorWalletLeaderboard = async () => {
  return Wallet.aggregate([
    {
      $match: {
        ownerType: "tutor",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        _id: 0,
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        availableBalance: 1,
        totalEarned: 1,
        totalWithdrawn: 1,
      },
    },
    {
      $sort: {
        totalEarned: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

// ======================================
// Get Withdrawal Analytics
// ======================================
const getWithdrawalAnalytics = async () => {
  const analytics = await Withdrawal.aggregate([
    {
      $group: {
        _id: "$status",
        totalRequests: {
          $sum: 1,
        },
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return analytics;
};

// ======================================
// Get Monthly Withdrawals
// ======================================
const getMonthlyWithdrawals = async () => {
  return Withdrawal.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        totalAmount: {
          $sum: "$amount",
        },
        totalRequests: {
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
// Get Largest Withdrawals
// ======================================
const getLargestWithdrawals = async () => {
  return Withdrawal.find()
    .populate("owner", "firstName lastName")
    .sort({
      amount: -1,
    })
    .limit(10);
};

// ======================================
// Get Pending Withdrawals
// ======================================
const getPendingWithdrawals = async () => {
  return Withdrawal.find({
    status: "pending",
  })
    .populate("owner", "firstName lastName email")
    .sort({
      createdAt: -1,
    });
};

// ======================================
// Get Wallet Summary
// ======================================
const getWalletSummary = async () => {
  const totalWallets = await Wallet.countDocuments();

  const totals = await Wallet.aggregate([
    {
      $group: {
        _id: null,
        availableBalance: {
          $sum: "$availableBalance",
        },
        pendingBalance: {
          $sum: "$pendingBalance",
        },
        totalEarned: {
          $sum: "$totalEarned",
        },
        totalWithdrawn: {
          $sum: "$totalWithdrawn",
        },
      },
    },
  ]);

  return {
    totalWallets,
    availableBalance: totals[0]?.availableBalance || 0,
    pendingBalance: totals[0]?.pendingBalance || 0,
    totalEarned: totals[0]?.totalEarned || 0,
    totalWithdrawn: totals[0]?.totalWithdrawn || 0,
  };
};

// ======================================
// Get Wallet Growth
// ======================================
const getWalletGrowth = async () => {
  return Wallet.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        wallets: {
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
// Get Course Category Analytics
// ======================================
const getCourseCategoryAnalytics = async () => {
  return Course.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$category",
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalCourses: -1,
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalCourses: 1,
      },
    },
  ]);
};

// ======================================
// Get Free vs Paid Courses
// ======================================
const getFreeVsPaidCourses = async () => {
  const freeCourses = await Course.countDocuments({
    "pricing.isFree": true,
    isDeleted: false,
  });

  const paidCourses = await Course.countDocuments({
    "pricing.isFree": false,
    isDeleted: false,
  });

  return {
    freeCourses,
    paidCourses,
  };
};

// ======================================
// Get Draft vs Published Courses
// ======================================
const getCourseStatusAnalytics = async () => {
  return Course.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$status",
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        totalCourses: 1,
      },
    },
  ]);
};

// ======================================
// Get Most Enrolled Courses
// ======================================
const getMostEnrolledCourses = async () => {
  return Course.aggregate([
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        title: 1,
        slug: 1,
        students: {
          $size: "$enrollments",
        },
      },
    },
    {
      $sort: {
        students: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

// ======================================
// Get Least Enrolled Courses
// ======================================
const getLeastEnrolledCourses = async () => {
  return Course.aggregate([
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        title: 1,
        slug: 1,
        students: {
          $size: "$enrollments",
        },
      },
    },
    {
      $sort: {
        students: 1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

// ======================================
// Get Featured Courses Analytics
// ======================================
const getFeaturedCoursesAnalytics = async () => {
  return Course.find({
    isFeatured: true,
    isDeleted: false,
  }).select("title slug pricing ratings createdAt");
};

// ======================================
// Get Average Course Price
// ======================================
const getAverageCoursePrice = async () => {
  const result = await Course.aggregate([
    {
      $match: {
        "pricing.isFree": false,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        averagePrice: {
          $avg: "$pricing.amount",
        },
        minimumPrice: {
          $min: "$pricing.amount",
        },
        maximumPrice: {
          $max: "$pricing.amount",
        },
      },
    },
  ]);

  return (
    result[0] || {
      averagePrice: 0,
      minimumPrice: 0,
      maximumPrice: 0,
    }
  );
};

// ======================================
// Get Course Ratings Analytics
// ======================================
const getCourseRatingsAnalytics = async () => {
  return Course.find({
    isDeleted: false,
  })
    .select("title ratings")
    .sort({
      "ratings.average": -1,
    });
};

// ======================================
// Get Daily Active Users
// ======================================
const getDailyActiveUsers = async () => {
  return User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          day: { $dayOfMonth: "$updatedAt" },
        },
        users: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);
};

// ======================================
// Get Monthly Active Users
// ======================================
const getMonthlyActiveUsers = async () => {
  return User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
        },
        users: {
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
// Get Role Distribution
// ======================================
const getRoleDistribution = async () => {
  return User.aggregate([
    {
      $unwind: "$roles",
    },
    {
      $group: {
        _id: "$roles",
        totalUsers: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalUsers: -1,
      },
    },
    {
      $project: {
        _id: 0,
        role: "$_id",
        totalUsers: 1,
      },
    },
  ]);
};

// ======================================
// Get New Users This Month
// ======================================
const getNewUsersThisMonth = async () => {
  const now = new Date();

  return User.find({
    createdAt: {
      $gte: new Date(now.getFullYear(), now.getMonth(), 1),
    },
  }).select("firstName lastName email roles createdAt");
};

// ======================================
// Get User Verification Analytics
// ======================================
const getUserVerificationAnalytics = async () => {
  return User.aggregate([
    {
      $group: {
        _id: "$isVerified",
        totalUsers: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        verified: "$_id",
        totalUsers: 1,
      },
    },
  ]);
};

// ======================================
// Get User Registration Trend
// ======================================
const getUserRegistrationTrend = async () => {
  return User.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        registrations: {
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
// Get Top Enrolled Students
// ======================================
const getTopEnrolledStudents = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: "$student",
        totalEnrollments: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        totalEnrollments: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        email: "$student.email",
        totalEnrollments: 1,
      },
    },
  ]);
};

// ======================================
// Get Course Completion Leaderboard
// ======================================
const getCourseCompletionLeaderboard = async () => {
  return Course.aggregate([
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        title: 1,
        completedStudents: {
          $size: {
            $filter: {
              input: "$enrollments",
              as: "enrollment",
              cond: {
                $eq: ["$$enrollment.status", "completed"],
              },
            },
          },
        },
      },
    },
    {
      $sort: {
        completedStudents: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

// ======================================
// Get Certificate Analytics
// ======================================
const getCertificateAnalytics = async () => {
  const totalCertificates = await Enrollment.countDocuments({
    certificateIssued: true,
  });

  const eligibleStudents = await Enrollment.countDocuments({
    status: "completed",
  });

  return {
    totalCertificates,
    eligibleStudents,
    certificateRate:
      eligibleStudents === 0
        ? 0
        : Number(((totalCertificates / eligibleStudents) * 100).toFixed(2)),
  };
};

// ======================================
// Get Enrollment Status Analytics
// ======================================
const getEnrollmentStatusAnalytics = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: "$status",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        total: 1,
      },
    },
  ]);
};

// ======================================
// Get Student Progress Analytics
// ======================================
const getStudentProgressAnalytics = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: null,
        averageProgress: {
          $avg: "$progress",
        },
        highestProgress: {
          $max: "$progress",
        },
        lowestProgress: {
          $min: "$progress",
        },
      },
    },
  ]);
};

// ======================================
// Get Completion Trend
// ======================================
const getCompletionTrend = async () => {
  return Enrollment.aggregate([
    {
      $match: {
        status: "completed",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$completedAt",
          },
          month: {
            $month: "$completedAt",
          },
        },
        completed: {
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
// Get Average Course Completion Time
// ======================================
const getAverageCompletionTime = async () => {
  const completed = await Enrollment.find({
    status: "completed",
    completedAt: {
      $ne: null,
    },
  });

  if (completed.length === 0) {
    return {
      averageDays: 0,
    };
  }

  const totalDays = completed.reduce((sum, enrollment) => {
    const days =
      (new Date(enrollment.completedAt) - new Date(enrollment.enrolledAt)) /
      (1000 * 60 * 60 * 24);

    return sum + days;
  }, 0);

  return {
    averageDays: Number((totalDays / completed.length).toFixed(2)),
  };
};

// ======================================
// Get Students Without Progress
// ======================================
const getStudentsWithoutProgress = async () => {
  return Enrollment.find({
    progress: 0,
    status: "active",
  })
    .populate("student", "firstName lastName email")
    .populate("course", "title")
    .sort({
      createdAt: -1,
    });
};

// ======================================
// Get Students Near Completion
// ======================================
const getStudentsNearCompletion = async () => {
  return Enrollment.find({
    progress: {
      $gte: 80,
      $lt: 100,
    },
    status: "active",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      progress: -1,
    });
};

// ======================================
// Get Enrollment Growth
// ======================================
const getEnrollmentGrowth = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        enrollments: {
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
// Get Payment Success Rate
// ======================================
const getPaymentSuccessRate = async () => {
  const totalPayments = await Payment.countDocuments();

  const successfulPayments = await Payment.countDocuments({
    status: "successful",
  });

  const failedPayments = await Payment.countDocuments({
    status: "failed",
  });

  const pendingPayments = await Payment.countDocuments({
    status: "pending",
  });

  return {
    totalPayments,
    successfulPayments,
    failedPayments,
    pendingPayments,
    successRate:
      totalPayments === 0
        ? 0
        : Number(((successfulPayments / totalPayments) * 100).toFixed(2)),
  };
};

// ======================================
// Get Gateway Performance
// ======================================
const getGatewayPerformance = async () => {
  return Payment.aggregate([
    {
      $group: {
        _id: "$gateway",
        totalTransactions: {
          $sum: 1,
        },
        successfulTransactions: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "successful"],
              },
              1,
              0,
            ],
          },
        },
        totalRevenue: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "successful"],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        gateway: "$_id",
        totalTransactions: 1,
        successfulTransactions: 1,
        totalRevenue: 1,
        successRate: {
          $multiply: [
            {
              $divide: ["$successfulTransactions", "$totalTransactions"],
            },
            100,
          ],
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
  ]);
};

// ======================================
// Get Largest Payments
// ======================================
const getLargestPayments = async () => {
  return Payment.find({
    status: "successful",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      amount: -1,
    })
    .limit(10);
};

// ======================================
// Get Failed Payments
// ======================================
const getFailedPayments = async () => {
  return Payment.find({
    status: "failed",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      createdAt: -1,
    })
    .limit(20);
};

// ======================================
// Get Pending Payments
// ======================================
const getPendingPaymentsAnalytics = async () => {
  return Payment.find({
    status: "pending",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      createdAt: -1,
    });
};

// ======================================
// Get Average Payment Value
// ======================================
const getAveragePaymentValue = async () => {
  const result = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        averagePayment: {
          $avg: "$amount",
        },
        highestPayment: {
          $max: "$amount",
        },
        lowestPayment: {
          $min: "$amount",
        },
      },
    },
  ]);

  return (
    result[0] || {
      averagePayment: 0,
      highestPayment: 0,
      lowestPayment: 0,
    }
  );
};

// ======================================
// Get Tutor Revenue Analytics
// ======================================
const getTutorRevenueAnalytics = async () => {
  return Course.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "published",
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tutor",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        revenue: {
          $multiply: [
            "$pricing.amount",
            {
              $size: "$enrollments",
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$tutorId",
        firstName: {
          $first: "$firstName",
        },
        lastName: {
          $first: "$lastName",
        },
        totalRevenue: {
          $sum: "$revenue",
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Performance Analytics
// ======================================
const getTutorPerformanceAnalytics = async () => {
  return Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tutor",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $group: {
        _id: "$tutor._id",
        firstName: {
          $first: "$tutor.firstName",
        },
        lastName: {
          $first: "$tutor.lastName",
        },
        totalCourses: {
          $sum: 1,
        },
        totalStudents: {
          $sum: {
            $size: "$enrollments",
          },
        },
      },
    },
    {
      $sort: {
        totalStudents: -1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Earnings Trend
// ======================================
const getTutorEarningsTrend = async () => {
  return Wallet.aggregate([
    {
      $match: {
        ownerType: "tutor",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$updatedAt",
          },
          month: {
            $month: "$updatedAt",
          },
        },
        totalEarned: {
          $sum: "$totalEarned",
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
// Get Highest Rated Tutors
// ======================================
const getHighestRatedTutors = async () => {
  return Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tutor",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $group: {
        _id: "$tutor._id",
        firstName: {
          $first: "$tutor.firstName",
        },
        lastName: {
          $first: "$tutor.lastName",
        },
        averageRating: {
          $avg: "$ratings.average",
        },
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
  ]);
};

// ======================================
// Get Tutor Course Count
// ======================================
const getTutorCourseCount = async () => {
  return Course.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$tutor",
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $sort: {
        totalCourses: -1,
      },
    },
  ]);
};

// ======================================
// Get Average Tutor Revenue
// ======================================
const getAverageTutorRevenue = async () => {
  const tutorRevenue = await getTutorRevenueAnalytics();

  if (tutorRevenue.length === 0) {
    return {
      averageRevenue: 0,
    };
  }

  const total = tutorRevenue.reduce(
    (sum, tutor) => sum + tutor.totalRevenue,
    0,
  );

  return {
    averageRevenue: Number((total / tutorRevenue.length).toFixed(2)),
  };
};

// ======================================
// Get Tutor With Most Students
// ======================================
const getTutorWithMostStudents = async () => {
  const tutors = await getTutorPerformanceAnalytics();

  return tutors.length > 0 ? tutors[0] : null;
};

// ======================================
// Get Inactive Tutors
// ======================================
const getInactiveTutors = async () => {
  return User.aggregate([
    {
      $match: {
        roles: "tutor",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "tutor",
        as: "courses",
      },
    },
    {
      $match: {
        courses: {
          $size: 0,
        },
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    },
  ]);
};

// ======================================
// Get Student Spending Analytics
// ======================================
const getStudentSpendingAnalytics = async () => {
  return Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: "$student",
        totalSpent: {
          $sum: "$amount",
        },
        totalPayments: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        email: "$student.email",
        totalSpent: 1,
        totalPayments: 1,
      },
    },
    {
      $sort: {
        totalSpent: -1,
      },
    },
  ]);
};

// ======================================
// Get Top Paying Students
// ======================================
const getTopPayingStudents = async () => {
  return Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: "$student",
        totalSpent: {
          $sum: "$amount",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        totalSpent: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        totalSpent: 1,
      },
    },
  ]);
};

// ======================================
// Get Student Enrollment Analytics
// ======================================
const getStudentEnrollmentAnalytics = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: "$student",
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        totalCourses: -1,
      },
    },
  ]);
};

// ======================================
// Get Student Completion Analytics
// ======================================
const getStudentCompletionAnalytics = async () => {
  return Enrollment.aggregate([
    {
      $match: {
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$student",
        completedCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        completedCourses: -1,
      },
    },
  ]);
};

// ======================================
// Get Student Certificate Analytics
// ======================================
const getStudentCertificateAnalytics = async () => {
  return Enrollment.aggregate([
    {
      $match: {
        certificateIssued: true,
      },
    },
    {
      $group: {
        _id: "$student",
        certificates: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        certificates: -1,
      },
    },
  ]);
};

// ======================================
// Get Student Progress Leaderboard
// ======================================
const getStudentProgressLeaderboard = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: "$student",
        averageProgress: {
          $avg: "$progress",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $sort: {
        averageProgress: -1,
      },
    },
  ]);
};

// ======================================
// Get Student Activity Analytics
// ======================================
const getStudentActivityAnalytics = async () => {
  return Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$updatedAt",
          },
          month: {
            $month: "$updatedAt",
          },
        },
        activeStudents: {
          $addToSet: "$student",
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalActiveStudents: {
          $size: "$activeStudents",
        },
      },
    },
    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
  ]);
};

// ======================================
// Get Students With No Payment
// ======================================
const getStudentsWithNoPayment = async () => {
  return User.aggregate([
    {
      $match: {
        roles: "student",
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "student",
        as: "payments",
      },
    },
    {
      $match: {
        payments: {
          $size: 0,
        },
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        createdAt: 1,
      },
    },
  ]);
};

// ======================================
// Get Richest Tutors
// ======================================
const getRichestTutors = async () => {
  return Wallet.aggregate([
    {
      $match: {
        ownerType: "tutor",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        availableBalance: 1,
        totalEarned: 1,
      },
    },
    {
      $sort: {
        availableBalance: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
};

// ======================================
// Get Course Price Analytics
// ======================================
const getCoursePriceAnalytics = async () => {
  const result = await Course.aggregate([
    {
      $match: {
        "pricing.isFree": false,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        averagePrice: {
          $avg: "$pricing.amount",
        },
        highestPrice: {
          $max: "$pricing.amount",
        },
        lowestPrice: {
          $min: "$pricing.amount",
        },
      },
    },
  ]);

  return (
    result[0] || {
      averagePrice: 0,
      highestPrice: 0,
      lowestPrice: 0,
    }
  );
};

// ======================================
// Get Featured Course Analytics
// ======================================
const getFeaturedCourseAnalytics = async () => {
  const featuredCourses = await Course.countDocuments({
    isFeatured: true,
    isDeleted: false,
  });

  const nonFeaturedCourses = await Course.countDocuments({
    isFeatured: false,
    isDeleted: false,
  });

  return {
    featuredCourses,
    nonFeaturedCourses,
  };
};

// ======================================
// Get Course Creation Trend
// ======================================
const getCourseCreationTrend = async () => {
  return Course.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        courses: {
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
// Get Courses Without Students
// ======================================
const getCoursesWithoutStudents = async () => {
  return Course.aggregate([
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "students",
      },
    },
    {
      $match: {
        students: {
          $size: 0,
        },
      },
    },
    {
      $project: {
        title: 1,
        slug: 1,
        createdAt: 1,
      },
    },
  ]);
};

// ======================================
// Get Highest Rated Courses
// ======================================
const getHighestRatedCourses = async () => {
  return Course.find({
    isDeleted: false,
    status: "published",
  })
    .sort({
      "ratings.average": -1,
    })
    .limit(10)
    .select("title slug ratings pricing tutor");
};

// ======================================
// Get Lowest Rated Courses
// ======================================
const getLowestRatedCourses = async () => {
  return Course.find({
    isDeleted: false,
    status: "published",
  })
    .sort({
      "ratings.average": 1,
    })
    .limit(10)
    .select("title slug ratings pricing tutor");
};

// ======================================
// Get Average Course Rating
// ======================================
const getAverageCourseRating = async () => {
  const result = await Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$ratings.average",
        },
        totalReviews: {
          $sum: "$ratings.totalReviews",
        },
      },
    },
  ]);

  return (
    result[0] || {
      averageRating: 0,
      totalReviews: 0,
    }
  );
};

// ======================================
// Get Pending Revenue
// ======================================
const getPendingRevenue = async () => {
  const pending = await Payment.aggregate([
    {
      $match: {
        status: "pending",
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return pending.length > 0 ? pending[0].total : 0;
};

// ======================================
// Get Revenue By Currency
// ======================================
const getRevenueByCurrency = async () => {
  return await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: "$currency",
        revenue: {
          $sum: "$amount",
        },
        payments: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        currency: "$_id",
        revenue: 1,
        payments: 1,
      },
    },
  ]);
};

// ======================================
// Get Revenue Split
// ======================================
const getRevenueSplit = async () => {
  const successfulRevenue = await Payment.aggregate([
    {
      $match: {
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

  const totalRevenue =
    successfulRevenue.length > 0 ? successfulRevenue[0].revenue : 0;

  const tutorRevenue = totalRevenue * 0.6;
  const platformRevenue = totalRevenue * 0.4;

  return {
    totalRevenue,
    tutorRevenue,
    platformRevenue,
  };
};

// ======================================
// Get Monthly Payment Count
// ======================================
const getMonthlyPaymentCount = async () => {
  return await Payment.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
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
// Monthly Enrollment Growth
// ======================================

const getMonthlyEnrollmentGrowth = async () => {
  const enrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        enrollments: {
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

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return enrollments.map((item) => ({
    year: item._id.year,
    month: months[item._id.month],
    enrollments: item.enrollments,
  }));
};

// ======================================
// Tutor Earnings Analytics
// ======================================

const getTutorEarningsAnalytics = async () => {
  const tutors = await Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "tutor",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        revenue: {
          $multiply: [
            "$pricing.amount",
            {
              $size: "$enrollments",
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$tutorId",
        firstName: {
          $first: "$firstName",
        },
        lastName: {
          $first: "$lastName",
        },
        revenue: {
          $sum: "$revenue",
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);

  return tutors;
};

// ======================================
// Student Enrollment Leaderboard
// ======================================

const getTopStudents = async () => {
  const students = await Enrollment.aggregate([
    {
      $group: {
        _id: "$student",
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $project: {
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        totalCourses: 1,
      },
    },
    {
      $sort: {
        totalCourses: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  return students;
};

// ======================================
// Most Completed Courses
// ======================================

const getMostCompletedCourses = async () => {
  const completed = await Enrollment.aggregate([
    {
      $match: {
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$course",
        completedStudents: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $project: {
        title: "$course.title",
        completedStudents: 1,
      },
    },
    {
      $sort: {
        completedStudents: -1,
      },
    },
  ]);

  return completed;
};

// ======================================
// Revenue Per Course
// ======================================

const getRevenuePerCourse = async () => {
  const revenue = await Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "course",
        as: "enrollments",
      },
    },
    {
      $project: {
        title: 1,
        revenue: {
          $multiply: [
            "$pricing.amount",
            {
              $size: "$enrollments",
            },
          ],
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);

  return revenue;
};

// ======================================
// Platform Conversion Funnel
// ======================================

const getConversionFunnel = async () => {
  const users = await User.countDocuments();

  const enrollments = await Enrollment.countDocuments();

  const payments = await Payment.countDocuments({
    status: "successful",
  });

  return {
    registeredUsers: users,
    enrolledStudents: enrollments,
    payingStudents: payments,
  };
};

// ======================================
// Course Rating Analytics
// ======================================

const getCourseRatingAnalytics = async () => {
  const ratings = await Course.find({
    isDeleted: false,
  }).select("title ratings");

  return ratings.map((course) => ({
    courseId: course._id,
    title: course.title,
    averageRating: course.ratings?.average || 0,
    totalRatings: course.ratings?.count || 0,
  }));
};

// ======================================
// Total Platform Revenue Breakdown
// ======================================

const getPlatformRevenueBreakdown = async () => {
  const totalRevenue = await Payment.aggregate([
    {
      $match: {
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

  const tutorWallet = await Wallet.aggregate([
    {
      $match: {
        ownerType: "tutor",
      },
    },
    {
      $group: {
        _id: null,
        paidToTutors: {
          $sum: "$totalEarned",
        },
      },
    },
  ]);

  const revenue = totalRevenue[0]?.revenue || 0;
  const tutorRevenue = tutorWallet[0]?.paidToTutors || 0;

  return {
    totalRevenue: revenue,
    tutorRevenue,
    companyRevenue: revenue - tutorRevenue,
  };
};

// ======================================
// Daily Revenue Analytics
// ======================================

const getDailyRevenueAnalytics = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
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
        "_id.day": 1,
      },
    },
  ]);

  return revenue.map((item) => ({
    date: `${item._id.year}-${item._id.month}-${item._id.day}`,
    revenue: item.revenue,
    payments: item.payments,
  }));
};

// ======================================
// Daily Enrollment Analytics
// ======================================

const getDailyEnrollmentAnalytics = async () => {
  const enrollments = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        enrollments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);

  return enrollments.map((item) => ({
    date: `${item._id.year}-${item._id.month}-${item._id.day}`,
    enrollments: item.enrollments,
  }));
};

// ======================================
// Daily User Registrations
// ======================================

const getDailyUserRegistrations = async () => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        users: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);

  return users.map((item) => ({
    date: `${item._id.year}-${item._id.month}-${item._id.day}`,
    users: item.users,
  }));
};

// ======================================
// Students Without Enrollments
// ======================================

const getStudentsWithoutCourses = async () => {
  const students = await User.find({
    roles: "student",
    isDeleted: false,
  });

  const result = [];

  for (const student of students) {
    const count = await Enrollment.countDocuments({
      student: student._id,
    });

    if (count === 0) {
      result.push(student);
    }
  }

  return result;
};

// ======================================
// Pending Payment Analytics
// ======================================

const getPendingPaymentAnalytics = async () => {
  const payments = await Payment.find({
    status: "pending",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({
      createdAt: -1,
    });

  return payments;
};

// ======================================
// Wallet Summary Analytics
// ======================================

const getWalletSummaryAnalytics = async () => {
  const wallets = await Wallet.aggregate([
    {
      $group: {
        _id: "$ownerType",
        totalBalance: {
          $sum: "$availableBalance",
        },
        totalEarned: {
          $sum: "$totalEarned",
        },
        totalWithdrawn: {
          $sum: "$totalWithdrawn",
        },
        wallets: {
          $sum: 1,
        },
      },
    },
  ]);

  return wallets;
};

// ======================================
// Notification Analytics
// ======================================

const getNotificationAnalytics = async () => {
  const notifications = await Notification.aggregate([
    {
      $group: {
        _id: "$type",
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);

  return notifications;
};

// ======================================
// Active Tutors Analytics
// ======================================

const getActiveTutorsAnalytics = async () => {
  const tutors = await Course.aggregate([
    {
      $match: {
        status: "published",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$tutor",
        totalCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tutor",
      },
    },
    {
      $unwind: "$tutor",
    },
    {
      $project: {
        tutorId: "$tutor._id",
        firstName: "$tutor.firstName",
        lastName: "$tutor.lastName",
        email: "$tutor.email",
        totalCourses: 1,
      },
    },
    {
      $sort: {
        totalCourses: -1,
      },
    },
  ]);

  return tutors;
};

// ======================================
// Active Students Analytics
// ======================================

const getActiveStudentsAnalytics = async () => {
  const students = await Enrollment.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $group: {
        _id: "$student",
        activeCourses: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $project: {
        studentId: "$student._id",
        firstName: "$student.firstName",
        lastName: "$student.lastName",
        email: "$student.email",
        activeCourses: 1,
      },
    },
    {
      $sort: {
        activeCourses: -1,
      },
    },
  ]);

  return students;
};

// ======================================
// Free vs Paid Courses
// ======================================

const getFreeVsPaidCoursesAnalytics = async () => {
  const analytics = await Course.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$pricing.isFree",
        totalCourses: {
          $sum: 1,
        },
      },
    },
  ]);

  return analytics.map((item) => ({
    type: item._id ? "Free" : "Paid",
    totalCourses: item.totalCourses,
  }));
};

// ======================================
// Average Student Progress
// ======================================

const getAverageStudentProgress = async () => {
  const result = await Enrollment.aggregate([
    {
      $group: {
        _id: null,
        averageProgress: {
          $avg: "$progress",
        },
      },
    },
  ]);

  return {
    averageProgress: Number((result[0]?.averageProgress || 0).toFixed(2)),
  };
};

// ======================================
// Overall Platform KPI
// ======================================

const getPlatformKPIs = async () => {
  const users = await User.countDocuments();

  const courses = await Course.countDocuments({
    isDeleted: false,
  });

  const enrollments = await Enrollment.countDocuments();

  const revenue = await Payment.aggregate([
    {
      $match: {
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

  return {
    totalUsers: users,
    totalCourses: courses,
    totalEnrollments: enrollments,
    totalRevenue: revenue[0]?.revenue || 0,
  };
};

// ======================================
// Get Admin Dashboard Analytics
// =====================================

const getDashboardAnalytics = async () => {
  // ======================================
  // Users
  // ======================================
  const totalUsers = await User.countDocuments();

  const totalStudents = await User.countDocuments({
    roles: "student",
  });

  const totalTutors = await User.countDocuments({
    roles: "tutor",
  });

  const totalAdmins = await User.countDocuments({
    roles: "admin",
  });

  const totalStaff = await User.countDocuments({
    roles: "staff",
  });

  const totalClients = await User.countDocuments({
    roles: "client",
  });

  const totalTalents = await User.countDocuments({
    roles: "talent",
  });

  const totalInterns = await User.countDocuments({
    roles: "intern",
  });

  // ======================================
  // Courses
  // ======================================
  const totalCourses = await Course.countDocuments({
    isDeleted: false,
  });

  const publishedCourses = await Course.countDocuments({
    status: "published",
    isDeleted: false,
  });

  const draftCourses = await Course.countDocuments({
    status: "draft",
    isDeleted: false,
  });

  const featuredCourses = await Course.countDocuments({
    isFeatured: true,
    isDeleted: false,
  });

  // ======================================
  // Enrollments
  // ======================================
  const totalEnrollments = await Enrollment.countDocuments();

  const activeEnrollments = await Enrollment.countDocuments({
    status: "active",
  });

  const completedEnrollments = await Enrollment.countDocuments({
    status: "completed",
  });

  // ======================================
  // Payments
  // ======================================
  const totalPayments = await Payment.countDocuments();

  const successfulPayments = await Payment.countDocuments({
    status: "successful",
  });

  const pendingPayments = await Payment.countDocuments({
    status: "pending",
  });

  // ======================================
  // Revenue
  // ======================================
  const revenueResult = await Payment.aggregate([
    {
      $match: {
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const totalRevenue =
    revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  // ======================================
  // Wallets
  // ======================================
  const companyWallet = await Wallet.findOne({
    ownerType: "company",
  });

  const tutorWallets = await Wallet.aggregate([
    {
      $match: {
        ownerType: "tutor",
      },
    },
    {
      $group: {
        _id: null,
        totalTutorBalance: {
          $sum: "$availableBalance",
        },
        totalTutorEarned: {
          $sum: "$totalEarned",
        },
        totalTutorWithdrawn: {
          $sum: "$totalWithdrawn",
        },
      },
    },
  ]);

  // ======================================
  // Withdrawals
  // ======================================
  const pendingWithdrawals = await Withdrawal.countDocuments({
    status: "pending",
  });

  const approvedWithdrawals = await Withdrawal.countDocuments({
    status: "approved",
  });

  const paidWithdrawals = await Withdrawal.countDocuments({
    status: "paid",
  });

  // ======================================
  // Recent Users
  // ======================================
  const recentUsers = await User.find()
    .select("firstName lastName email roles createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  // ======================================
  // Recent Payments
  // ======================================
  const recentPayments = await Payment.find({
    status: "successful",
  })
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  // ======================================
  // Recent Enrollments
  // ======================================
  const recentEnrollments = await Enrollment.find()
    .populate("student", "firstName lastName")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  const [
    monthlyRevenue,
    monthlyUserGrowth,
    topSellingCourses,
    overview,
    activityFeed,
    topTutors,
    coursePerformance,
    gatewayRevenue,
    revenueTrend,
    completionAnalytics,
    notifications,
    systemHealth,
    enrollmentChart,
    revenueChart,
    userGrowthChart,
    coursePerformanceChart,
  ] = await Promise.all([
    getMonthlyRevenue(),
    getMonthlyUserGrowth(),
    getTopSellingCourses(),
    getOverviewStats(),
    getActivityFeed(),
    getTopTutors(),
    getCoursePerformance(),
    getRevenueByGateway(),
    getRevenueTrend(),
    getCourseCompletionAnalytics(),
    getNotifications(),
    getSystemHealth(),
    getEnrollmentChart(),
    getRevenueChart(),
    getUserGrowthChart(),
    getCoursePerformanceChart(),
  ]);

  console.log("Top Tutors:", topTutors);

  return {
    success: true,
    message: "Dashboard analytics retrieved successfully.",

    data: {
      overview,

      users: {
        totalUsers,
        totalStudents,
        totalTutors,
        totalAdmins,
        totalStaff,
        totalClients,
        totalTalents,
        totalInterns,
        monthlyUserGrowth,
        topTutors,
      },

      courses: {
        totalCourses,
        publishedCourses,
        draftCourses,
        featuredCourses,
        topSellingCourses,
        coursePerformance,
      },

      enrollments: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
      },

      completion: completionAnalytics,

      payments: {
        totalPayments,
        successfulPayments,
        pendingPayments,
      },

      revenue: {
        totalRevenue,
        monthlyRevenue,
        gatewayRevenue,
        revenueTrend,
      },

      wallets: {
        companyBalance: companyWallet?.availableBalance || 0,

        totalTutorBalance: tutorWallets[0]?.totalTutorBalance || 0,

        totalTutorEarned: tutorWallets[0]?.totalTutorEarned || 0,

        totalTutorWithdrawn: tutorWallets[0]?.totalTutorWithdrawn || 0,
      },

      withdrawals: {
        pendingWithdrawals,
        approvedWithdrawals,
        paidWithdrawals,
      },

      charts: {
        enrollmentChart,
        revenueChart,
        userGrowthChart,
        coursePerformanceChart,
      },

      recentUsers,
      recentPayments,
      recentEnrollments,

      activityFeed,
      notifications,
      systemHealth,
    },
  };
};

module.exports = {
  getDashboardAnalytics,
  getStudentDashboardAnalytics,
};
