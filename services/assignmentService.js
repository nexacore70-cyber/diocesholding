const mongoose = require("mongoose");

const Assignment = require("../models/Assignment");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const Course = require("../models/Course");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const assertObjectId = (id, message = "Invalid ID.") => {
  if (!isValidObjectId(id)) {
    throw new Error(message);
  }
};

const normalizeString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
};

const validateUrl = (value, fieldName) => {
  if (!value) {
    return;
  }

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error(`${fieldName} must be a valid HTTP or HTTPS URL.`);
  }
};

const validateNumber = (
  value,
  fieldName,
  {
    min = null,
    max = null,
    required = false,
  } = {},
) => {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new Error(`${fieldName} is required.`);
    }

    return;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  if (min !== null && number < min) {
    throw new Error(`${fieldName} cannot be less than ${min}.`);
  }

  if (max !== null && number > max) {
    throw new Error(`${fieldName} cannot exceed ${max}.`);
  }

  return number;
};

const validateDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid due date.");
  }

  return date;
};

const validateAttachments = (attachments = []) => {
  if (!Array.isArray(attachments)) {
    throw new Error("Attachments must be an array.");
  }

  if (attachments.length > 20) {
    throw new Error("An assignment cannot have more than 20 attachments.");
  }

  return attachments.map((attachment) => {
    if (!attachment || typeof attachment !== "object") {
      throw new Error("Invalid assignment attachment.");
    }

    const name = normalizeString(attachment.name);
    const url = normalizeString(attachment.url);

    if (!name) {
      throw new Error("Attachment name is required.");
    }

    if (!url) {
      throw new Error("Attachment URL is required.");
    }

    validateUrl(url, "Attachment URL");

    return {
      name,
      url,
    };
  });
};

const buildAssignmentResponse = async (assignmentId) => {
  return Assignment.findById(assignmentId)
    .populate("lesson", "title")
    .populate("module", "title")
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");
};

// ======================================
// Create Assignment
// ======================================

