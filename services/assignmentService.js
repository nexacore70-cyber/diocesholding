const Assignment = require("../models/Assignment");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Course = require("../models/Course");

// =========================
// Create Assignment
// =========================
const createAssignment = async (data, tutorId) => {
  const {
    lesson,
    title,
    description,
    instructions,
    maxScore,
    passingScore,
    dueDate,
    submissionType,
    allowedFileTypes,
    maxFileSize,
    allowResubmission,
    attachments,
  } = data;

  // Verify lesson exists
  const lessonData = await Lesson.findById(lesson);

  if (!lessonData) {
    throw new Error("Lesson not found.");
  }

  // Verify module exists
  const moduleData = await Module.findById(lessonData.module);

  if (!moduleData) {
    throw new Error("Module not found.");
  }

  // Verify course exists
  const courseData = await Course.findById(moduleData.course);

  if (!courseData) {
    throw new Error("Course not found.");
  }

  const assignment = await Assignment.create({
    lesson,
    module: moduleData._id,
    course: courseData._id,
    title,
    description,
    instructions,
    maxScore,
    passingScore,
    dueDate,
    submissionType,
    allowedFileTypes,
    maxFileSize,
    allowResubmission,
    attachments,
    createdBy: tutorId,
  });

  return {
    success: true,
    message: "Assignment created successfully.",
    data: assignment,
  };
};

// =========================
// Get Assignment By ID
// =========================
const getAssignmentById = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId)
    .populate("lesson", "title")
    .populate("module", "title")
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  return {
    success: true,
    message: "Assignment retrieved successfully.",
    data: assignment,
  };
};

// =========================
// Get Course Assignments
// =========================
const getCourseAssignments = async (courseId) => {
  const assignments = await Assignment.find({
    course: courseId,
  }).sort({ createdAt: -1 });

  return {
    success: true,
    message: "Assignments retrieved successfully.",
    data: assignments,
  };
};

// =========================
// Update Assignment
// =========================
const updateAssignment = async (assignmentId, updateData) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  Object.assign(assignment, updateData);

  await assignment.save();

  return {
    success: true,
    message: "Assignment updated successfully.",
    data: assignment,
  };
};

// =========================
// Delete Assignment
// =========================
const deleteAssignment = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  await assignment.deleteOne();

  return {
    success: true,
    message: "Assignment deleted successfully.",
  };
};

// =========================
// Publish Assignment
// =========================
const publishAssignment = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  assignment.status = "published";

  await assignment.save();

  return {
    success: true,
    message: "Assignment published successfully.",
    data: assignment,
  };
};

module.exports = {
  createAssignment,
  getAssignmentById,
  getCourseAssignments,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
};
