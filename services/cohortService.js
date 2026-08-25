const mongoose = require("mongoose");

const Cohort = require("../models/Cohort");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

// ======================================
// Helpers
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeCode = (code) => {
  return String(code || "")
    .trim()
    .toUpperCase();
};

const validateObjectId = (id, fieldName) => {
  if (!id || !isValidObjectId(id)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
};

// ======================================
// Create Cohort
// ======================================

const createCohort = async (data, adminId) => {
  const {
    name,
    code,
    description = "",
    type = "course",
    course = null,
    track = "",
    primaryTutor = null,
    tutors = [],
    capacity = 30,
    startDate,
    endDate,
    visibility = "private",
    settings = {},
  } = data;

  if (!name) {
    throw new Error("Cohort name is required.");
  }

  if (!code) {
    throw new Error("Cohort code is required.");
  }

  if (!startDate) {
    throw new Error("Cohort start date is required.");
  }

  if (!endDate) {
    throw new Error("Cohort end date is required.");
  }

  if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
    throw new Error("Cohort capacity must be at least 1.");
  }

  if (new Date(endDate) <= new Date(startDate)) {
    throw new Error(
      "Cohort end date must be after the start date.",
    );
  }

  const normalizedCode = normalizeCode(code);

  // ======================================
  // Duplicate Code Protection
  // ======================================

  const existingCohort = await Cohort.findOne({
    code: normalizedCode,
    isDeleted: false,
  }).lean();

  if (existingCohort) {
    throw new Error("A cohort with this code already exists.");
  }

  // ======================================
  // Validate Course
  // ======================================

  if (type === "course") {
    validateObjectId(course, "course");

    const courseExists = await Course.exists({
      _id: course,
    });

    if (!courseExists) {
      throw new Error("Course not found.");
    }
  }

  // ======================================
  // Validate Primary Tutor
  // ======================================

  if (primaryTutor) {
    validateObjectId(primaryTutor, "primary tutor");

    const tutor = await User.findOne({
      _id: primaryTutor,
      isDeleted: { $ne: true },
    }).select("_id roles status");

    if (!tutor) {
      throw new Error("Primary tutor not found.");
    }

    if (
      !tutor.roles ||
      !tutor.roles.includes("tutor")
    ) {
      throw new Error(
        "Primary tutor must have the tutor role.",
      );
    }

    if (
      tutor.status &&
      !["active", "verified"].includes(tutor.status)
    ) {
      throw new Error("Primary tutor is not active.");
    }
  }

  // ======================================
  // Validate Tutors
  // ======================================

  const normalizedTutors = [
    ...new Set(
      (Array.isArray(tutors) ? tutors : []).map((id) =>
        String(id),
      ),
    ),
  ];

  for (const tutorId of normalizedTutors) {
    validateObjectId(tutorId, "tutor");

    const tutor = await User.findOne({
      _id: tutorId,
      isDeleted: { $ne: true },
    }).select("_id roles status");

    if (!tutor) {
      throw new Error(`Tutor ${tutorId} not found.`);
    }

    if (
      !tutor.roles ||
      !tutor.roles.includes("tutor")
    ) {
      throw new Error(
        `User ${tutorId} is not a tutor.`,
      );
    }

    if (
      tutor.status &&
      !["active", "verified"].includes(tutor.status)
    ) {
      throw new Error(
        `Tutor ${tutorId} is not active.`,
      );
    }
  }

  // Make sure primary tutor is included.
  if (
    primaryTutor &&
    !normalizedTutors.includes(String(primaryTutor))
  ) {
    normalizedTutors.push(String(primaryTutor));
  }

  const cohort = await Cohort.create({
    name: name.trim(),
    code: normalizedCode,
    description: description.trim(),
    type,
    course: course || null,
    track: track.trim(),
    primaryTutor: primaryTutor || null,
    tutors: normalizedTutors,
    capacity: Number(capacity),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    visibility,
    settings,
    createdBy: adminId,
    status: "draft",
  });

  const populated = await Cohort.findById(cohort._id)
    .populate("course", "title slug")
    .populate(
      "primaryTutor",
      "firstName lastName email",
    )
    .populate(
      "tutors",
      "firstName lastName email",
    )
    .populate(
      "createdBy",
      "firstName lastName email",
    );

  return {
    success: true,
    message: "Cohort created successfully.",
    data: populated,
  };
};

// ======================================
// Get Cohort By ID
// ======================================

