    const mongoose = require("mongoose");
    const User = require("../models/User");
    const Course = require("../models/Course");
    const Enrollment = require("../models/Enrollment");
    const Payment = require("../models/Payment");
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
      ? Number(
          (
            (totalCompleted / totalEnrollments) *
            100
          ).toFixed(2)
        )
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
    }
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
    revenueResult.length > 0
      ? revenueResult[0].totalRevenue
      : 0;

  const publishedCourses = await Course.countDocuments({
    status: "published",
    isDeleted: false,
  });

  const averageRevenuePerStudent =
    totalEnrollments > 0
      ? totalRevenue / totalEnrollments
      : 0;

  const averageRevenuePerCourse =
    publishedCourses > 0
      ? totalRevenue / publishedCourses
      : 0;

  const averageStudentsPerCourse =
    publishedCourses > 0
      ? totalEnrollments / publishedCourses
      : 0;

  const conversionRate =
    totalPayments > 0
      ? Number(
          (
            (successfulPayments / totalPayments) *
            100
          ).toFixed(2)
        )
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

  activities.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
            $multiply: [
              "$coursePrice",
              "$totalStudents",
            ],
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
                $eq: [
                  "$$enrollment.status",
                  "completed",
                ],
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
        : Number(
            (
              (course.completed /
                course.students) *
              100
            ).toFixed(2)
          ),
  }));
};

    // ======================================
// Get Revenue Trend
// ======================================
const getRevenueTrend = async () => {
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const previousMonth =
    currentMonth === 0 ? 11 : currentMonth - 1;

  const previousYear =
    currentMonth === 0
      ? currentYear - 1
      : currentYear;

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
        item._id.year === currentYear &&
        item._id.month === currentMonth + 1
    )?.revenue || 0;

  const previous =
    revenue.find(
      (item) =>
        item._id.year === previousYear &&
        item._id.month === previousMonth + 1
    )?.revenue || 0;

  let growth = 0;

  if (previous > 0) {
    growth = Number(
      (
        ((current - previous) / previous) *
        100
      ).toFixed(2)
    );
  }

  return {
    currentMonth: current,
    previousMonth: previous,
    growth,
    status:
      growth > 0
        ? "up"
        : growth < 0
        ? "down"
        : "stable",
  };
};

    // ======================================
// Dashboard Notifications
// ======================================

