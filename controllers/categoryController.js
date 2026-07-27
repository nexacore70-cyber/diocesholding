const {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getFeaturedCategories,
  getParentCategories,
  getCategoryStatistics,
} = require("../services/categoryService");

// ======================================
// Create Category
// ======================================
const createNewCategory = async (req, res) => {
  try {
    const category = await createCategory(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Categories
// ======================================
const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Category By ID
// ======================================
const getSingleCategory = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Category By Slug
// ======================================
const getSingleCategoryBySlug = async (req, res) => {
  try {
    const category = await getCategoryBySlug(req.params.slug);

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Category
// ======================================
const updateExistingCategory = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);

    res.json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Category
// ======================================
const removeCategory = async (req, res) => {
  try {
    await deleteCategory(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Restore Category
// ======================================
const restoreDeletedCategory = async (req, res) => {
  try {
    const category = await restoreCategory(req.params.id);

    res.json({
      success: true,
      message: "Category restored successfully.",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Featured Categories
// ======================================
const getFeaturedCategoryList = async (req, res) => {
  try {
    const categories = await getFeaturedCategories();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Parent Categories
// ======================================
const getParentCategoryList = async (req, res) => {
  try {
    const categories = await getParentCategories();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Category Statistics
// ======================================
const getCategoryAnalytics = async (req, res) => {
  try {
    const statistics = await getCategoryStatistics();

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

console.log({
  createNewCategory: typeof createNewCategory,
  getCategories: typeof getCategories,
  getSingleCategory: typeof getSingleCategory,
  getSingleCategoryBySlug: typeof getSingleCategoryBySlug,
  updateExistingCategory: typeof updateExistingCategory,
  removeCategory: typeof removeCategory,
  restoreDeletedCategory: typeof restoreDeletedCategory,
  getFeaturedCategoryList: typeof getFeaturedCategoryList,
  getParentCategoryList: typeof getParentCategoryList,
  getCategoryAnalytics: typeof getCategoryAnalytics,
});

module.exports = {
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
};