const getCohortById = async (cohortId) => {
  validateObjectId(cohortId, "cohort ID");

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  })
    .populate("course", "title slug")
    .populate(
      "primaryTutor",
      "firstName lastName email",
    )
    .populate(
      "tutors",
      "firstName lastName email",
    )
    .populate(
      "createdBy",
      "firstName lastName email",
    );

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  return {
    success: true,
    message: "Cohort retrieved successfully.",
    data: cohort,
  };
};

// ======================================
// Get Cohorts
// ======================================

const getCohorts = async (filters = {}) => {
  const query = {
    isDeleted: false,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.course) {
    validateObjectId(filters.course, "course ID");
    query.course = filters.course;
  }

  const cohorts = await Cohort.find(query)
    .populate("course", "title slug")
    .populate(
      "primaryTutor",
      "firstName lastName email",
    )
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    message: "Cohorts retrieved successfully.",
    data: cohorts,
  };
};

// ======================================
// Update Cohort
// ======================================

const updateCohort = async (cohortId, data) => {
  validateObjectId(cohortId, "cohort ID");

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  if (
    ["completed", "cancelled", "closed"].includes(
      cohort.status,
    )
  ) {
    throw new Error(
      "This cohort can no longer be modified.",
    );
  }

  // Never allow clients to change these through this method.
  delete data.createdBy;
  delete data.status;
  delete data.isDeleted;

  if (data.code) {
    const code = normalizeCode(data.code);

    const duplicate = await Cohort.findOne({
      code,
      _id: { $ne: cohortId },
      isDeleted: false,
    }).lean();

    if (duplicate) {
      throw new Error(
        "Another cohort already uses this code.",
      );
    }

    data.code = code;
  }

  if (data.startDate || data.endDate) {
    const start = data.startDate
      ? new Date(data.startDate)
      : cohort.startDate;

    const end = data.endDate
      ? new Date(data.endDate)
      : cohort.endDate;

    if (end <= start) {
      throw new Error(
        "Cohort end date must be after the start date.",
      );
    }
  }

  if (data.capacity !== undefined) {
    const capacity = Number(data.capacity);

    if (
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      throw new Error(
        "Cohort capacity must be at least 1.",
      );
    }

    const currentStudentCount =
      await Enrollment.countDocuments({
        cohort: cohortId,
        status: {
          $in: ["active", "completed"],
        },
      });

    if (capacity < currentStudentCount) {
      throw new Error(
        `Capacity cannot be lower than the current student count (${currentStudentCount}).`,
      );
    }

    data.capacity = capacity;
  }

  Object.assign(cohort, data);

  await cohort.save();

  return getCohortById(cohortId);
};

// ======================================
// Change Cohort Status
// ======================================

const updateCohortStatus = async (
  cohortId,
  newStatus,
) => {
  validateObjectId(cohortId, "cohort ID");

  const allowedStatuses = [
    "draft",
    "open",
    "active",
    "completed",
    "cancelled",
    "closed",
  ];

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Invalid cohort status.");
  }

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  if (cohort.status === newStatus) {
    throw new Error(
      `Cohort is already ${newStatus}.`,
    );
  }

  const transitions = {
    draft: ["open", "cancelled"],
    open: ["active", "closed", "cancelled"],
    active: ["completed", "closed"],
    completed: [],
    cancelled: [],
    closed: ["open"],
  };

  if (
    !transitions[cohort.status].includes(newStatus)
  ) {
    throw new Error(
      `Cannot change cohort status from ${cohort.status} to ${newStatus}.`,
    );
  }

  cohort.status = newStatus;

  await cohort.save();

  return {
    success: true,
    message: "Cohort status updated successfully.",
    data: cohort,
  };
};

// ======================================
// Get Cohort Student Count
// ======================================

const getCohortStudentCount = async (cohortId) => {
  return Enrollment.countDocuments({
    cohort: cohortId,
    status: {
      $in: ["active", "completed"],
    },
  });
};

// ======================================
// Add Student To Cohort
// ======================================

