const mongoose = require("mongoose");

const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Course = require("../models/Course");

// ======================================
// Helpers
// ======================================

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) {
    return [];
  }

  return [
    ...new Set(
      roles.filter(Boolean).map((role) => String(role).trim().toLowerCase()),
    ),
  ];
};

// ======================================
// Check Tutor Ownership
// ======================================

const tutorCanManageCourse = (course, tutorId) => {
  if (!course || !tutorId) {
    return false;
  }

  const tutorIdString = String(tutorId);

  if (String(course.tutor) === tutorIdString) {
    return true;
  }

  if (Array.isArray(course.coTutors)) {
    return course.coTutors.some((coTutor) => String(coTutor) === tutorIdString);
  }

  return false;
};

// ======================================
// Create Enrollment
// ======================================

const createEnrollment = async (enrollmentData) => {
  if (
    !enrollmentData ||
    typeof enrollmentData !== "object" ||
    Array.isArray(enrollmentData)
  ) {
    throw createServiceError("Invalid enrollment data.", 400);
  }

  const { student, course } = enrollmentData;

  if (!student) {
    throw createServiceError("Student ID is required.", 400);
  }

  if (!course) {
    throw createServiceError("Course ID is required.", 400);
  }

  if (!isValidObjectId(student)) {
    throw createServiceError("Invalid student identifier.", 400);
  }

  if (!isValidObjectId(course)) {
    throw createServiceError("Invalid course identifier.", 400);
  }

  // ======================================
  // Find Student
  // ======================================

  const existingStudent = await User.findOne({
    _id: student,
    deletedAt: null,
  }).select("_id roles status isActive firstName lastName email");

  if (!existingStudent) {
    throw createServiceError("Student not found.", 404);
  }

  // ======================================
  // Validate Student
  // ======================================

  if (existingStudent.status !== "active") {
    throw createServiceError("This student account is not active.", 403);
  }

  if (existingStudent.isActive !== true) {
    throw createServiceError("This student account is inactive.", 403);
  }

  const studentRoles = normalizeRoles(existingStudent.roles);

  if (!studentRoles.includes("student")) {
    throw createServiceError(
      "Only users with the student role can have student enrollments.",
      403,
    );
  }

  // ======================================
  // Find Course
  // ======================================

  const existingCourse = await Course.findOne({
    _id: course,
    isDeleted: false,
  }).select(
    "_id title slug tutor coTutors status isDeleted pricing certificateAvailable",
  );

  if (!existingCourse) {
    throw createServiceError("Course not found.", 404);
  }

  // ======================================
  // Course Must Be Published
  // ======================================

  if (existingCourse.status !== "published") {
    throw createServiceError(
      "This course is not currently available for enrollment.",
      400,
    );
  }

  // ======================================
  // IMPORTANT PAYMENT SAFETY
  // ======================================
  //
  // Do not silently enroll a student into a
  // paid course before payment verification
  // exists.
  //
  // For now, this endpoint supports free
  // courses only.
  //
  // Paid-course enrollment will later go through
  // the payment verification service.
  // ======================================

  const courseAmount = Number(existingCourse.pricing?.amount || 0);

  const isFree = existingCourse.pricing?.isFree === true || courseAmount <= 0;

  if (!isFree) {
    throw createServiceError(
      "This course requires payment before enrollment.",
      402,
    );
  }

  // ======================================
  // Existing Enrollment
  // ======================================

  const existingEnrollment = await Enrollment.findOne({
    student,
    course,
  }).select("_id status progress completedAt certificateIssued");

  if (existingEnrollment) {
    // ======================================
    // Reactivate Cancelled Enrollment
    // ======================================

    if (existingEnrollment.status === "cancelled") {
      existingEnrollment.status = "active";
      existingEnrollment.progress = 0;
      existingEnrollment.completedAt = null;
      existingEnrollment.certificateIssued = false;

      await existingEnrollment.save();

      await Course.updateOne(
        { _id: course },
        {
          $inc: {
            "analytics.enrolledStudents": 1,
          },
        },
      );

      const enrollment = await Enrollment.findById(existingEnrollment._id)
        .populate("student", "firstName lastName email")
        .populate("course", "title slug");

      return {
        success: true,
        message: "Enrollment reactivated successfully.",
        data: enrollment,
      };
    }

    throw createServiceError(
      "Student is already enrolled in this course.",
      409,
    );
  }

  // ======================================
  // Create
  // ======================================

  let enrollment;

  try {
    enrollment = await Enrollment.create({
      student,
      course,
      status: "active",
      progress: 0,
      enrolledAt: new Date(),
      completedAt: null,
      certificateIssued: false,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createServiceError(
        "Student is already enrolled in this course.",
        409,
      );
    }

    throw error;
  }

  // ======================================
  // Update Course Analytics
  // ======================================

  await Course.updateOne(
    { _id: course },
    {
      $inc: {
        "analytics.enrolledStudents": 1,
      },
    },
  );

  // ======================================
  // Populate
  // ======================================

  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate("student", "firstName lastName email")
    .populate("course", "title slug");

  return {
    success: true,
    message: "Enrollment created successfully.",
    data: populatedEnrollment,
  };
};

// ======================================
// Get All Enrollments
// ======================================

const getAllEnrollments = async () => {
  const enrollments = await Enrollment.find()
    .populate("student", "firstName lastName email")
    .populate("course", "title slug")
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    success: true,
    message: "Enrollments retrieved successfully.",
    data: enrollments,
  };
};

