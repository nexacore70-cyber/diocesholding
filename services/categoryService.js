const Category = require("../models/Category");
const Course = require("../models/Course");
const generateSlug = require("../utils/generateSlug");

// ======================================
// Create Category
// ======================================
const createCategory = async (categoryData, adminId) => {
  const { name } = categoryData;

  const existingCategory = await Category.findOne({
    name: name.trim(),
    isDeleted: false,
  });

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  const slug = generateSlug(name);

  const existingSlug = await Category.findOne({
    slug,
    isDeleted: false,
  });

  if (existingSlug) {
    throw new Error("Category slug already exists.");
  }

  const category = await Category.create({
    ...categoryData,

    image: {
      url: categoryData.image?.url || "",
      filename: categoryData.image?.filename || "",
      originalName: categoryData.image?.originalName || "",
    },

    slug,
    createdBy: adminId,
  });

  return category;
};

// ======================================
// Get All Categories
// ======================================
const getAllCategories = async () => {
  return Category.find({
    isDeleted: false,
  })
    .populate("parentCategory", "name slug")
    .sort({
      sortOrder: 1,
      name: 1,
    });
};

// ======================================
// Get Category By ID
// ======================================
const getCategoryById = async (categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  }).populate("parentCategory", "name slug");

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
};

// ======================================
// Get Category By Slug
// ======================================
const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({
    slug,
    isDeleted: false,
  }).populate("parentCategory", "name slug");

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
};

// ======================================
// Update Category
// ======================================
const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (updateData.name) {
    category.slug = generateSlug(updateData.name);
  }

  // Update image only if supplied
  if (updateData.image) {
    category.image = {
      url: updateData.image.url || "",
      filename: updateData.image.filename || "",
      originalName: updateData.image.originalName || "",
    };
  }

  Object.assign(category, {
    ...updateData,
    image: category.image,
  });

  await category.save();

  return category;
};

// ======================================
// Delete Category (Soft Delete)
// ======================================
const deleteCategory = async (categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  category.isDeleted = true;

  await category.save();

  return category;
};

// ======================================
// Restore Category
// ======================================
const restoreCategory = async (categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: true,
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  category.isDeleted = false;

  await category.save();

  return category;
};

// ======================================
// Get Featured Categories
// ======================================
const getFeaturedCategories = async () => {
  return Category.find({
    isFeatured: true,
    isDeleted: false,
    isActive: true,
  }).sort({
    sortOrder: 1,
  });
};

// ======================================
// Get Parent Categories
// ======================================
const getParentCategories = async () => {
  return Category.find({
    parentCategory: null,
    isDeleted: false,
    isActive: true,
  }).sort({
    sortOrder: 1,
  });
};

// ======================================
// Get Category Statistics
// ======================================
const getCategoryStatistics = async () => {
  const categories = await Category.find({
    isDeleted: false,
  });

  const statistics = await Promise.all(
    categories.map(async (category) => {
      const totalCourses = await Course.countDocuments({
        category: category._id,
      });

      return {
        categoryId: category._id,
        categoryName: category.name,
        totalCourses,
        isFeatured: category.isFeatured,
        isActive: category.isActive,
      };
    }),
  );

  return statistics;
};

module.exports = {
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
};