const addStudentToCohort = async (
  cohortId,
  studentId,
) => {
  validateObjectId(cohortId, "cohort ID");
  validateObjectId(studentId, "student ID");

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  if (
    !["open", "active"].includes(cohort.status)
  ) {
    throw new Error(
      "Students can only be assigned to an open or active cohort.",
    );
  }

  // ======================================
  // Student Validation
  // ======================================

  const student = await User.findOne({
    _id: studentId,
    isDeleted: { $ne: true },
  }).select("_id roles status");

  if (!student) {
    throw new Error("Student not found.");
  }

  if (
    !student.roles ||
    !student.roles.includes("student")
  ) {
    throw new Error(
      "Only users with the student role can join a cohort.",
    );
  }

  if (
    student.status &&
    !["active", "verified"].includes(student.status)
  ) {
    throw new Error("Student account is not active.");
  }

  // ======================================
  // Course Cohort Requires Course
  // ======================================

  if (!cohort.course) {
    throw new Error(
      "This cohort is not linked to a course.",
    );
  }

  // ======================================
  // Find Enrollment
  // ======================================

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: cohort.course,
    status: {
      $in: ["active", "completed"],
    },
  });

  if (!enrollment) {
    throw new Error(
      "Student must have an active enrollment in this course before joining the cohort.",
    );
  }

  // ======================================
  // Already In This Cohort
  // ======================================

  if (
    enrollment.cohort &&
    String(enrollment.cohort) === String(cohortId)
  ) {
    throw new Error(
      "Student is already assigned to this cohort.",
    );
  }

  // ======================================
  // Prevent Multiple Cohorts
  // ======================================

  if (enrollment.cohort) {
    throw new Error(
      "Student already belongs to another cohort for this course.",
    );
  }

  // ======================================
  // Capacity Check
  // ======================================

  const studentCount =
    await getCohortStudentCount(cohortId);

  if (studentCount >= cohort.capacity) {
    throw new Error(
      "This cohort has reached its capacity.",
    );
  }

  // ======================================
  // Assign
  // ======================================

  enrollment.cohort = cohort._id;

  await enrollment.save();

  return {
    success: true,
    message: "Student added to cohort successfully.",
    data: enrollment,
  };
};

// ======================================
// Remove Student From Cohort
// ======================================

const removeStudentFromCohort = async (
  cohortId,
  studentId,
) => {
  validateObjectId(cohortId, "cohort ID");
  validateObjectId(studentId, "student ID");

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  if (
    !cohort.settings.allowStudentTransfer &&
    cohort.status === "active"
  ) {
    throw new Error(
      "Student transfers are disabled for this active cohort.",
    );
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: cohort.course,
    cohort: cohortId,
  });

  if (!enrollment) {
    throw new Error(
      "Student is not assigned to this cohort.",
    );
  }

  if (enrollment.status === "completed") {
    throw new Error(
      "A completed enrollment cannot be removed from a cohort.",
    );
  }

  enrollment.cohort = null;

  await enrollment.save();

  return {
    success: true,
    message: "Student removed from cohort successfully.",
    data: enrollment,
  };
};

// ======================================
// Get Cohort Students
// ======================================

const getCohortStudents = async (cohortId) => {
  validateObjectId(cohortId, "cohort ID");

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  }).lean();

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  const enrollments = await Enrollment.find({
    cohort: cohortId,
    status: {
      $in: ["active", "completed"],
    },
  })
    .populate(
      "student",
      "firstName lastName email profileImage",
    )
    .populate("course", "title slug")
    .sort({
      createdAt: 1,
    });

  return {
    success: true,
    message: "Cohort students retrieved successfully.",
    data: {
      cohort,
      count: enrollments.length,
      capacity: cohort.capacity,
      availableSlots: Math.max(
        cohort.capacity - enrollments.length,
        0,
      ),
      students: enrollments,
    },
  };
};

// ======================================
// Get My Cohorts
// ======================================

const getMyCohorts = async (studentId) => {
  validateObjectId(studentId, "student ID");

  const enrollments = await Enrollment.find({
    student: studentId,
    cohort: { $ne: null },
    status: {
      $in: ["active", "completed"],
    },
  })
    .populate({
      path: "cohort",
      match: {
        isDeleted: false,
      },
      populate: [
        {
          path: "course",
          select: "title slug",
        },
        {
          path: "primaryTutor",
          select: "firstName lastName email",
        },
      ],
    })
    .populate("course", "title slug")
    .sort({
      createdAt: -1,
    });

  const cohorts = enrollments
    .filter((enrollment) => enrollment.cohort)
    .map((enrollment) => ({
      enrollment,
      cohort: enrollment.cohort,
    }));

  return {
    success: true,
    message: "My cohorts retrieved successfully.",
    data: cohorts,
  };
};

// ======================================
// Soft Delete Cohort
// ======================================

const deleteCohort = async (cohortId) => {
  validateObjectId(cohortId, "cohort ID");

  const cohort = await Cohort.findOne({
    _id: cohortId,
    isDeleted: false,
  });

  if (!cohort) {
    throw new Error("Cohort not found.");
  }

  const studentCount =
    await getCohortStudentCount(cohortId);

  if (studentCount > 0) {
    throw new Error(
      "A cohort with students cannot be deleted.",
    );
  }

  cohort.isDeleted = true;
  cohort.status = "closed";

  await cohort.save();

  return {
    success: true,
    message: "Cohort deleted successfully.",
  };
};

module.exports = {
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
};