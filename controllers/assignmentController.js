const {
  createAssignment,
  getAssignmentById,
  getCourseAssignments,
  getAssignmentsByLesson,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment,
} = require("../services/assignmentService");

// ======================================
// Create Assignment
// POST /api/assignments
// Tutor/Admin
// ======================================

const createNewAssignment = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await createAssignment(
        req.body,
        req.user._id,
      );

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Get Assignment By ID
// GET /api/assignments/:id
// Authenticated
// ======================================

const getAssignment = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await getAssignmentById(
        req.params.id,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Get Course Assignments
// GET /api/assignments/course/:courseId
// Authenticated
// ======================================

const getAssignmentsByCourse = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await getCourseAssignments(
        req.params.courseId,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Get Lesson Assignments
// GET /api/assignments/lesson/:lessonId
// Authenticated
// ======================================

const getLessonAssignments = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await getAssignmentsByLesson(
        req.params.lessonId,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Update Assignment
// PUT /api/assignments/:id
// Tutor/Admin
// ======================================

const updateAssignmentDetails = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await updateAssignment(
        req.params.id,
        req.body,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Delete Assignment
// DELETE /api/assignments/:id
// Tutor/Admin
// ======================================

const removeAssignment = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await deleteAssignment(
        req.params.id,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Publish Assignment
// PATCH /api/assignments/:id/publish
// Tutor/Admin
// ======================================

const publishAssignmentNow = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await publishAssignment(
        req.params.id,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ======================================
// Close Assignment
// PATCH /api/assignments/:id/close
// Tutor/Admin
// ======================================

const closeAssignmentNow = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await closeAssignment(
        req.params.id,
        req.user,
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNewAssignment,
  getAssignment,
  getAssignmentsByCourse,
  getLessonAssignments,
  updateAssignmentDetails,
  removeAssignment,
  publishAssignmentNow,
  closeAssignmentNow,
};