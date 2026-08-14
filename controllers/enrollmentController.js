const mongoose = require("mongoose");

const {
  createEnrollment,
  getAllEnrollments,
  getTutorEnrollments,
  getMyEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require("../services/enrollmentService");

// ======================================
// Helpers
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);

  if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message:
        Object.values(error.errors)[0]?.message || "Invalid enrollment data.",
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid enrollment data.",
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================
// Create Enrollment
// ======================================
// POST /api/enrollments
// ======================================

const createNewEnrollment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { course } = req.body;

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course is required.",
      });
    }

    if (!isValidObjectId(course)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course identifier.",
      });
    }

    // ======================================
    // NEVER accept student from req.body
    // ======================================

    const result = await createEnrollment({
      student: req.user._id,
      course,
    });

    return res.status(201).json(result);
  } catch (error) {
    return handleControllerError(res, error, "Unable to create enrollment.");
  }
};

// ======================================
// Get My Enrollments
// ======================================
// GET /api/enrollments/me
// ======================================

const getMyEnrollmentsController = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await getMyEnrollments(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch your enrollments.",
    );
  }
};

// ======================================
// Get All Enrollments
// ======================================
// GET /api/enrollments
// ======================================

const getEnrollments = async (req, res) => {
  try {
    const result = await getAllEnrollments();

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch enrollments.");
  }
};

// ======================================
// Get Tutor Enrollments
// ======================================
// GET /api/enrollments/tutor
// ======================================

const getTutorEnrollmentList = async (req, res) => {
  try {
    const result = await getTutorEnrollments(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch tutor enrollments.",
    );
  }
};

// ======================================
// Get Single Enrollment
// ======================================
// GET /api/enrollments/:id
// ======================================

const getEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment identifier.",
      });
    }

    const result = await getEnrollmentById(id);

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch enrollment.");
  }
};

// ======================================
// Update Enrollment
// ======================================
// PUT /api/enrollments/:id
// ======================================

const updateExistingEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment identifier.",
      });
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment data.",
      });
    }

    const allowedFields = [
      "status",
      "progress",
      "completedAt",
      "certificateIssued",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid enrollment fields were provided.",
      });
    }

    const result = await updateEnrollment(id, updateData, req.user);

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error, "Unable to update enrollment.");
  }
};

// ======================================
// Delete Enrollment
// ======================================
// DELETE /api/enrollments/:id
// ======================================

const deleteExistingEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment identifier.",
      });
    }

    const result = await deleteEnrollment(id, req.user);

    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error, "Unable to delete enrollment.");
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  createNewEnrollment,
  getMyEnrollmentsController,
  getEnrollments,
  getTutorEnrollmentList,
  getEnrollment,
  updateExistingEnrollment,
  deleteExistingEnrollment,
};
