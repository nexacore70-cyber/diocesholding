const express = require("express");
const router = express.Router();

const {
  createNewModule,
  getModules,
  getModule,
  updateExistingModule,
  deleteExistingModule,
  restoreDeletedModule,
} = require("../controllers/moduleController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Module routes are working.",
  });
});

// ======================================
// Public Routes
// ======================================

// Get All Modules
router.get("/", getModules);

// Get Single Module
router.get("/:id", getModule);

// ======================================
// Protected Routes
// ======================================

// Create Module
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewModule,
);

// Update Module
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingModule,
);

// Soft Delete Module
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteExistingModule,
);

// Restore Module
router.patch(
  "/restore/:id",
  protect,
  authorize("admin"),
  restoreDeletedModule,
);

module.exports = router;