const createAssignment = async (data, tutorId) => {
  assertObjectId(tutorId, "Invalid tutor ID.");

  if (!data || typeof data !== "object") {
    throw new Error("Assignment data is required.");
  }

  const {
    lesson,
    title,
    description,
    instructions = "",
    maxScore = 100,
    passingScore = 50,
    dueDate = null,
    submissionType = "mixed",
    allowedFileTypes = [],
    maxFileSize = 10 * 1024 * 1024,
    allowResubmission = false,
    attachments = [],
  } = data;

  assertObjectId(lesson, "Invalid lesson ID.");

  const normalizedTitle = normalizeString(title);
  const normalizedDescription = normalizeString(description);
  const normalizedInstructions = normalizeString(instructions);

  if (!normalizedTitle) {
    throw new Error("Assignment title is required.");
  }

  if (normalizedTitle.length < 2 || normalizedTitle.length > 200) {
    throw new Error(
      "Assignment title must be between 2 and 200 characters.",
    );
  }

  if (!normalizedDescription) {
    throw new Error("Assignment description is required.");
  }

  const normalizedMaxScore = validateNumber(
    maxScore,
    "Maximum score",
    {
      min: 1,
      max: 100000,
      required: true,
    },
  );

  const normalizedPassingScore = validateNumber(
    passingScore,
    "Passing score",
    {
      min: 0,
      max: 100000,
      required: true,
    },
  );

  if (normalizedPassingScore > normalizedMaxScore) {
    throw new Error("Passing score cannot exceed maximum score.");
  }

  const normalizedDueDate = validateDate(dueDate);

  if (
    normalizedDueDate &&
    normalizedDueDate <= new Date()
  ) {
    throw new Error(
      "Assignment due date must be in the future.",
    );
  }

  const allowedSubmissionTypes = [
    "text",
    "file",
    "github",
    "link",
    "mixed",
  ];

  if (!allowedSubmissionTypes.includes(submissionType)) {
    throw new Error("Invalid submission type.");
  }

  const normalizedMaxFileSize = validateNumber(
    maxFileSize,
    "Maximum file size",
    {
      min: 1,
      max: 100 * 1024 * 1024,
    },
  );

  if (!Array.isArray(allowedFileTypes)) {
    throw new Error("Allowed file types must be an array.");
  }

  if (allowedFileTypes.length > 50) {
    throw new Error(
      "Too many allowed file types.",
    );
  }

  const normalizedFileTypes = allowedFileTypes
    .map((type) => String(type).trim().toLowerCase())
    .filter(Boolean);

  const normalizedAttachments =
    validateAttachments(attachments);

  const lessonData = await Lesson.findById(lesson)
    .select("_id module")
    .lean();

  if (!lessonData) {
    throw new Error("Lesson not found.");
  }

  if (!lessonData.module) {
    throw new Error(
      "Lesson is not associated with a module.",
    );
  }

  const moduleData = await Module.findById(
    lessonData.module,
  )
    .select("_id course")
    .lean();

  if (!moduleData) {
    throw new Error("Module not found.");
  }

  if (!moduleData.course) {
    throw new Error(
      "Module is not associated with a course.",
    );
  }

  const courseData = await Course.findById(
    moduleData.course,
  )
    .select("_id title slug")
    .lean();

  if (!courseData) {
    throw new Error("Course not found.");
  }

  const existing = await Assignment.exists({
    lesson,
    title: normalizedTitle,
  });

  if (existing) {
    throw new Error(
      "An assignment with this title already exists for this lesson.",
    );
  }

  const assignment = await Assignment.create({
    lesson: lessonData._id,
    module: moduleData._id,
    course: courseData._id,

    title: normalizedTitle,
    description: normalizedDescription,
    instructions: normalizedInstructions,

    maxScore: normalizedMaxScore,
    passingScore: normalizedPassingScore,

    dueDate: normalizedDueDate,

    submissionType,

    allowedFileTypes: normalizedFileTypes,

    maxFileSize: normalizedMaxFileSize,

    allowResubmission: Boolean(allowResubmission),

    status: "draft",

    attachments: normalizedAttachments,

    createdBy: tutorId,
  });

  const populatedAssignment =
    await buildAssignmentResponse(
      assignment._id,
    );

  return {
    success: true,
    message: "Assignment created successfully.",
    data: populatedAssignment,
  };
};

// ======================================
// Get Assignment By ID
// ======================================

const getAssignmentById = async (
  assignmentId,
  user = null,
) => {
  assertObjectId(assignmentId, "Invalid assignment ID.");

  const assignment = await Assignment.findById(
    assignmentId,
  )
    .populate("lesson", "title")
    .populate("module", "title")
    .populate("course", "title slug")
    .populate("createdBy", "firstName lastName");

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  // Students must not receive draft assignments.
  const isStudent =
    user?.roles?.includes("student");

  if (
    isStudent &&
    assignment.status !== "published"
  ) {
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

const getCourseAssignments = async (
  courseId,
  user,
) => {
  assertObjectId(courseId, "Invalid course ID.");

  const isStudent =
    user?.roles?.includes("student");

  const filter = {
    course: courseId,
  };

  if (isStudent) {
    filter.status = "published";
  }

  const assignments = await Assignment.find(filter)
    .populate("lesson", "title")
    .populate("module", "title")
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    success: true,
    message: "Assignments retrieved successfully.",
    data: assignments,
  };
};

// ======================================
// Get Lesson Assignments
// ======================================

const getAssignmentsByLesson = async (
  lessonId,
  user,
) => {
  assertObjectId(lessonId, "Invalid lesson ID.");

  const isStudent =
    user?.roles?.includes("student");

  const filter = {
    lesson: lessonId,
  };

  if (isStudent) {
    filter.status = "published";
  }

  const assignments = await Assignment.find(filter)
    .populate("lesson", "title")
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    success: true,
    message: "Assignments retrieved successfully.",
    data: assignments,
  };
};

// ======================================
// Update Assignment
// ======================================

