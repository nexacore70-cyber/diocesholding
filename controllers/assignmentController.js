const {
  createAssignment,
  getAssignmentById,
  getCourseAssignments,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
} = require("../services/assignmentService");

// =========================
// Create Assignment
// =========================
// @route POST /api/assignments
// @access Tutor/Admin
const createNewAssignment = async (req, res) => {
  try {
    const result = await createAssignment(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Assignment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Assignment By ID
// =========================
// @route GET /api/assignments/:id
// @access Authenticated
const getAssignment = async (req, res) => {
  try {
    const result = await getAssignmentById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Assignment Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Course Assignments
// =========================
// @route GET /api/assignments/course/:courseId
// @access Authenticated
const getAssignmentsByCourse = async (req, res) => {
  try {
    const result = await getCourseAssignments(req.params.courseId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Course Assignments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Assignment
// =========================
// @route PUT /api/assignments/:id
// @access Tutor/Admin
const updateAssignmentDetails = async (req, res) => {
  try {
    const result = await updateAssignment(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Assignment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Assignment
// =========================
// @route DELETE /api/assignments/:id
// @access Tutor/Admin
const removeAssignment = async (req, res) => {
  try {
    const result = await deleteAssignment(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Assignment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Publish Assignment
// =========================
// @route PATCH /api/assignments/:id/publish
// @access Tutor/Admin
const publishAssignmentNow = async (req, res) => {
  try {
    const result = await publishAssignment(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Publish Assignment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewAssignment,
  getAssignment,
  getAssignmentsByCourse,
  updateAssignmentDetails,
  removeAssignment,
  publishAssignmentNow,
};
