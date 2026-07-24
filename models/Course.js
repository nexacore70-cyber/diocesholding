const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      maxlength: 250,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    trailerVideo: {
      type: String,
      default: "",
    },

    // Ownership
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    },

    // Pricing
    pricing: {
      amount: {
        type: Number,
        default: 0,
      },

      currency: {
        type: String,
        default: "NGN",
      },

      isFree: {
        type: Boolean,
        default: true,
      },

      discountPrice: {
        type: Number,
        default: 0,
      },
    },

    // Course Details
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    language: {
      type: String,
      default: "English",
    },

    duration: {
      type: Number,
      default: 0, // minutes
    },

    certificateAvailable: {
      type: Boolean,
      default: true,
    },

    liveClassEnabled: {
      type: Boolean,
      default: false,
    },

    // Publishing
    status: {
      type: String,
      enum: ["draft", "pending_review", "published", "unpublished", "archived"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // Ratings
    ratings: {
      average: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },
    },

    // Analytics
    analytics: {
      enrolledStudents: {
        type: Number,
        default: 0,
      },

      completedStudents: {
        type: Number,
        default: 0,
      },

      totalViews: {
        type: Number,
        default: 0,
      },
    },

    // SEO & Search
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],

    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],

    // Visibility
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Course", courseSchema);