// ======================================
// Get Tutor Enrollments
// ======================================

const getTutorEnrollments = async (tutorId) => {
  if (!isValidObjectId(tutorId)) {
    throw createServiceError("Invalid tutor identifier.", 400);
  }

  const enrollments = await Enrollment.find()
    .populate({
      path: "course",
      match: {
        $or: [{ tutor: tutorId }, { coTutors: tutorId }],
      },
      select: "title slug tutor coTutors",
    })
    .populate("student", "firstName lastName email")
    .sort({
      createdAt: -1,
    })
    .lean();

  const filteredEnrollments = enrollments.filter(
    (enrollment) => enrollment.course !== null,
  );

  return {
    success: true,
    message: "Tutor enrollments retrieved successfully.",
    data: filteredEnrollments,
  };
};

// ======================================
// Get My Enrollments
// ======================================

const getMyEnrollments = async (studentId) => {
  if (!isValidObjectId(studentId)) {
    throw createServiceError("Invalid student identifier.", 400);
  }

  const enrollments = await Enrollment.find({
    student: studentId,
  })
    .populate(
      "course",
      "title slug description thumbnail pricing difficulty duration certificateAvailable status",
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    success: true,
    message: "Your enrollments retrieved successfully.",
    data: enrollments,
  };
};

// ======================================
// Get Single Enrollment
// ======================================

const getEnrollmentById = async (enrollmentId) => {
  if (!isValidObjectId(enrollmentId)) {
    throw createServiceError("Invalid enrollment identifier.", 400);
  }

  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("student", "firstName lastName email")
    .populate("course", "title slug tutor coTutors")
    .lean();

  if (!enrollment) {
    throw createServiceError("Enrollment not found.", 404);
  }

  return {
    success: true,
    message: "Enrollment retrieved successfully.",
    data: enrollment,
  };
};

// ======================================
// Update Enrollment
// ======================================

