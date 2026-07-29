const Assignment = require("../models/Assignment");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Course = require("../models/Course");

// ======================================
// Create Assignment
// ======================================
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

  if (!lesson) {
    throw new Error("Lesson is required.");
  }

  if (!title) {
    throw new Error("Assignment title is required.");
  }

  if (passingScore > maxScore) {
    throw new Error("Passing score cannot exceed maximum score.");
  }

  const lessonData = await Lesson.findById(lesson);

  if (!lessonData) {
    throw new Error("Lesson not found.");
  }

  const moduleData = await Module.findById(lessonData.module);

  if (!moduleData) {
    throw new Error("Module not found.");
  }

  const courseData = await Course.findById(moduleData.course);

  if (!courseData) {
    throw new Error("Course not found.");
  }

  const existing = await Assignment.findOne({
    lesson,
    title,
  });

  if (existing) {
    throw new Error(
      "An assignment with this title already exists for this lesson.",
    );
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

  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("lesson", "title")
    .populate("module", "title")
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  return {
    success: true,
    message: "Assignment created successfully.",
    data: populatedAssignment,
  };
};

// ======================================
// Get Assignment By ID
// ======================================
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

// ======================================
// Get Course Assignments
// ======================================
const getCourseAssignments = async (courseId, publishedOnly = false) => {
  const filter = { course: courseId };

  if (publishedOnly) {
    filter.status = "published";
  }

  const assignments = await Assignment.find(filter)
    .populate("lesson", "title")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Assignments retrieved successfully.",
    data: assignments,
  };
};

// ======================================
// Get Lesson Assignments
// ======================================
const getAssignmentsByLesson = async (lessonId) => {
  const assignments = await Assignment.find({
    lesson: lessonId,
    status: "published",
  }).sort({ createdAt: -1 });

  return {
    success: true,
    message: "Assignments retrieved successfully.",
    data: assignments,
  };
};

// ======================================
// Update Assignment
// ======================================
const updateAssignment = async (assignmentId, updateData) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  if (
    updateData.maxScore &&
    updateData.passingScore &&
    updateData.passingScore > updateData.maxScore
  ) {
    throw new Error("Passing score cannot exceed maximum score.");
  }

  Object.assign(assignment, updateData);

  await assignment.save();

  const updatedAssignment = await Assignment.findById(assignment._id)
    .populate("lesson", "title")
    .populate("module", "title")
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  return {
    success: true,
    message: "Assignment updated successfully.",
    data: updatedAssignment,
  };
};

// ======================================
// Delete Assignment
// ======================================
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

// ======================================
// Publish Assignment
// ======================================
const publishAssignment = async (assignmentId) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  if (assignment.status === "published") {
    throw new Error("Assignment is already published.");
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
  getAssignmentsByLesson,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
};
