const {
  createCohort,
  getCohortById,
  getCohorts,
  updateCohort,
  updateCohortStatus,
  addStudentToCohort,
  removeStudentFromCohort,
  getCohortStudents,
  getMyCohorts,
  deleteCohort,
} = require("../services/cohortService");

// ======================================
// Create Cohort
// POST /api/cohorts
// ======================================

const createNewCohort = async (req, res) => {
  try {
    const result = await createCohort(
      req.body,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Cohort Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Cohorts
// GET /api/cohorts
// ======================================

const getAllCohorts = async (req, res) => {
  try {
    const result = await getCohorts({
      status: req.query.status,
      type: req.query.type,
      course: req.query.course,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Cohorts Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Cohort
// GET /api/cohorts/:id
// ======================================

const getSingleCohort = async (req, res) => {
  try {
    const result = await getCohortById(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Cohort Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Cohort
// PATCH /api/cohorts/:id
// ======================================

const updateCohortDetails = async (req, res) => {
  try {
    const result = await updateCohort(
      req.params.id,
      req.body,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Cohort Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Status
// PATCH /api/cohorts/:id/status
// ======================================

const changeCohortStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const result = await updateCohortStatus(
      req.params.id,
      status,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Update Cohort Status Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Add Student
// POST /api/cohorts/:id/students/:studentId
// ======================================

const assignStudentToCohort = async (
  req,
  res,
) => {
  try {
    const result = await addStudentToCohort(
      req.params.id,
      req.params.studentId,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Assign Student Cohort Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Remove Student
// DELETE /api/cohorts/:id/students/:studentId
// ======================================

const removeStudent = async (req, res) => {
  try {
    const result = await removeStudentFromCohort(
      req.params.id,
      req.params.studentId,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Remove Student Cohort Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Students
// GET /api/cohorts/:id/students
// ======================================

const getStudents = async (req, res) => {
  try {
    const result = await getCohortStudents(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Cohort Students Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// My Cohorts
// GET /api/cohorts/me
// ======================================

const getMyCohortsController = async (
  req,
  res,
) => {
  try {
    const result = await getMyCohorts(
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get My Cohorts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Cohort
// DELETE /api/cohorts/:id
// ======================================

const removeCohort = async (req, res) => {
  try {
    const result = await deleteCohort(
      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Cohort Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewCohort,
  getAllCohorts,
  getSingleCohort,
  updateCohortDetails,
  changeCohortStatus,
  assignStudentToCohort,
  removeStudent,
  getStudents,
  getMyCohortsController,
  removeCohort,
};