const updateAssignment = async (
  assignmentId,
  updateData,
  user,
) => {
  assertObjectId(assignmentId, "Invalid assignment ID.");

  if (!updateData || typeof updateData !== "object") {
    throw new Error("Update data is required.");
  }

  const assignment = await Assignment.findById(
    assignmentId,
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const isAdmin =
    user?.roles?.includes("admin");

  const isOwner =
    assignment.createdBy?.toString() ===
    user?._id?.toString();

  if (!isAdmin && !isOwner) {
    throw new Error(
      "You are not authorized to update this assignment.",
    );
  }

  if (assignment.status === "closed") {
    throw new Error(
      "Closed assignments cannot be modified.",
    );
  }

  // ======================================
  // Allowed Update Fields
  // ======================================

  const allowedFields = [
    "title",
    "description",
    "instructions",
    "maxScore",
    "passingScore",
    "dueDate",
    "submissionType",
    "allowedFileTypes",
    "maxFileSize",
    "allowResubmission",
    "attachments",
  ];

  const sanitizedUpdates = {};

  for (const field of allowedFields) {
    if (
      Object.prototype.hasOwnProperty.call(
        updateData,
        field,
      )
    ) {
      sanitizedUpdates[field] =
        updateData[field];
    }
  }

  if (
    Object.keys(sanitizedUpdates).length === 0
  ) {
    throw new Error(
      "No valid assignment fields were provided for update.",
    );
  }

  // ======================================
  // Title
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "title",
    )
  ) {
    sanitizedUpdates.title =
      normalizeString(
        sanitizedUpdates.title,
      );

    if (!sanitizedUpdates.title) {
      throw new Error(
        "Assignment title cannot be empty.",
      );
    }

    if (
      sanitizedUpdates.title.length < 2 ||
      sanitizedUpdates.title.length > 200
    ) {
      throw new Error(
        "Assignment title must be between 2 and 200 characters.",
      );
    }

    const duplicate = await Assignment.exists({
      _id: {
        $ne: assignment._id,
      },
      lesson: assignment.lesson,
      title: sanitizedUpdates.title,
    });

    if (duplicate) {
      throw new Error(
        "An assignment with this title already exists for this lesson.",
      );
    }
  }

  // ======================================
  // Description
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "description",
    )
  ) {
    sanitizedUpdates.description =
      normalizeString(
        sanitizedUpdates.description,
      );

    if (!sanitizedUpdates.description) {
      throw new Error(
        "Assignment description cannot be empty.",
      );
    }
  }

  // ======================================
  // Instructions
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "instructions",
    )
  ) {
    sanitizedUpdates.instructions =
      normalizeString(
        sanitizedUpdates.instructions || "",
      );
  }

  // ======================================
  // Scores
  // ======================================

  const resultingMaxScore =
    sanitizedUpdates.maxScore !== undefined
      ? validateNumber(
          sanitizedUpdates.maxScore,
          "Maximum score",
          {
            min: 1,
            max: 100000,
            required: true,
          },
        )
      : assignment.maxScore;

  const resultingPassingScore =
    sanitizedUpdates.passingScore !== undefined
      ? validateNumber(
          sanitizedUpdates.passingScore,
          "Passing score",
          {
            min: 0,
            max: 100000,
            required: true,
          },
        )
      : assignment.passingScore;

  if (
    resultingPassingScore >
    resultingMaxScore
  ) {
    throw new Error(
      "Passing score cannot exceed maximum score.",
    );
  }

  sanitizedUpdates.maxScore =
    resultingMaxScore;

  sanitizedUpdates.passingScore =
    resultingPassingScore;

  // ======================================
  // Due Date
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "dueDate",
    )
  ) {
    sanitizedUpdates.dueDate =
      validateDate(
        sanitizedUpdates.dueDate,
      );

    if (
      sanitizedUpdates.dueDate &&
      sanitizedUpdates.dueDate <= new Date()
    ) {
      throw new Error(
        "Assignment due date must be in the future.",
      );
    }
  }

  // ======================================
  // Submission Type
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "submissionType",
    )
  ) {
    const allowedTypes = [
      "text",
      "file",
      "github",
      "link",
      "mixed",
    ];

    if (
      !allowedTypes.includes(
        sanitizedUpdates.submissionType,
      )
    ) {
      throw new Error(
        "Invalid submission type.",
      );
    }
  }

  // ======================================
  // File Types
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "allowedFileTypes",
    )
  ) {
    if (
      !Array.isArray(
        sanitizedUpdates.allowedFileTypes,
      )
    ) {
      throw new Error(
        "Allowed file types must be an array.",
      );
    }

    sanitizedUpdates.allowedFileTypes =
      sanitizedUpdates.allowedFileTypes
        .map((type) =>
          String(type)
            .trim()
            .toLowerCase(),
        )
        .filter(Boolean);
  }

  // ======================================
  // File Size
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "maxFileSize",
    )
  ) {
    sanitizedUpdates.maxFileSize =
      validateNumber(
        sanitizedUpdates.maxFileSize,
        "Maximum file size",
        {
          min: 1,
          max: 100 * 1024 * 1024,
        },
      );
  }

  // ======================================
  // Attachments
  // ======================================

  if (
    Object.prototype.hasOwnProperty.call(
      sanitizedUpdates,
      "attachments",
    )
  ) {
    sanitizedUpdates.attachments =
      validateAttachments(
        sanitizedUpdates.attachments,
      );
  }

  Object.assign(
    assignment,
    sanitizedUpdates,
  );

  await assignment.save();

  const updatedAssignment =
    await buildAssignmentResponse(
      assignment._id,
    );

  return {
    success: true,
    message: "Assignment updated successfully.",
    data: updatedAssignment,
  };
};