const updateEnrollment = async (enrollmentId, updateData, actor) => {
  if (!isValidObjectId(enrollmentId)) {
    throw createServiceError("Invalid enrollment identifier.", 400);
  }

  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    throw createServiceError("Invalid enrollment data.", 400);
  }

  if (!actor || !actor._id) {
    throw createServiceError("Authentication required.", 401);
  }

  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw createServiceError("Enrollment not found.", 404);
  }

  // ======================================
  // Load Course
  // ======================================

  const course = await Course.findById(enrollment.course).select(
    "_id tutor coTutors analytics",
  );

  if (!course) {
    throw createServiceError(
      "Course associated with enrollment was not found.",
      404,
    );
  }

  // ======================================
  // Authorization
  // ======================================

  const actorRoles = normalizeRoles(actor.roles);

  const isAdmin = actorRoles.includes("admin");

  const isTutor = actorRoles.includes("tutor");

  if (!isAdmin) {
    if (!isTutor) {
      throw createServiceError(
        "You do not have permission to update this enrollment.",
        403,
      );
    }

    if (!tutorCanManageCourse(course, actor._id)) {
      throw createServiceError("You do not manage this course.", 403);
    }
  }

  // ======================================
  // Allowed Fields
  // ======================================

  const allowedFields = [
    "status",
    "progress",
    "completedAt",
    "certificateIssued",
  ];

  const safeUpdates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updateData, field)) {
      safeUpdates[field] = updateData[field];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    throw createServiceError("No valid enrollment fields were provided.", 400);
  }

  // ======================================
  // Validate Status
  // ======================================

  const allowedStatuses = ["active", "completed", "cancelled", "suspended"];

  if (
    safeUpdates.status !== undefined &&
    !allowedStatuses.includes(safeUpdates.status)
  ) {
    throw createServiceError("Invalid enrollment status.", 400);
  }

  // ======================================
  // Validate Progress
  // ======================================

  if (safeUpdates.progress !== undefined) {
    const progress = Number(safeUpdates.progress);

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      throw createServiceError(
        "Progress must be a number between 0 and 100.",
        400,
      );
    }

    safeUpdates.progress = progress;
  }

  // ======================================
  // Certificate
  // ======================================

  if (safeUpdates.certificateIssued !== undefined) {
    if (typeof safeUpdates.certificateIssued !== "boolean") {
      throw createServiceError("certificateIssued must be a boolean.", 400);
    }

    // Certificate cannot be issued for an
    // enrollment that is not completed.
    if (
      safeUpdates.certificateIssued === true &&
      safeUpdates.status !== "completed" &&
      enrollment.status !== "completed"
    ) {
      throw createServiceError(
        "A certificate can only be issued for a completed enrollment.",
        400,
      );
    }
  }

  // ======================================
  // Completed Date
  // ======================================

  if (safeUpdates.completedAt !== undefined) {
    if (safeUpdates.completedAt !== null) {
      const completedAt = new Date(safeUpdates.completedAt);

      if (Number.isNaN(completedAt.getTime())) {
        throw createServiceError("Invalid completedAt date.", 400);
      }

      safeUpdates.completedAt = completedAt;
    }
  }

  // ======================================
  // Completion Rules
  // ======================================

  if (safeUpdates.status === "completed") {
    safeUpdates.progress = 100;

    if (safeUpdates.completedAt === undefined) {
      safeUpdates.completedAt = new Date();
    }
  }

  // ======================================
  // Cancel Rules
  // ======================================

  if (safeUpdates.status === "cancelled") {
    safeUpdates.completedAt = null;
    safeUpdates.certificateIssued = false;
  }

  // ======================================
  // Existing Status
  // ======================================

  const oldStatus = enrollment.status;

  Object.assign(enrollment, safeUpdates);

  await enrollment.save();

  // ======================================
  // Analytics
  // ======================================

  if (oldStatus !== "cancelled" && enrollment.status === "cancelled") {
    await Course.updateOne(
      { _id: enrollment.course },
      {
        $inc: {
          "analytics.enrolledStudents": -1,
        },
      },
    );
  }

  if (oldStatus === "cancelled" && enrollment.status !== "cancelled") {
    await Course.updateOne(
      { _id: enrollment.course },
      {
        $inc: {
          "analytics.enrolledStudents": 1,
        },
      },
    );
  }

  // ======================================
  // Completed Analytics
  // ======================================

  if (oldStatus !== "completed" && enrollment.status === "completed") {
    await Course.updateOne(
      { _id: enrollment.course },
      {
        $inc: {
          "analytics.completedStudents": 1,
        },
      },
    );
  }

  if (oldStatus === "completed" && enrollment.status !== "completed") {
    await Course.updateOne(
      { _id: enrollment.course },
      {
        $inc: {
          "analytics.completedStudents": -1,
        },
      },
    );
  }

  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate("student", "firstName lastName email")
    .populate("course", "title slug");

  return {
    success: true,
    message: "Enrollment updated successfully.",
    data: populatedEnrollment,
  };
};

// ======================================
// Delete Enrollment
// ======================================

const deleteEnrollment = async (enrollmentId, actor) => {
  if (!isValidObjectId(enrollmentId)) {
    throw createServiceError("Invalid enrollment identifier.", 400);
  }

  if (!actor || !actor._id) {
    throw createServiceError("Authentication required.", 401);
  }

  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw createServiceError("Enrollment not found.", 404);
  }

  const actorRoles = normalizeRoles(actor.roles);

  const isAdmin = actorRoles.includes("admin");

  if (!isAdmin) {
    throw createServiceError(
      "Only administrators can delete enrollments.",
      403,
    );
  }

  const oldStatus = enrollment.status;

  await Enrollment.deleteOne({
    _id: enrollmentId,
  });

  // ======================================
  // Keep Analytics Consistent
  // ======================================

  if (oldStatus !== "cancelled") {
    await Course.updateOne(
      { _id: enrollment.course },
      {
        $inc: {
          "analytics.enrolledStudents": -1,
        },
      },
    );
  }

  if (oldStatus === "completed") {
    await Course.updateOne(
      { _id: enrollment.course },
      {
        $inc: {
          "analytics.completedStudents": -1,
        },
      },
    );
  }

  return {
    success: true,
    message: "Enrollment deleted successfully.",
  };
};

// ======================================
// Export
// ======================================

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getTutorEnrollments,
  getMyEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
