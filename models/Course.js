const mongoose = require("mongoose");

// ======================================
// Constants
// ======================================

const COURSE_STATUSES = [
  "draft",
  "pending_review",
  "published",
  "unpublished",
  "archived",
];

const COURSE_DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const DEFAULT_CURRENCY = "NGN";

// ======================================
// Thumbnail Schema
// ======================================

const thumbnailSchema = new mongoose.Schema(
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
      maxlength: 255,
    },

    originalName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 255,
    },
  },
  {
    _id: false,
  },
);

// ======================================
// Pricing Schema
// ======================================

const pricingSchema = new mongoose.Schema(
  {
    // Store monetary values in the smallest
    // currency unit (kobo for NGN).
    amount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Course amount must be a valid integer.",
      },
    },

    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
      uppercase: true,
      trim: true,
      enum: ["NGN"],
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Discount price must be a valid integer.",
      },
    },
  },
  {
    _id: false,
  },
);

// ======================================
// Course Schema
// ======================================

const courseSchema = new mongoose.Schema(
  {
    // ======================================
    // Basic Information
    // ======================================

    title: {
      type: String,
      required: [true, "Course title is required."],
      trim: true,
      minlength: [3, "Course title must be at least 3 characters."],
      maxlength: [200, "Course title cannot exceed 200 characters."],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 220,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Course description is required."],
      trim: true,
      minlength: [20, "Course description must be at least 20 characters."],
      maxlength: [20000, "Course description cannot exceed 20,000 characters."],
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: [250, "Short description cannot exceed 250 characters."],
    },

    // ======================================
    // Media
    // ======================================

    thumbnail: {
      type: thumbnailSchema,
      default: () => ({}),
    },

    banner: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2048,
    },

    trailerVideo: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2048,
    },

    // ======================================
    // Ownership
    // ======================================

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course tutor is required."],
      index: true,
    },

    coTutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    // ======================================
    // Pricing
    // ======================================

    pricing: {
      type: pricingSchema,
      default: () => ({}),
    },

    // ======================================
    // Course Details
    // ======================================

    difficulty: {
      type: String,
      enum: COURSE_DIFFICULTIES,
      default: "beginner",
      lowercase: true,
      trim: true,
    },

    language: {
      type: String,
      default: "English",
      trim: true,
      maxlength: 50,
    },

    // Duration in minutes
    duration: {
      type: Number,
      default: 0,
      min: [0, "Course duration cannot be negative."],
      max: [100000, "Course duration is too large."],
      validate: {
        validator: Number.isInteger,
        message: "Course duration must be a whole number.",
      },
    },

    certificateAvailable: {
      type: Boolean,
      default: true,
    },

    liveClassEnabled: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Publishing
    // ======================================

    status: {
      type: String,
      enum: COURSE_STATUSES,
      default: "draft",
      lowercase: true,
      trim: true,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Ratings
    // ======================================

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      total: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: "Rating total must be a whole number.",
        },
      },
    },

    // ======================================
    // Analytics
    // ======================================

    analytics: {
      enrolledStudents: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: "Enrolled students must be a whole number.",
        },
      },

      completedStudents: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: "Completed students must be a whole number.",
        },
      },

      totalViews: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: "Total views must be a whole number.",
        },
      },
    },

    // ======================================
    // SEO / Search
    // ======================================

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    learningOutcomes: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    targetAudience: [
      {
        type: String,
        trim: true,
        maxlength: 300,
      },
    ],

    // ======================================
    // Visibility
    // ======================================

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

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

  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  },
}
);

// ======================================
// Indexes
// ======================================

// Public course discovery
courseSchema.index({
  status: 1,
  isDeleted: 1,
  createdAt: -1,
});

// Tutor dashboard
courseSchema.index({
  tutor: 1,
  isDeleted: 1,
  createdAt: -1,
});

// Category filtering
courseSchema.index({
  category: 1,
  status: 1,
  isDeleted: 1,
});

// Featured courses
courseSchema.index({
  isFeatured: 1,
  status: 1,
  isDeleted: 1,
});

// Published courses
courseSchema.index({
  status: 1,
  publishedAt: -1,
  isDeleted: 1,
});

// ======================================
// Validation / Consistency Hooks
// ======================================

courseSchema.pre("validate", function (next) {
  // ======================================
  // Pricing Consistency
  // ======================================

  if (this.pricing) {
    const { amount = 0, discountPrice = 0, isFree } = this.pricing;

    if (isFree === true) {
      this.pricing.amount = 0;
      this.pricing.discountPrice = 0;
    } else {
      if (amount <= 0) {
        return next(
          new Error("Paid courses must have an amount greater than zero."),
        );
      }

      if (discountPrice > amount) {
        return next(
          new Error("Discount price cannot be greater than course price."),
        );
      }
    }
  }

  // ======================================
  // Publishing Consistency
  // ======================================

  if (this.status === "published") {
    if (!this.publishedAt) {
      this.publishedAt = new Date();
    }
  }

  // ======================================
  // Non-Published Courses
  // ======================================

  if (this.status !== "published") {
    this.publishedAt = null;
  }

  // ======================================
  // Student Analytics Consistency
  // ======================================

  if (this.analytics.completedStudents > this.analytics.enrolledStudents) {
    return next(
      new Error("Completed students cannot exceed enrolled students."),
    );
  }

  // ======================================
  // Remove Duplicate Co-Tutors
  // ======================================

  if (Array.isArray(this.coTutors)) {
    const uniqueCoTutors = [
      ...new Set(this.coTutors.map((id) => id.toString())),
    ];

    this.coTutors = uniqueCoTutors;
  }

  // ======================================
  // Remove Duplicate Tags
  // ======================================

  if (Array.isArray(this.tags)) {
    this.tags = [
      ...new Set(
        this.tags
          .filter(Boolean)
          .map((tag) => String(tag).trim().toLowerCase()),
      ),
    ];
  }

  return next();
});

// ======================================
// Prevent Tutor From Being A Co-Tutor
// ======================================

courseSchema.pre("validate", function (next) {
  if (
    this.tutor &&
    Array.isArray(this.coTutors) &&
    this.coTutors.some(
      (coTutor) => coTutor.toString() === this.tutor.toString(),
    )
  ) {
    return next(
      new Error("The course tutor cannot also be listed as a co-tutor."),
    );
  }

  next();
});

// ======================================
// Model
// ======================================

module.exports = mongoose.model("Course", courseSchema);