// ======================================
// Delete Assignment
// ======================================

const deleteAssignment = async (
  assignmentId,
  user,
) => {
  assertObjectId(assignmentId, "Invalid assignment ID.");

  const assignment = await Assignment.findById(
    assignmentId,
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const isAdmin =
    user?.roles?.includes("admin");

  const isOwner =
    assignment.createdBy?.toString() ===
    user?._id?.toString();

  if (!isAdmin && !isOwner) {
    throw new Error(
      "You are not authorized to delete this assignment.",
    );
  }

  if (assignment.status === "published") {
    throw new Error(
      "Published assignments cannot be deleted. Close the assignment instead.",
    );
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

const publishAssignment = async (
  assignmentId,
  user,
) => {
  assertObjectId(assignmentId, "Invalid assignment ID.");

  const assignment = await Assignment.findById(
    assignmentId,
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const isAdmin =
    user?.roles?.includes("admin");

  const isOwner =
    assignment.createdBy?.toString() ===
    user?._id?.toString();

  if (!isAdmin && !isOwner) {
    throw new Error(
      "You are not authorized to publish this assignment.",
    );
  }

  if (assignment.status === "published") {
    throw new Error(
      "Assignment is already published.",
    );
  }

  if (assignment.status === "closed") {
    throw new Error(
      "A closed assignment cannot be published.",
    );
  }

  if (
    assignment.dueDate &&
    assignment.dueDate <= new Date()
  ) {
    throw new Error(
      "Assignment due date must be in the future before publishing.",
    );
  }

  assignment.status = "published";

  await assignment.save();

  const publishedAssignment =
    await buildAssignmentResponse(
      assignment._id,
    );

  return {
    success: true,
    message: "Assignment published successfully.",
    data: publishedAssignment,
  };
};

// ======================================
// Close Assignment
// ======================================

const closeAssignment = async (
  assignmentId,
  user,
) => {
  assertObjectId(assignmentId, "Invalid assignment ID.");

  const assignment = await Assignment.findById(
    assignmentId,
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const isAdmin =
    user?.roles?.includes("admin");

  const isOwner =
    assignment.createdBy?.toString() ===
    user?._id?.toString();

  if (!isAdmin && !isOwner) {
    throw new Error(
      "You are not authorized to close this assignment.",
    );
  }

  if (assignment.status === "closed") {
    throw new Error(
      "Assignment is already closed.",
    );
  }

  assignment.status = "closed";

  await assignment.save();

  const closedAssignment =
    await buildAssignmentResponse(
      assignment._id,
    );

  return {
    success: true,
    message: "Assignment closed successfully.",
    data: closedAssignment,
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
  closeAssignment,
};