const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignProject,
  submitProject,
  getProjectSubmissions,
  reviewProjectSubmission,
} = require("../services/projectService");

// ======================================
// Create Project
// POST /api/projects
// Client
// ======================================
const createNewProject = async (req, res) => {
  try {
    const result = await createProject(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Project Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Projects
// GET /api/projects
// Authenticated
// ======================================
const getProjects = async (req, res) => {
  try {
    const result = await getAllProjects(req.query);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Projects Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Project By ID
// GET /api/projects/:id
// Authenticated
// ======================================
const getProject = async (req, res) => {
  try {
    const result = await getProjectById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Project Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Project
// PUT /api/projects/:id
// Client/Admin
// ======================================
const updateExistingProject = async (req, res) => {
  try {
    const result = await updateProject(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Project Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Project
// DELETE /api/projects/:id
// Client/Admin
// ======================================
const deleteExistingProject = async (req, res) => {
  try {
    const result = await deleteProject(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Assign Project
// PATCH /api/projects/:id/assign
// Admin
// ======================================
const assignExistingProject = async (req, res) => {
  try {
    const { talentId } = req.body;

    const result = await assignProject(req.params.id, talentId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Assign Project Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Submit Project
// POST /api/projects/:id/submissions
// Talent
// ======================================
const submitExistingProject = async (req, res) => {
  try {
    const result = await submitProject(req.params.id, req.user._id, req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Submit Project Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Project Submissions
// GET /api/projects/:id/submissions
// Client/Admin
// ======================================
const getSubmissions = async (req, res) => {
  try {
    const result = await getProjectSubmissions(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Project Submissions Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Review Submission
// PATCH /api/projects/submissions/:submissionId/review
// Client/Admin
// ======================================
const reviewSubmission = async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const result = await reviewProjectSubmission(
      req.params.submissionId,
      req.user._id,
      status,
      feedback,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Review Project Submission Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewProject,
  getProjects,
  getProject,
  updateExistingProject,
  deleteExistingProject,
  assignExistingProject,
  submitExistingProject,
  getSubmissions,
  reviewSubmission,
};
