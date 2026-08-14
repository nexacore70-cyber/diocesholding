const mongoose = require("mongoose");

const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const generateSlug = require("../utils/generateSlug");

// ======================================
// Constants
// ======================================

const ALLOWED_UPDATE_FIELDS = [
  "name",
  "description",
  "icon",
  "image",
  "parentCategory",
  "isFeatured",
  "isActive",
  "sortOrder",
  "seo",
];

const MAX_HIERARCHY_DEPTH = 10;

// ======================================
// Helpers
// ======================================

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const normalizeSlug = (value) => {
  return normalizeString(value).toLowerCase();
};

const normalizeBoolean = (value, fieldName) => {
  if (typeof value !== "boolean") {
    throw createServiceError(`${fieldName} must be a boolean.`, 400);
  }

  return value;
};

const normalizeImage = (image) => {
  if (!image || typeof image !== "object" || Array.isArray(image)) {
    throw createServiceError("Invalid category image data.", 400);
  }

  return {
    url: normalizeString(image.url),
    filename: normalizeString(image.filename),
    originalName: normalizeString(image.originalName),
  };
};

const normalizeSEO = (seo) => {
  if (!seo || typeof seo !== "object" || Array.isArray(seo)) {
    throw createServiceError("Invalid SEO data.", 400);
  }

  return {
    metaTitle: normalizeString(seo.metaTitle),
    metaDescription: normalizeString(seo.metaDescription),
  };
};

const escapeRegex = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ======================================
// Validate Admin
// ======================================

const validateAdmin = async (adminId) => {
  if (!isValidObjectId(adminId)) {
    throw createServiceError(
      "Invalid administrator identifier.",
      400,
    );
  }

  const admin = await User.findOne({
    _id: adminId,
    deletedAt: null,
    status: "active",
    isActive: true,
  })
    .select("_id roles")
    .lean();

  if (!admin) {
    throw createServiceError(
      "Administrator account not found.",
      404,
    );
  }

  const roles = Array.isArray(admin.roles)
    ? admin.roles.map((role) =>
      String(role).trim().toLowerCase(),
    )
    : [];

  if (!roles.includes("admin")) {
    throw createServiceError(
      "Only administrators can manage categories.",
      403,
    );
  }

  return admin;
};

// ======================================
// Generate Unique Slug
// ======================================

const generateUniqueSlug = async (
  name,
  excludeCategoryId = null,
) => {
  const baseSlug = generateSlug(name);

  if (!baseSlug) {
    throw createServiceError(
      "Category name cannot produce a valid URL slug.",
      400,
    );
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      slug,
    };

    if (excludeCategoryId) {
      query._id = {
        $ne: excludeCategoryId,
      };
    }

    const existingCategory = await Category.findOne(query)
      .select("_id")
      .lean();

    if (!existingCategory) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// ======================================
// Validate Parent Category
// ======================================

const validateParentCategory = async (
  parentCategoryId,
  currentCategoryId = null,
) => {
  if (
    parentCategoryId === null ||
    parentCategoryId === undefined ||
    parentCategoryId === ""
  ) {
    return null;
  }

  if (!isValidObjectId(parentCategoryId)) {
    throw createServiceError(
      "Invalid parent category identifier.",
      400,
    );
  }

  if (
    currentCategoryId &&
    String(parentCategoryId) === String(currentCategoryId)
  ) {
    throw createServiceError(
      "A category cannot be its own parent.",
      400,
    );
  }

  const parent = await Category.findOne({
    _id: parentCategoryId,
    isDeleted: false,
    isActive: true,
  })
    .select("_id parentCategory")
    .lean();

  if (!parent) {
    throw createServiceError(
      "Parent category not found or inactive.",
      404,
    );
  }

  // ======================================
  // Prevent Circular Hierarchy
  // ======================================

  let currentParentId = parent.parentCategory;
  let depth = 1;

  while (currentParentId) {
    if (
      currentCategoryId &&
      String(currentParentId) === String(currentCategoryId)
    ) {
      throw createServiceError(
        "This parent category would create a circular hierarchy.",
        400,
      );
    }

    if (depth >= MAX_HIERARCHY_DEPTH) {
      throw createServiceError(
        "Category hierarchy is too deep.",
        400,
      );
    }

    const ancestor = await Category.findById(currentParentId)
      .select("_id parentCategory")
      .lean();

    if (!ancestor) {
      break;
    }

    currentParentId = ancestor.parentCategory;
    depth++;
  }

  return parent;
};

// ======================================
// Create Category
// ======================================

const createCategory = async (categoryData, adminId) => {
  if (
    !categoryData ||
    typeof categoryData !== "object" ||
    Array.isArray(categoryData)
  ) {
    throw createServiceError(
      "Invalid category data.",
      400,
    );
  }

  await validateAdmin(adminId);

  const name = normalizeString(categoryData.name);

  if (!name) {
    throw createServiceError(
      "Category name is required.",
      400,
    );
  }

  // ======================================
  // Prevent Duplicate Names
  // ======================================

  const existingName = await Category.findOne({
    name: {
      $regex: `^${escapeRegex(name)}$`,
      $options: "i",
    },
    isDeleted: false,
  })
    .select("_id")
    .lean();

  if (existingName) {
    throw createServiceError(
      "Category already exists.",
      409,
    );
  }

  // ======================================
  // Generate Slug
  // ======================================

  const slug = await generateUniqueSlug(name);

  // ======================================
  // Validate Parent
  // ======================================

  const parentCategory = await validateParentCategory(
    categoryData.parentCategory,
  );

  // ======================================
  // Validate Sort Order
  // ======================================

  let sortOrder = 0;

  if (categoryData.sortOrder !== undefined) {
    if (
      !Number.isInteger(categoryData.sortOrder) ||
      categoryData.sortOrder < 0
    ) {
      throw createServiceError(
        "Sort order must be a non-negative integer.",
        400,
      );
    }

    sortOrder = categoryData.sortOrder;
  }

  // ======================================
  // Validate Booleans
  // ======================================

  let isFeatured = false;
  let isActive = true;

  if (categoryData.isFeatured !== undefined) {
    isFeatured = normalizeBoolean(
      categoryData.isFeatured,
      "isFeatured",
    );
  }

  if (categoryData.isActive !== undefined) {
    isActive = normalizeBoolean(
      categoryData.isActive,
      "isActive",
    );
  }

  // ======================================
  // Create
  // ======================================

  const category = await Category.create({
    name,

    slug,

    description: normalizeString(
      categoryData.description,
    ),

    icon: normalizeString(categoryData.icon),

    image: categoryData.image
      ? normalizeImage(categoryData.image)
      : {},

    parentCategory: parentCategory
      ? parentCategory._id
      : null,

    isFeatured,

    isActive,

    sortOrder,

    seo: categoryData.seo
      ? normalizeSEO(categoryData.seo)
      : {},

    createdBy: adminId,

    isDeleted: false,

    deletedAt: null,
  });

  return category;
};

// ======================================
// Get All Categories
// ======================================

const getAllCategories = async () => {
  return Category.find({
    isDeleted: false,
    isActive: true,
  })
    .populate(
      "parentCategory",
      "name slug",
    )
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

// ======================================
// Get Category By ID
// ======================================

const getCategoryById = async (categoryId) => {
  if (!isValidObjectId(categoryId)) {
    throw createServiceError(
      "Invalid category identifier.",
      400,
    );
  }

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  })
    .populate(
      "parentCategory",
      "name slug",
    )
    .lean();

  if (!category) {
    throw createServiceError(
      "Category not found.",
      404,
    );
  }

  return category;
};

