const mongoose = require("mongoose");

// ======================================
// Constants
// ======================================

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_ICON_LENGTH = 2048;
const MAX_FILENAME_LENGTH = 255;
const MAX_SEO_TITLE_LENGTH = 70;
const MAX_SEO_DESCRIPTION_LENGTH = 160;
const MAX_SORT_ORDER = 100000;

// ======================================
// Image Schema
// ======================================

const categoryImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2048,
    },

    filename: {
      type: String,
      default: "",
      trim: true,
      maxlength: MAX_FILENAME_LENGTH,
    },

    originalName: {
      type: String,
      default: "",
      trim: true,
      maxlength: MAX_FILENAME_LENGTH,
    },
  },
  {
    _id: false,
    strict: true,
  },
);

// ======================================
// SEO Schema
// ======================================

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: MAX_SEO_TITLE_LENGTH,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: MAX_SEO_DESCRIPTION_LENGTH,
    },
  },
  {
    _id: false,
    strict: true,
  },
);

// ======================================
// Category Schema
// ======================================

const categorySchema = new mongoose.Schema(
  {
    // ======================================
    // Basic Information
    // ======================================

    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters."],
      maxlength: [
        MAX_NAME_LENGTH,
        `Category name cannot exceed ${MAX_NAME_LENGTH} characters.`,
      ],
    },

    slug: {
      type: String,
      required: [true, "Category slug is required."],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [2, "Category slug must be at least 2 characters."],
      maxlength: [120, "Category slug cannot exceed 120 characters."],
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        MAX_DESCRIPTION_LENGTH,
        `Category description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`,
      ],
    },

    // ======================================
    // Media
    // ======================================

    icon: {
      type: String,
      default: "",
      trim: true,
      maxlength: MAX_ICON_LENGTH,
    },

    image: {
      type: categoryImageSchema,
      default: () => ({}),
    },

    // ======================================
    // Hierarchy
    // ======================================

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    // ======================================
    // Visibility
    // ======================================

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: [0, "Sort order cannot be negative."],
      max: [
        MAX_SORT_ORDER,
        `Sort order cannot exceed ${MAX_SORT_ORDER}.`,
      ],
      validate: {
        validator: Number.isSafeInteger,
        message: "Sort order must be a valid whole number.",
      },
    },

    // ======================================
    // SEO
    // ======================================

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    // ======================================
    // Audit
    // ======================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Category creator is required."],
      immutable: true,
      index: true,
    },

    // ======================================
    // Soft Delete
    // ======================================

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,

    strict: true,

    minimize: false,

    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ======================================
// Indexes
// ======================================

// Category discovery
categorySchema.index({
  isDeleted: 1,
  isActive: 1,
  sortOrder: 1,
  name: 1,
});

// Parent/child category lookup
categorySchema.index({
  parentCategory: 1,
  isDeleted: 1,
  isActive: 1,
  sortOrder: 1,
});

// Featured categories
categorySchema.index({
  isFeatured: 1,
  isDeleted: 1,
  isActive: 1,
  sortOrder: 1,
});

// Categories created by an administrator
categorySchema.index({
  createdBy: 1,
  createdAt: -1,
});

// Recently created categories
categorySchema.index({
  createdAt: -1,
  isDeleted: 1,
});

// ======================================
// Validation Hooks
// ======================================

categorySchema.pre("validate", function (next) {
  // ======================================
  // Normalize Name
  // ======================================

  if (typeof this.name === "string") {
    this.name = this.name.trim();
  }

  // ======================================
  // Normalize Slug
  // ======================================

  if (typeof this.slug === "string") {
    this.slug = this.slug.trim().toLowerCase();
  }

  // ======================================
  // Normalize Description
  // ======================================

  if (typeof this.description === "string") {
    this.description = this.description.trim();
  }

  // ======================================
  // Normalize Icon
  // ======================================

  if (typeof this.icon === "string") {
    this.icon = this.icon.trim();
  }

  // ======================================
  // Prevent Self Parent
  // ======================================

  if (
    this.parentCategory &&
    this._id &&
    this.parentCategory.toString() === this._id.toString()
  ) {
    return next(
      new Error("A category cannot be its own parent category."),
    );
  }

  // ======================================
  // Deleted State Consistency
  // ======================================

  if (this.isDeleted === true && !this.deletedAt) {
    this.deletedAt = new Date();
  }

  if (this.isDeleted === false) {
    this.deletedAt = null;
  }

  // ======================================
  // Featured State
  // ======================================

  if (this.isDeleted === true) {
    this.isFeatured = false;
  }

  if (this.isActive === false) {
    this.isFeatured = false;
  }

  next();
});

// ======================================
// Prevent Invalid Parent Assignment
// ======================================

categorySchema.pre("save", async function () {
  if (!this.parentCategory) {
    return;
  }

  if (this.parentCategory.toString() === this._id.toString()) {
    throw new Error(
      "A category cannot be its own parent category.",
    );
  }

  const parentExists = await mongoose.model("Category").exists({
    _id: this.parentCategory,
    isDeleted: false,
  });

  if (!parentExists) {
    throw new Error(
      "The selected parent category does not exist or has been deleted.",
    );
  }
});

// ======================================
// Model
// ======================================

module.exports = mongoose.model("Category", categorySchema);