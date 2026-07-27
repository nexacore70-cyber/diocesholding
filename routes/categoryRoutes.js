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

const {protect} = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

console.log("createNewCategory:", typeof createNewCategory);
console.log("getCategories:", typeof getCategories);

const adminOnly = authorize("admin");

console.log("adminOnly:", typeof adminOnly);

// ======================================
// Category CRUD
// ======================================

// Create Category
router.post(
  "/",
  protect,
  adminOnly,
  createNewCategory,
);

// Get All Categories
router.get("/", getCategories);

// Get Featured Categories
router.get("/featured", getFeaturedCategoryList);

// Get Parent Categories
router.get("/parents", getParentCategoryList);

// Category Statistics
router.get(
  "/statistics",
  protect,
  authorize("admin"),
  getCategoryAnalytics,
);

// Get Category By Slug
router.get("/slug/:slug", getSingleCategoryBySlug);

// Get Category By ID
router.get("/:id", getSingleCategory);

// Update Category
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateExistingCategory,
);

// Soft Delete Category
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  removeCategory,
);

// Restore Category
router.patch(
  "/restore/:id",
  protect,
  authorize("admin"),
  restoreDeletedCategory,
);

module.exports = router;