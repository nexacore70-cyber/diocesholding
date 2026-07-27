const {
  getStudentDashboard,
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
} = require("../services/studentDashboardService");

// ======================================
// Complete Dashboard
// ======================================
const getDashboard = async (req, res) => {
  try {
    const dashboard = await getStudentDashboard(req.user.id);

    return res.status(200).json(dashboard);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student dashboard.",
      error: error.message,
    });
  }
};

// ======================================
// Overview
// ======================================
const getOverview = async (req, res) => {
  try {
    const overview = await getStudentOverview(req.user.id);

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// My Courses
// ======================================
const getCourses = async (req, res) => {
  try {
    const courses = await getMyCourses(req.user.id);

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Continue Learning
// ======================================
const getContinue = async (req, res) => {
  try {
    const lessons = await getContinueLearning(req.user.id);

    return res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Recent Lessons
// ======================================
const getRecent = async (req, res) => {
  try {
    const lessons = await getRecentLessons(req.user.id);

    return res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Upcoming Assignments
// ======================================
const getAssignments = async (req, res) => {
  try {
    const assignments = await getUpcomingAssignments(req.user.id);

    return res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Quiz History
// ======================================
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await getQuizHistory(req.user.id);

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Certificates
// ======================================
const getCertificates = async (req, res) => {
  try {
    const certificates = await getStudentCertificates(req.user.id);

    return res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Wishlist
// ======================================
const getWishlist = async (req, res) => {
  try {
    const wishlist = await getStudentWishlist(req.user.id);

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Payments
// ======================================
const getPayments = async (req, res) => {
  try {
    const payments = await getRecentPayments(req.user.id);

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Notifications
// ======================================
const getNotifications = async (req, res) => {
  try {
    const notifications = await getStudentNotifications(req.user.id);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Learning Progress
// ======================================
const getProgress = async (req, res) => {
  try {
    const progress = await getLearningProgress(req.user.id);

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getOverview,
  getCourses,
  getContinue,
  getRecent,
  getAssignments,
  getQuizzes,
  getCertificates,
  getWishlist,
  getPayments,
  getNotifications,
  getProgress,
};