// ======================================
// Get Category By Slug
// ======================================

const getCategoryBySlug = async (slug) => {
  slug = normalizeSlug(slug);

  if (!slug) {
    throw createServiceError(
      "Category slug is required.",
      400,
    );
  }

  const category = await Category.findOne({
    slug,
    isDeleted: false,
  })
    .populate(
      "parentCategory",
      "name slug",
    )
    .lean();

  if (!category) {
    throw createServiceError(
      "Category not found.",
      404,
    );
  }

  return category;
};

// ======================================
// Update Category
// ======================================

const updateCategory = async (
  categoryId,
  updateData,
  adminId,
) => {
  if (!isValidObjectId(categoryId)) {
    throw createServiceError(
      "Invalid category identifier.",
      400,
    );
  }

  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    throw createServiceError(
      "Invalid category data.",
      400,
    );
  }

  await validateAdmin(adminId);

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw createServiceError(
      "Category not found.",
      404,
    );
  }

  const safeUpdates = {};

  // ======================================
  // Whitelist Fields
  // ======================================

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(
        updateData,
        field,
      )
    ) {
      safeUpdates[field] = updateData[field];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    throw createServiceError(
      "No valid category fields were provided.",
      400,
    );
  }

  // ======================================
  // Name
  // ======================================

  if (safeUpdates.name !== undefined) {
    const name = normalizeString(
      safeUpdates.name,
    );

    if (!name) {
      throw createServiceError(
        "Category name cannot be empty.",
        400,
      );
    }

    if (
      name.toLowerCase() !==
      category.name.toLowerCase()
    ) {
      const existing = await Category.findOne({
        name: {
          $regex: `^${escapeRegex(name)}$`,
          $options: "i",
        },
        isDeleted: false,
        _id: {
          $ne: categoryId,
        },
      })
        .select("_id")
        .lean();

      if (existing) {
        throw createServiceError(
          "Category name already exists.",
          409,
        );
      }

      safeUpdates.slug =
        await generateUniqueSlug(
          name,
          categoryId,
        );
    }

    safeUpdates.name = name;
  }

  // ======================================
  // Description
  // ======================================

  if (
    safeUpdates.description !== undefined
  ) {
    safeUpdates.description =
      normalizeString(
        safeUpdates.description,
      );
  }

  // ======================================
  // Icon
  // ======================================

  if (safeUpdates.icon !== undefined) {
    safeUpdates.icon = normalizeString(
      safeUpdates.icon,
    );
  }

  // ======================================
  // Image
  // ======================================

  if (safeUpdates.image !== undefined) {
    safeUpdates.image =
      normalizeImage(
        safeUpdates.image,
      );
  }

  // ======================================
  // Parent Category
  // ======================================

  if (
    safeUpdates.parentCategory !==
    undefined
  ) {
    const parentCategory =
      await validateParentCategory(
        safeUpdates.parentCategory,
        categoryId,
      );

    safeUpdates.parentCategory =
      parentCategory
        ? parentCategory._id
        : null;
  }

  // ======================================
  // Featured
  // ======================================

  if (
    safeUpdates.isFeatured !== undefined
  ) {
    safeUpdates.isFeatured =
      normalizeBoolean(
        safeUpdates.isFeatured,
        "isFeatured",
      );
  }

  // ======================================
  // Active
  // ======================================

  if (
    safeUpdates.isActive !== undefined
  ) {
    safeUpdates.isActive =
      normalizeBoolean(
        safeUpdates.isActive,
        "isActive",
      );
  }

  // ======================================
  // Sort Order
  // ======================================

  if (
    safeUpdates.sortOrder !== undefined
  ) {
    if (
      !Number.isInteger(
        safeUpdates.sortOrder,
      ) ||
      safeUpdates.sortOrder < 0
    ) {
      throw createServiceError(
        "Sort order must be a non-negative integer.",
        400,
      );
    }
  }

  // ======================================
  // SEO
  // ======================================

  if (safeUpdates.seo !== undefined) {
    safeUpdates.seo =
      normalizeSEO(
        safeUpdates.seo,
      );
  }

  // ======================================
  // Save
  // ======================================

  Object.assign(
    category,
    safeUpdates,
  );

  await category.save();

  return category;
};

