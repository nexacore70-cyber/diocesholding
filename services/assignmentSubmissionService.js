const mongoose = require("mongoose");

const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Enrollment = require("../models/Enrollment");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const assertObjectId = (
  id,
  message = "Invalid ID.",
) => {
  if (!isValidObjectId(id)) {
    throw new Error(message);
  }
};

const normalizeString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const isValidUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);

    return ["http:", "https:"].includes(
      parsed.protocol,
    );
  } catch {
    return false;
  }
};

const hasRoles = (user, role) => {
  return user?.roles?.includes(role);
};

const isAssignmentOwner = (
  assignment,
  user,
) => {
  return (
    assignment.createdBy?.toString() ===
    user?._id?.toString()
  );
};

const assertTutorCanManageAssignment = (
  assignment,
  user,
) => {
  const isAdmin = hasRoles(user, "admin");
  const isOwner = isAssignmentOwner(
    assignment,
    user,
  );

  if (!isAdmin && !isOwner) {
    throw new Error(
      "You are not authorized to manage this assignment.",
    );
  }
};

// ======================================
// Validate Submission Files
// ======================================

const validateSubmittedFiles = (
  files,
  assignment,
) => {
  if (files === undefined) {
    return [];
  }

  if (!Array.isArray(files)) {
    throw new Error(
      "Submitted files must be an array.",
    );
  }

  if (files.length > 20) {
    throw new Error(
      "A submission cannot contain more than 20 files.",
    );
  }

  const allowedTypes =
    assignment.allowedFileTypes || [];

  return files.map((file) => {
    if (!file || typeof file !== "object") {
      throw new Error("Invalid submitted file.");
    }

    const fileName = normalizeString(
      file.fileName,
    );

    const fileUrl = normalizeString(
      file.fileUrl,
    );

    const fileType = normalizeString(
      file.fileType,
    ).toLowerCase();

    const fileSize = Number(file.fileSize);

    if (!fileName) {
      throw new Error(
        "Submitted file name is required.",
      );
    }

    if (!fileUrl || !isValidUrl(fileUrl)) {
      throw new Error(
        "Submitted file URL must be a valid HTTP or HTTPS URL.",
      );
    }

    if (!fileType) {
      throw new Error(
        "Submitted file type is required.",
      );
    }

    if (
      !Number.isFinite(fileSize) ||
      fileSize <= 0
    ) {
      throw new Error(
        "Submitted file size must be greater than zero.",
      );
    }

    if (
      fileSize > assignment.maxFileSize
    ) {
      throw new Error(
        `File "${fileName}" exceeds the maximum allowed file size.`,
      );
    }

    if (
      allowedTypes.length > 0 &&
      !allowedTypes.includes(fileType) &&
      !allowedTypes.includes(
        fileType.split("/").pop(),
      )
    ) {
      throw new Error(
        `File type "${fileType}" is not allowed for this assignment.`,
      );
    }

    return {
      fileName,
      fileUrl,
      fileType,
      fileSize,
    };
  });
};

// ======================================
// Validate Submission According To Type
// ======================================

const validateSubmissionData = (
  assignment,
  data,
) => {
  const submissionText =
    normalizeString(
      data.submissionText,
    );

  const githubUrl =
    normalizeString(data.githubUrl);

  const driveUrl =
    normalizeString(data.driveUrl);

  const submittedFiles =
    validateSubmittedFiles(
      data.submittedFiles,
      assignment,
    );

  if (
    githubUrl &&
    !isValidUrl(githubUrl)
  ) {
    throw new Error(
      "GitHub URL must be a valid HTTP or HTTPS URL.",
    );
  }

  if (
    driveUrl &&
    !isValidUrl(driveUrl)
  ) {
    throw new Error(
      "Drive URL must be a valid HTTP or HTTPS URL.",
    );
  }

  switch (assignment.submissionType) {
    case "text":
      if (!submissionText) {
        throw new Error(
          "A text submission is required.",
        );
      }
      break;

    case "file":
      if (submittedFiles.length === 0) {
        throw new Error(
          "At least one file is required.",
        );
      }
      break;

    case "github":
      if (!githubUrl) {
        throw new Error(
          "A GitHub repository URL is required.",
        );
      }
      break;

    case "link":
      if (!driveUrl) {
        throw new Error(
          "A submission link is required.",
        );
      }
      break;

    case "mixed":
      if (
        !submissionText &&
        !githubUrl &&
        !driveUrl &&
        submittedFiles.length === 0
      ) {
        throw new Error(
          "Please provide at least one submission.",
        );
      }
      break;

    default:
      throw new Error(
        "Invalid assignment submission type.",
      );
  }

  return {
    submissionText,
    githubUrl,
    driveUrl,
    submittedFiles,
  };
};

