const express = require("express");
const router = express.Router();

const {
  createNewModule,
  getModules,
  getModule,
  updateExistingModule,
  deleteExistingModule,
} = require("../controllers/moduleController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Module routes are working.",
  });
});

// Get All Modules
router.get("/", getModules);

// Get Single Module
router.get("/:id", getModule);

// Update Module
router.put(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  updateExistingModule
);

// Delete Module
router.delete(
  "/:id",
  protect,
  authorize("tutor", "admin"),
  deleteExistingModule
);

// Create Module
router.post(
  "/",
  protect,
  authorize("tutor", "admin"),
  createNewModule
);

module.exports = router;