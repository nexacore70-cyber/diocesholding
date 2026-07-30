const Assessment = require("../models/Assessment");
const Course = require("../models/Course");

// ======================================
// Create Assessment
// ======================================
const createAssessment = async (assessmentData, userId) => {
  if (!assessmentData.course) {
    throw new Error("Course ID is required.");
  }

  if (!assessmentData.title) {
    throw new Error("Assessment title is required.");
  }

  const course = await Course.findById(assessmentData.course);

  if (!course) {
    throw new Error("Course not found.");
  }

  const existingAssessment = await Assessment.findOne({
    course: assessmentData.course,
  });

  if (existingAssessment) {
    throw new Error("This course already has an assessment.");
  }

  const assessment = await Assessment.create({
    ...assessmentData,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Assessment created successfully.",
    data: assessment,
  };
};

// ======================================
// Get All Assessments
// ======================================
const getAllAssessments = async () => {
  const assessments = await Assessment.find()
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Assessments retrieved successfully.",
    data: assessments,
  };
};

// ======================================
// Get Assessment By ID
// ======================================
const getAssessmentById = async (assessmentId) => {
  const assessment = await Assessment.findById(assessmentId)
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  return {
    success: true,
    message: "Assessment retrieved successfully.",
    data: assessment,
  };
};

// ======================================
// Get Assessment By Course
// ======================================
const getAssessmentByCourse = async (courseId) => {
  const assessment = await Assessment.findOne({
    course: courseId,
  })
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  return {
    success: true,
    message: "Assessment retrieved successfully.",
    data: assessment,
  };
};

// ======================================
// Update Assessment
// ======================================
const updateAssessment = async (assessmentId, updateData) => {
  const assessment = await Assessment.findByIdAndUpdate(
    assessmentId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  return {
    success: true,
    message: "Assessment updated successfully.",
    data: assessment,
  };
};

// ======================================
// Publish Assessment
// ======================================
const publishAssessment = async (assessmentId) => {
  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  assessment.status = "published";

  await assessment.save();

  return {
    success: true,
    message: "Assessment published successfully.",
    data: assessment,
  };
};

// ======================================
// Delete Assessment
// ======================================
const deleteAssessment = async (assessmentId) => {
  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  await assessment.deleteOne();

  return {
    success: true,
    message: "Assessment deleted successfully.",
  };
};

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentByCourse,
  updateAssessment,
  publishAssessment,
  deleteAssessment,
};
