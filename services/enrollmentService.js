const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Course = require("../models/Course");

// Create Enrollment
const createEnrollment = async (enrollmentData) => {
  const { student, course } = enrollmentData;

  if (!student) {
    throw new Error("Student ID is required.");
  }

  if (!course) {
    throw new Error("Course ID is required.");
  }

  // Check if student exists
  const existingStudent = await User.findById(student);

  if (!existingStudent) {
    throw new Error("Student not found.");
  }

  // Check if course exists
  const existingCourse = await Course.findById(course);

  if (!existingCourse) {
    throw new Error("Course not found.");
  }

  // Prevent duplicate enrollment
  const existingEnrollment = await Enrollment.findOne({
    student,
    course,
  });

  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this course.");
  }

  const enrollment = await Enrollment.create(enrollmentData);

  return {
    success: true,
    message: "Enrollment created successfully.",
    data: enrollment,
  };
};

// Get All Enrollments
const getAllEnrollments = async () => {
  const enrollments = await Enrollment.find()
    .populate("student", "firstName lastName email")
    .populate("course", "title slug")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Enrollments retrieved successfully.",
    data: enrollments,
  };
};

// Get Single Enrollment
const getEnrollmentById = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("student", "firstName lastName email")
    .populate("course", "title slug");

  if (!enrollment) {
    throw new Error("Enrollment not found.");
  }

  return {
    success: true,
    message: "Enrollment retrieved successfully.",
    data: enrollment,
  };
};

// Update Enrollment
const updateEnrollment = async (enrollmentId, updateData) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("student", "firstName lastName email")
    .populate("course", "title slug");

  if (!enrollment) {
    throw new Error("Enrollment not found.");
  }

  return {
    success: true,
    message: "Enrollment updated successfully.",
    data: enrollment,
  };
};

// Delete Enrollment
const deleteEnrollment = async (enrollmentId) => {
  const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);

  if (!enrollment) {
    throw new Error("Enrollment not found.");
  }

  return {
    success: true,
    message: "Enrollment deleted successfully.",
  };
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