// ======================================
// Find Active Enrollment
// ======================================

const findStudentEnrollment = async (
  studentId,
  courseId,
) => {
  const enrollment =
    await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: {
        $in: ["active", "completed"],
      },
    });

  if (!enrollment) {
    throw new Error(
      "You are not enrolled in this course.",
    );
  }

  return enrollment;
};

// ======================================
// Submit Assignment
// ======================================

const submitAssignment = async (
  assignmentId,
  studentId,
  submissionData,
) => {
  assertObjectId(
    assignmentId,
    "Invalid assignment ID.",
  );

  assertObjectId(
    studentId,
    "Invalid student ID.",
  );

  const assignment =
    await Assignment.findById(
      assignmentId,
    );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  if (assignment.status !== "published") {
    throw new Error(
      "This assignment is not available for submission.",
    );
  }

  const enrollment =
    await findStudentEnrollment(
      studentId,
      assignment.course,
    );

  const validated =
    validateSubmissionData(
      assignment,
      submissionData || {},
    );

  const now = new Date();

  const isLate =
    assignment.dueDate &&
    now > assignment.dueDate;

  const existingSubmission =
    await AssignmentSubmission.findOne({
      assignment: assignment._id,
      student: studentId,
    });

  // ======================================
  // Existing Submission
  // ======================================

  if (existingSubmission) {
    if (!assignment.allowResubmission) {
      throw new Error(
        "This assignment has already been submitted and resubmission is not allowed.",
      );
    }

    if (
      existingSubmission.status === "graded" &&
      existingSubmission.passed
    ) {
      throw new Error(
        "A passed assignment cannot be resubmitted.",
      );
    }

    existingSubmission.attemptNumber += 1;

    existingSubmission.submissionText =
      validated.submissionText;

    existingSubmission.githubUrl =
      validated.githubUrl;

    existingSubmission.driveUrl =
      validated.driveUrl;

    existingSubmission.submittedFiles =
      validated.submittedFiles;

    existingSubmission.submittedAt =
      existingSubmission.submittedAt ||
      now;

    existingSubmission.lastSubmittedAt =
      now;

    existingSubmission.isLate =
      Boolean(isLate);

    existingSubmission.status =
      isLate ? "late" : "submitted";

    // Reset grading state.
    existingSubmission.score = null;
    existingSubmission.passed = false;
    existingSubmission.feedback = "";
    existingSubmission.gradingRemarks = "";
    existingSubmission.gradedBy = null;
    existingSubmission.gradedAt = null;

    await existingSubmission.save();

    await existingSubmission.populate(
      "assignment",
      "title maxScore passingScore dueDate",
    );

    return {
      success: true,
      message:
        "Assignment resubmitted successfully.",
      data: existingSubmission,
    };
  }

  // ======================================
  // First Submission
  // ======================================

  const submission =
    await AssignmentSubmission.create({
      assignment: assignment._id,

      student: studentId,

      enrollment: enrollment._id,

      attemptNumber: 1,

      submissionText:
        validated.submissionText,

      githubUrl:
        validated.githubUrl,

      driveUrl:
        validated.driveUrl,

      submittedFiles:
        validated.submittedFiles,

      submittedAt: now,

      lastSubmittedAt: now,

      isLate: Boolean(isLate),

      status:
        isLate ? "late" : "submitted",
    });

  await submission.populate(
    "assignment",
    "title maxScore passingScore dueDate",
  );

  return {
    success: true,
    message:
      "Assignment submitted successfully.",
    data: submission,
  };
};

// ======================================
// Get My Submissions
// ======================================

const getMySubmissions = async (
  studentId,
) => {
  assertObjectId(
    studentId,
    "Invalid student ID.",
  );

  const submissions =
    await AssignmentSubmission.find({
      student: studentId,
    })
      .populate(
        "assignment",
        "title description maxScore passingScore dueDate status",
      )
      .sort({
        createdAt: -1,
      })
      .lean();

  return {
    success: true,
    message:
      "Submissions retrieved successfully.",
    data: submissions,
  };
};

