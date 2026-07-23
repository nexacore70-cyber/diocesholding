const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Enrollment = require("../models/Enrollment");

// =========================
// Submit Assignment
// =========================
const submitAssignment = async (
  assignmentId,
  studentId,
  submissionData
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  if (assignment.status !== "published") {
    throw new Error("Assignment is not available.");
  }

  // Check deadline
  if (
    assignment.dueDate &&
    new Date() > assignment.dueDate
  ) {
    throw new Error("Assignment deadline has passed.");
  }

  // Check enrollment
 const enrollment = await Enrollment.findOne({
  student: studentId,
  course: assignment.course,
  status: {
    $in: ["active", "completed"],
  },
});

  if (!enrollment) {
    throw new Error(
      "You are not enrolled in this course."
    );
  }

  let submission =
    await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: studentId,
    });

  if (submission) {
    if (!assignment.allowResubmission) {
      throw new Error(
        "Assignment has already been submitted."
      );
    }

    submission.submissionText =
      submissionData.submissionText || "";

    submission.githubUrl =
      submissionData.githubUrl || "";

    submission.driveUrl =
      submissionData.driveUrl || "";

    submission.submittedFiles =
      submissionData.submittedFiles || [];

    submission.status = "submitted";
    submission.submittedAt = new Date();

    await submission.save();
  } else {
    submission =
      await AssignmentSubmission.create({
        assignment: assignmentId,
        student: studentId,
        enrollment: enrollment._id,
        submissionText:
          submissionData.submissionText || "",
        githubUrl:
          submissionData.githubUrl || "",
        driveUrl:
          submissionData.driveUrl || "",
        submittedFiles:
          submissionData.submittedFiles || [],
      });
  }

  return {
    success: true,
    message: "Assignment submitted successfully.",
    data: submission,
  };
};

// =========================
// Get My Submissions
// =========================
const getMySubmissions = async (studentId) => {
  const submissions =
    await AssignmentSubmission.find({
      student: studentId,
    })
      .populate("assignment", "title")
      .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Submissions retrieved successfully.",
    data: submissions,
  };
};

// =========================
// Get Submission By ID
// =========================
const getSubmissionById = async (
  submissionId
) => {
  const submission =
    await AssignmentSubmission.findById(
      submissionId
    )
      .populate("assignment")
      .populate(
        "student",
        "firstName lastName email"
      );

  if (!submission) {
    throw new Error("Submission not found.");
  }

  return {
    success: true,
    message: "Submission retrieved successfully.",
    data: submission,
  };
};

// =========================
// Grade Submission
// =========================
const gradeSubmission = async (
  submissionId,
  tutorId,
  score,
  feedback
) => {
  const submission =
    await AssignmentSubmission.findById(
      submissionId
    ).populate("assignment");

  if (!submission) {
    throw new Error("Submission not found.");
  }

  if (
    score < 0 ||
    score > submission.assignment.maxScore
  ) {
    throw new Error("Invalid score.");
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.gradedBy = tutorId;
  submission.gradedAt = new Date();
  submission.status = "graded";

  await submission.save();

  return {
    success: true,
    message: "Submission graded successfully.",
    data: submission,
  };
};

module.exports = {
  submitAssignment,
  getMySubmissions,
  getSubmissionById,
  gradeSubmission,
};