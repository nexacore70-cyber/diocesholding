const express = require("express");

const {
  createNewCategory,
  getCategories,
  getSingleCategory,
  getSingleCategoryBySlug,
  updateExistingCategory,
  removeCategory,
  restoreDeletedCategory,
  getFeaturedCategoryList,
  getParentCategoryList,
  getCategoryAnalytics,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Authorization
// ======================================

const adminOnly = authorize("admin");

// ======================================
// Public Routes
// ======================================

// Get all active categories
router.get("/", getCategories);

// Get featured categories
router.get("/featured", getFeaturedCategoryList);

// Get parent categories
router.get("/parents", getParentCategoryList);

// Get category by slug
router.get("/slug/:slug", getSingleCategoryBySlug);

// ======================================
// Protected Admin Routes
// ======================================

// Category statistics
router.get(
  "/statistics",
  protect,
  adminOnly,
  getCategoryAnalytics,
);

// ======================================
// Dynamic Public Route
// ======================================

// Get category by ID
router.get("/:id", getSingleCategory);

// ======================================
// Protected Admin CRUD Routes
// ======================================

// Create category
router.post(
  "/",
  protect,
  adminOnly,
  createNewCategory,
);

// Update category
router.put(
  "/:id",
  protect,
  adminOnly,
  updateExistingCategory,
);

// Soft delete category
router.delete(
  "/:id",
  protect,
  adminOnly,
  removeCategory,
);

// Restore category
router.patch(
  "/restore/:id",
  protect,
  adminOnly,
  restoreDeletedCategory,
);

module.exports = router;