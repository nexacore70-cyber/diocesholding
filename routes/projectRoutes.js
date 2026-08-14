const express = require("express");

const router = express.Router();

const {
  createNewProject,
  getProjects,
  getProject,
  updateExistingProject,
  deleteExistingProject,
  assignExistingProject,
  submitExistingProject,
  getSubmissions,
  reviewSubmission,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Project routes are working.",
  });
});

// ======================================
// Authenticated Users
// ======================================

// Get All Projects
router.get("/", protect, getProjects);

// Get Single Project
router.get("/:id", protect, getProject);

// ======================================
// Client / Admin
// ======================================

// Create Project
router.post(
  "/",
  protect,
  authorize("client", "admin"),
  createNewProject,
);

// Update Project
router.put(
  "/:id",
  protect,
  authorize("client", "admin"),
  updateExistingProject,
);

// Delete Project
router.delete(
  "/:id",
  protect,
  authorize("client", "admin"),
  deleteExistingProject,
);

// ======================================
// Admin
// ======================================

// Assign Project
router.patch(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignExistingProject,
);

// ======================================
// Talent
// ======================================

// Submit Project
router.post(
  "/:id/submissions",
  protect,
  authorize("talent"),
  submitExistingProject,
);

// ======================================
// Client / Admin
// ======================================

// Get Project Submissions
router.get(
  "/:id/submissions",
  protect,
  authorize("client", "admin"),
  getSubmissions,
);

// Review Submission
router.patch(
  "/submissions/:submissionId/review",
  protect,
  authorize("client", "admin"),
  reviewSubmission,
);

module.exports = router;