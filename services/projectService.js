const Project = require("../models/Project");
const ProjectSubmission = require("../models/ProjectSubmission");
const User = require("../models/User");

// ======================================
// Create Project
// ======================================
const createProject = async (data, clientId) => {
  const {
    title,
    description,
    category,
    assignedTo,
    budget,
    currency,
    deadline,
    descriptionFiles,
  } = data;

  if (!title || !description || budget === undefined) {
    throw new Error("Title, description and budget are required.");
  }

  if (budget < 0) {
    throw new Error("Budget cannot be negative.");
  }

  if (assignedTo) {
    const talent = await User.findById(assignedTo);

    if (!talent) {
      throw new Error("Assigned talent not found.");
    }
  }

  const depositPercentage = 25;
  const depositAmount = (Number(budget) * depositPercentage) / 100;
  const remainingAmount = Number(budget) - depositAmount;

  const project = await Project.create({
    title,
    description,
    category: category || null,
    client: clientId,
    assignedTo: assignedTo || null,
    budget,
    currency: currency || "NGN",
    depositPercentage,
    depositAmount,
    remainingAmount,
    deadline: deadline || null,
    descriptionFiles: descriptionFiles || [],
  });

  await project.populate([
    {
      path: "client",
      select: "firstName lastName email",
    },
    {
      path: "assignedTo",
      select: "firstName lastName email",
    },
    {
      path: "category",
      select: "name",
    },
  ]);

  return {
    success: true,
    message: "Project created successfully.",
    data: project,
  };
};

// ======================================
// Get All Projects
// ======================================
const getAllProjects = async (filters = {}) => {
  const query = {
    isDeleted: false,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters.client) {
    query.client = filters.client;
  }

  const projects = await Project.find(query)
    .populate("client", "firstName lastName email")
    .populate("assignedTo", "firstName lastName email")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Projects retrieved successfully.",
    data: projects,
  };
};

// ======================================
// Get Project By ID
// ======================================
const getProjectById = async (projectId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  })
    .populate("client", "firstName lastName email")
    .populate("assignedTo", "firstName lastName email")
    .populate("category", "name");

  if (!project) {
    throw new Error("Project not found.");
  }

  return {
    success: true,
    message: "Project retrieved successfully.",
    data: project,
  };
};

// ======================================
// Update Project
// ======================================
const updateProject = async (projectId, updateData) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  if (updateData.budget !== undefined) {
    if (updateData.budget < 0) {
      throw new Error("Budget cannot be negative.");
    }

    project.budget = updateData.budget;

    project.depositAmount =
      (Number(updateData.budget) * project.depositPercentage) / 100;

    project.remainingAmount = Number(updateData.budget) - project.depositAmount;
  }

  const allowedFields = [
    "title",
    "description",
    "category",
    "assignedTo",
    "currency",
    "status",
    "paymentStatus",
    "deadline",
    "descriptionFiles",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      project[field] = updateData[field];
    }
  });

  if (project.status === "completed" && !project.completedAt) {
    project.completedAt = new Date();
  }

  await project.save();

  await project.populate([
    {
      path: "client",
      select: "firstName lastName email",
    },
    {
      path: "assignedTo",
      select: "firstName lastName email",
    },
    {
      path: "category",
      select: "name",
    },
  ]);

  return {
    success: true,
    message: "Project updated successfully.",
    data: project,
  };
};

// ======================================
// Delete Project
// ======================================
const deleteProject = async (projectId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  project.isDeleted = true;

  await project.save();

  return {
    success: true,
    message: "Project deleted successfully.",
  };
};

// ======================================
// Assign Project
// ======================================
const assignProject = async (projectId, talentId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const talent = await User.findById(talentId);

  if (!talent) {
    throw new Error("Talent not found.");
  }

  project.assignedTo = talentId;

  if (project.status === "draft") {
    project.status = "pending";
  }

  await project.save();

  return {
    success: true,
    message: "Project assigned successfully.",
    data: project,
  };
};

// ======================================
// Submit Project
// ======================================
const submitProject = async (projectId, submittedBy, submissionData) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  if (!project.assignedTo) {
    throw new Error("No talent has been assigned to this project.");
  }

  if (project.assignedTo.toString() !== submittedBy.toString()) {
    throw new Error("You are not assigned to this project.");
  }

  if (
    !submissionData.message &&
    (!submissionData.files || submissionData.files.length === 0)
  ) {
    throw new Error("Submission must contain a message or files.");
  }

  const submission = await ProjectSubmission.create({
    project: projectId,
    submittedBy,
    message: submissionData.message || "",
    files: submissionData.files || [],
  });

  project.status = "submitted";

  await project.save();

  await submission.populate([
    {
      path: "submittedBy",
      select: "firstName lastName email",
    },
    {
      path: "project",
      select: "title budget currency status",
    },
  ]);

  return {
    success: true,
    message: "Project submitted successfully.",
    data: submission,
  };
};

// ======================================
// Get Project Submissions
// ======================================
const getProjectSubmissions = async (projectId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const submissions = await ProjectSubmission.find({
    project: projectId,
  })
    .populate("submittedBy", "firstName lastName email")
    .populate("reviewedBy", "firstName lastName email")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Project submissions retrieved successfully.",
    data: submissions,
  };
};

// ======================================
// Review Submission
// ======================================
const reviewProjectSubmission = async (
  submissionId,
  reviewerId,
  status,
  feedback = "",
) => {
  const allowedStatuses = ["approved", "revision_requested", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid submission status.");
  }

  const submission = await ProjectSubmission.findById(submissionId);

  if (!submission) {
    throw new Error("Project submission not found.");
  }

  const project = await Project.findById(submission.project);

  if (!project || project.isDeleted) {
    throw new Error("Project not found.");
  }

  submission.status = status;
  submission.feedback = feedback;
  submission.reviewedBy = reviewerId;
  submission.reviewedAt = new Date();

  await submission.save();

  if (status === "approved") {
    project.status = "completed";
    project.completedAt = new Date();
  } else if (status === "revision_requested") {
    project.status = "revision";
  }

  await project.save();

  return {
    success: true,
    message: "Project submission reviewed successfully.",
    data: submission,
  };
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignProject,
  submitProject,
  getProjectSubmissions,
  reviewProjectSubmission,
};