const getNotifications = async () => {
  const notifications = [];

  // Pending Withdrawals
  const pendingWithdrawals =
    await Withdrawal.countDocuments({
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
  const draftCourses =
    await Course.countDocuments({
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
  const pendingPayments =
    await Payment.countDocuments({
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

  const totalRevenue =
    revenue.length > 0
      ? revenue[0].totalRevenue
      : 0;

  if (totalRevenue >= 1000000) {
    notifications.push({
      type: "success",
      title: "Revenue Milestone",
      message:
        "Platform revenue has exceeded ₦1,000,000.",
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
    mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected";

  const totalPayments =
    await Payment.countDocuments();

  const successfulPayments =
    await Payment.countDocuments({
      status: "successful",
    });

  const paymentSuccessRate =
    totalPayments === 0
      ? 100
      : Number(
          (
            (successfulPayments / totalPayments) *
            100
          ).toFixed(2)
        );

  const totalWallets =
    await Wallet.countDocuments();

  const walletIntegrity =
    totalWallets > 0
      ? "healthy"
      : "warning";

  return {
    database,
    apiStatus: "online",
    paymentSuccessRate,
    walletIntegrity,
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

    const totalStudents =
    await User.countDocuments({
    roles: "student",
    });

    const totalTutors =
    await User.countDocuments({
    roles: "tutor",
    });

    const totalAdmins =
    await User.countDocuments({
    roles: "admin",
    });

    const totalStaff =
    await User.countDocuments({
    roles: "staff",
    });

    const totalClients =
    await User.countDocuments({
    roles: "client",
    });

    const totalTalents =
    await User.countDocuments({
    roles: "talent",
    });

    const totalInterns =
    await User.countDocuments({
    roles: "intern",
    });

    // ======================================
    // Courses
    // ======================================
    const totalCourses =
    await Course.countDocuments({
    isDeleted: false,
    });

    const publishedCourses =
    await Course.countDocuments({
    status: "published",
    isDeleted: false,
    });

    const draftCourses =
    await Course.countDocuments({
    status: "draft",
    isDeleted: false,
    });

    const featuredCourses =
    await Course.countDocuments({
    isFeatured: true,
    isDeleted: false,
    });

    // ======================================
    // Enrollments
    // ======================================
    const totalEnrollments =
    await Enrollment.countDocuments();

    const activeEnrollments =
    await Enrollment.countDocuments({
    status: "active",
    });

    const completedEnrollments =
    await Enrollment.countDocuments({
    status: "completed",
    });

    // ======================================
    // Payments
    // ======================================
    const totalPayments =
    await Payment.countDocuments();

    const successfulPayments =
    await Payment.countDocuments({
    status: "successful",
    });

    const pendingPayments =
    await Payment.countDocuments({
    status: "pending",
    });

    // ======================================
    // Revenue
    // ======================================
    const revenueResult =
    await Payment.aggregate([
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
    revenueResult.length > 0
    ? revenueResult[0].totalRevenue
    : 0;

    // ======================================
    // Wallets
    // ======================================
    const companyWallet =
    await Wallet.findOne({
    ownerType: "company",
    });

    const tutorWallets =
    await Wallet.aggregate([
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
    const pendingWithdrawals =
    await Withdrawal.countDocuments({
    status: "pending",
    });

    const approvedWithdrawals =
    await Withdrawal.countDocuments({
    status: "approved",
    });

    const paidWithdrawals =
    await Withdrawal.countDocuments({
    status: "paid",
    });

    // ======================================
    // Recent Users
    // ======================================
    const recentUsers = await User.find()
    .select(
    "firstName lastName email roles createdAt"
    )
    .sort({ createdAt: -1 })
    .limit(5);

    // ======================================
    // Recent Payments
    // ======================================
    const recentPayments =
    await Payment.find({
    status: "successful",
    })
    .populate(
    "student",
    "firstName lastName"
    )
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

    // ======================================
    // Recent Enrollments
    // ======================================
    const recentEnrollments =
    await Enrollment.find()
    .populate(
    "student",
    "firstName lastName"
    )
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(5);

    const monthlyRevenue =
    await getMonthlyRevenue();

    const monthlyUserGrowth =
    await getMonthlyUserGrowth();

    const topSellingCourses =
    await getTopSellingCourses();

    const overview = 
    await getOverviewStats();

    const activityFeed = 
    await getActivityFeed();

    const topTutors =
    await getTopTutors();

    const coursePerformance =
    await getCoursePerformance();

    const gatewayRevenue =
    await getRevenueByGateway();

    const revenueTrend =
    await getRevenueTrend();

    const completionAnalytics =
    await getCourseCompletionAnalytics();

    const notifications =
    await getNotifications();

    const systemHealth =
    await getSystemHealth();

    console.log("Top Tutors:", topTutors);

    return {
    success: true,
    message:
    "Dashboard analytics retrieved successfully.",

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
    companyBalance:
        companyWallet?.availableBalance || 0,

    totalTutorBalance:
        tutorWallets[0]
        ?.totalTutorBalance || 0,

    totalTutorEarned:
        tutorWallets[0]
        ?.totalTutorEarned || 0,

    totalTutorWithdrawn:
        tutorWallets[0]
        ?.totalTutorWithdrawn || 0,
    },

    withdrawals: {
    pendingWithdrawals,
    approvedWithdrawals,
    paidWithdrawals,
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
    };