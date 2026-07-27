const {
  getTutorDashboard,
  getTutorOverview,
  getTutorCourses,
  getTutorStudents,
  getTutorRevenue,
  getTutorMonthlyRevenue,
  getTutorRecentEnrollments,
  getTutorRecentPayments,
  getTutorCoursePerformance,
  getTutorNotifications,
} = require("../services/tutorDashboardService");

// ======================================
// Get Complete Tutor Dashboard
// ======================================
const getDashboard = async (req, res) => {
  try {
    const dashboard = await getTutorDashboard(req.user.id);

    return res.status(200).json(dashboard);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tutor dashboard.",
      error: error.message,
    });
  }
};

// ======================================
// Get Tutor Overview
// ======================================
const getOverview = async (req, res) => {
  try {
    const overview = await getTutorOverview(req.user.id);

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
// Get Tutor Courses
// ======================================
const getCourses = async (req, res) => {
  try {
    const courses = await getTutorCourses(req.user.id);

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
// Get Tutor Students
// ======================================
const getStudents = async (req, res) => {
  try {
    const students = await getTutorStudents(req.user.id);

    return res.status(200).json({
      success: true,
      data: students,
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
// Get Tutor Revenue
// ======================================
const getRevenue = async (req, res) => {
  try {
    const revenue = await getTutorRevenue(req.user.id);

    return res.status(200).json({
      success: true,
      data: revenue,
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
// Get Monthly Revenue
// ======================================
const getMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await getTutorMonthlyRevenue(req.user.id);

    return res.status(200).json({
      success: true,
      data: revenue,
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
// Get Recent Enrollments
// ======================================
const getRecentEnrollments = async (req, res) => {
  try {
    const enrollments = await getTutorRecentEnrollments(req.user.id);

    return res.status(200).json({
      success: true,
      data: enrollments,
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
// Get Recent Payments
// ======================================
const getRecentPayments = async (req, res) => {
  try {
    const payments = await getTutorRecentPayments(req.user.id);

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
// Get Course Performance
// ======================================
const getCoursePerformance = async (req, res) => {
  try {
    const performance = await getTutorCoursePerformance(req.user.id);

    return res.status(200).json({
      success: true,
      data: performance,
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
// Get Tutor Notifications
// ======================================
const getNotifications = async (req, res) => {
  try {
    const notifications = await getTutorNotifications(req.user.id);

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

module.exports = {
  getDashboard,
  getOverview,
  getCourses,
  getStudents,
  getRevenue,
  getMonthlyRevenue,
  getRecentEnrollments,
  getRecentPayments,
  getCoursePerformance,
  getNotifications,
};