const {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentByCourse,
  updateAssessment,
  publishAssessment,
  deleteAssessment,
} = require("../services/assessmentService");

// ======================================
// Create Assessment
// @route POST /api/assessments
// @access Tutor/Admin
// ======================================
const createNewAssessment = async (req, res) => {
  try {
    const result = await createAssessment(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Assessment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Assessments
// @route GET /api/assessments
// @access Public
// ======================================
const getAssessments = async (req, res) => {
  try {
    const result = await getAllAssessments();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Assessments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Assessment By ID
// @route GET /api/assessments/:id
// @access Authenticated
// ======================================
const getAssessment = async (req, res) => {
  try {
    const result = await getAssessmentById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Assessment Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Assessment By Course
// @route GET /api/assessments/course/:courseId
// @access Authenticated
// ======================================
const getCourseAssessment = async (req, res) => {
  try {
    const result = await getAssessmentByCourse(req.params.courseId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Course Assessment Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Assessment
// @route PUT /api/assessments/:id
// @access Tutor/Admin
// ======================================
const updateExistingAssessment = async (req, res) => {
  try {
    const result = await updateAssessment(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Assessment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Publish Assessment
// @route PATCH /api/assessments/:id/publish
// @access Tutor/Admin
// ======================================
const publishAssessmentNow = async (req, res) => {
  try {
    const result = await publishAssessment(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Publish Assessment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Assessment
// @route DELETE /api/assessments/:id
// @access Tutor/Admin
// ======================================
const removeAssessment = async (req, res) => {
  try {
    const result = await deleteAssessment(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Assessment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewAssessment,
  getAssessments,
  getAssessment,
  getCourseAssessment,
  updateExistingAssessment,
  publishAssessmentNow,
  removeAssessment,
};