// ======================================
// Get Submission By ID
// ======================================

const getSubmissionById = async (
  submissionId,
  user,
) => {
  assertObjectId(
    submissionId,
    "Invalid submission ID.",
  );

  const submission =
    await AssignmentSubmission.findById(
      submissionId,
    )
      .populate(
        "assignment",
        "title description instructions maxScore passingScore dueDate status createdBy course",
      )
      .populate(
        "student",
        "firstName lastName email",
      )
      .populate(
        "gradedBy",
        "firstName lastName",
      );

  if (!submission) {
    throw new Error(
      "Submission not found.",
    );
  }

  assertTutorCanManageAssignment(
    submission.assignment,
    user,
  );

  return {
    success: true,
    message:
      "Submission retrieved successfully.",
    data: submission,
  };
};

// ======================================
// Grade Submission
// ======================================

const gradeSubmission = async (
  submissionId,
  tutorId,
  score,
  feedback = "",
  gradingRemarks = "",
) => {
  assertObjectId(
    submissionId,
    "Invalid submission ID.",
  );

  assertObjectId(
    tutorId,
    "Invalid tutor ID.",
  );

  const submission =
    await AssignmentSubmission.findById(
      submissionId,
    ).populate(
      "assignment",
      "title maxScore passingScore status createdBy",
    );

  if (!submission) {
    throw new Error(
      "Submission not found.",
    );
  }

  assertTutorCanManageAssignment(
    submission.assignment,
    {
      _id: tutorId,
      roles: ["tutor"],
    },
  );

  if (
    submission.status === "graded"
  ) {
    throw new Error(
      "This submission has already been graded.",
    );
  }

  if (
    submission.assignment.status === "draft"
  ) {
    throw new Error(
      "A submission for a draft assignment cannot be graded.",
    );
  }

  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    throw new Error(
      "Score must be a valid number.",
    );
  }

  if (
    numericScore < 0 ||
    numericScore >
      submission.assignment.maxScore
  ) {
    throw new Error(
      `Score must be between 0 and ${submission.assignment.maxScore}.`,
    );
  }

  const normalizedFeedback =
    normalizeString(feedback);

  const normalizedRemarks =
    normalizeString(gradingRemarks);

  submission.score =
    numericScore;

  submission.feedback =
    normalizedFeedback;

  submission.gradingRemarks =
    normalizedRemarks;

  submission.passed =
    numericScore >=
    submission.assignment.passingScore;

  submission.gradedBy =
    tutorId;

  submission.gradedAt =
    new Date();

  submission.status =
    "graded";

  await submission.save();

  await submission.populate(
    "gradedBy",
    "firstName lastName",
  );

  return {
    success: true,
    message:
      "Submission graded successfully.",
    data: submission,
  };
};

// ======================================
// Return Submission For Revision
// ======================================

const returnSubmission = async (
  submissionId,
  tutorId,
  feedback = "",
  gradingRemarks = "",
) => {
  assertObjectId(
    submissionId,
    "Invalid submission ID.",
  );

  assertObjectId(
    tutorId,
    "Invalid tutor ID.",
  );

  const submission =
    await AssignmentSubmission.findById(
      submissionId,
    ).populate(
      "assignment",
      "title status createdBy",
    );

  if (!submission) {
    throw new Error(
      "Submission not found.",
    );
  }

  assertTutorCanManageAssignment(
    submission.assignment,
    {
      _id: tutorId,
      roles: ["tutor"],
    },
  );

  submission.feedback =
    normalizeString(feedback);

  submission.gradingRemarks =
    normalizeString(gradingRemarks);

  submission.gradedBy =
    tutorId;

  submission.gradedAt =
    new Date();

  submission.status =
    "returned";

  submission.score = null;
  submission.passed = false;

  await submission.save();

  await submission.populate(
    "gradedBy",
    "firstName lastName",
  );

  return {
    success: true,
    message:
      "Submission returned to student for revision.",
    data: submission,
  };
};

module.exports = {
  submitAssignment,
  getMySubmissions,
  getSubmissionById,
  gradeSubmission,
  returnSubmission,
};