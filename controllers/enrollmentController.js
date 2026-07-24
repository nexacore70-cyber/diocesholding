const {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require("../services/enrollmentService");

// @desc Create Enrollment
// @route POST /api/enrollments
// @access Student/Admin
const createNewEnrollment = async (req, res) => {
  try {
    const enrollmentData = {
      ...req.body,
      student: req.user._id,
    };

    const result = await createEnrollment(enrollmentData);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get All Enrollments
// @route GET /api/enrollments
// @access Admin
const getEnrollments = async (req, res) => {
  try {
    const result = await getAllEnrollments();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Enrollments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get Single Enrollment
// @route GET /api/enrollments/:id
// @access Admin
const getEnrollment = async (req, res) => {
  try {
    const result = await getEnrollmentById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Enrollment Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update Enrollment
// @route PUT /api/enrollments/:id
// @access Admin
const updateExistingEnrollment = async (req, res) => {
  try {
    const result = await updateEnrollment(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete Enrollment
// @route DELETE /api/enrollments/:id
// @access Admin
const deleteExistingEnrollment = async (req, res) => {
  try {
    const result = await deleteEnrollment(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewEnrollment,
  getEnrollments,
  getEnrollment,
  updateExistingEnrollment,
  deleteExistingEnrollment,
};
