const mongoose = require("mongoose");

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
// Helpers
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const handleControllerError = (res, error, fallbackMessage) => {
  console.error("Category Controller Error:", error);

  if (error.name === "ValidationError") {
    const message =
      Object.values(error.errors)[0]?.message || "Invalid request data.";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid identifier.",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Category already exists.",
    });
  }

  if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================
// Create Category
// ======================================

const createNewCategory = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const category = await createCategory(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to create category.");
  }
};

// ======================================
// Get All Categories
// ======================================

const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch categories.");
  }
};

// ======================================
// Get Category By ID
// ======================================

const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category identifier.",
      });
    }

    const category = await getCategoryById(id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch category.");
  }
};

// ======================================
// Get Category By Slug
// ======================================

const getSingleCategoryBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "")
      .trim()
      .toLowerCase();

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Category slug is required.",
      });
    }

    const category = await getCategoryBySlug(slug);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to fetch category.");
  }
};

// ======================================
// Update Category
// ======================================

const updateExistingCategory = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category identifier.",
      });
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category data.",
      });
    }

    const category = await updateCategory(id, req.body, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to update category.");
  }
};

// ======================================
// Delete Category
// ======================================

const removeCategory = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category identifier.",
      });
    }

    await deleteCategory(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to delete category.");
  }
};

// ======================================
// Restore Category
// ======================================

const restoreDeletedCategory = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category identifier.",
      });
    }

    const category = await restoreCategory(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Category restored successfully.",
      data: category,
    });
  } catch (error) {
    return handleControllerError(res, error, "Unable to restore category.");
  }
};

// ======================================
// Featured Categories
// ======================================

const getFeaturedCategoryList = async (req, res) => {
  try {
    const categories = await getFeaturedCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch featured categories.",
    );
  }
};

// ======================================
// Parent Categories
// ======================================

const getParentCategoryList = async (req, res) => {
  try {
    const categories = await getParentCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch parent categories.",
    );
  }
};

// ======================================
// Category Statistics
// ======================================

const getCategoryAnalytics = async (req, res) => {
  try {
    const statistics = await getCategoryStatistics();

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Unable to fetch category statistics.",
    );
  }
};

// ======================================
// Export
// ======================================

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