// ======================================
// Delete Category
// ======================================

const deleteCategory = async (
  categoryId,
  adminId,
) => {
  if (!isValidObjectId(categoryId)) {
    throw createServiceError(
      "Invalid category identifier.",
      400,
    );
  }

  await validateAdmin(adminId);

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw createServiceError(
      "Category not found.",
      404,
    );
  }

  // ======================================
  // Prevent Delete If Courses Exist
  // ======================================

  const courseExists =
    await Course.exists({
      category: category._id,
      isDeleted: false,
    });

  if (courseExists) {
    throw createServiceError(
      "Category cannot be deleted while courses are assigned to it.",
      409,
    );
  }

  // ======================================
  // Prevent Delete If Children Exist
  // ======================================

  const childExists =
    await Category.exists({
      parentCategory: category._id,
      isDeleted: false,
    });

  if (childExists) {
    throw createServiceError(
      "Category cannot be deleted while it has active child categories.",
      409,
    );
  }

  // ======================================
  // Soft Delete
  // ======================================

  category.isDeleted = true;
  category.deletedAt = new Date();
  category.isActive = false;
  category.isFeatured = false;

  await category.save();

  return category;
};

// ======================================
// Restore Category
// ======================================

const restoreCategory = async (
  categoryId,
  adminId,
) => {
  if (!isValidObjectId(categoryId)) {
    throw createServiceError(
      "Invalid category identifier.",
      400,
    );
  }

  await validateAdmin(adminId);

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: true,
  });

  if (!category) {
    throw createServiceError(
      "Deleted category not found.",
      404,
    );
  }

  // ======================================
  // Validate Previous Parent
  // ======================================

  if (category.parentCategory) {
    const parent = await Category.findOne({
      _id: category.parentCategory,
      isDeleted: false,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!parent) {
      category.parentCategory = null;
    }
  }

  // ======================================
  // Restore
  // ======================================

  category.isDeleted = false;
  category.deletedAt = null;
  category.isActive = true;

  await category.save();

  return category;
};

// ======================================
// Featured Categories
// ======================================

const getFeaturedCategories = async () => {
  return Category.find({
    isFeatured: true,
    isDeleted: false,
    isActive: true,
  })
    .populate(
      "parentCategory",
      "name slug",
    )
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

// ======================================
// Parent Categories
// ======================================

const getParentCategories = async () => {
  return Category.find({
    parentCategory: null,
    isDeleted: false,
    isActive: true,
  })
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

// ======================================
// Category Statistics
// ======================================

const getCategoryStatistics = async () => {
  return Category.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },

    {
      $lookup: {
        from: "courses",

        let: {
          categoryId: "$_id",
        },

        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$category",
                      "$$categoryId",
                    ],
                  },

                  {
                    $eq: [
                      "$isDeleted",
                      false,
                    ],
                  },
                ],
              },
            },
          },

          {
            $count: "count",
          },
        ],

        as: "courseStats",
      },
    },

    {
      $project: {
        _id: 0,

        categoryId: "$_id",

        categoryName: "$name",

        totalCourses: {
          $ifNull: [
            {
              $arrayElemAt: [
                "$courseStats.count",
                0,
              ],
            },
            0,
          ],
        },

        isFeatured: 1,

        isActive: 1,
      },
    },

    {
      $sort: {
        categoryName: 1,
      },
    },
  ]);
};

// ======================================
// Export
// ======================================

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