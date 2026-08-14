const Joi = require("joi");
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

const MAX_ARRAY_ITEMS = 50;
const MAX_TAG_LENGTH = 50;
const MAX_REQUIREMENT_LENGTH = 500;
const MAX_OUTCOME_LENGTH = 500;
const MAX_AUDIENCE_LENGTH = 300;

// ======================================
// Helpers
// ======================================

const objectId = Joi.string()
  .trim()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }

    return value;
  })
  .messages({
    "any.invalid": "Invalid identifier.",
    "string.empty": "Identifier cannot be empty.",
  });

const safeUrl = Joi.string()
  .trim()
  .max(2048)
  .uri({
    scheme: ["http", "https"],
  })
  .messages({
    "string.uri": "Please provide a valid HTTP or HTTPS URL.",
  });

// ======================================
// Thumbnail
// ======================================

const thumbnailSchema = Joi.object({
  url: safeUrl.allow(""),
  filename: Joi.string().trim().max(255).allow(""),

  originalName: Joi.string().trim().max(255).allow(""),
})
  .max(3)
  .messages({
    "object.unknown": "Invalid thumbnail field.",
  });

// ======================================
// Pricing
// ======================================

const pricingSchema = Joi.object({
  amount: Joi.number().integer().min(0).max(Number.MAX_SAFE_INTEGER).required(),

  currency: Joi.string().trim().uppercase().valid("NGN").required(),

  isFree: Joi.boolean().required(),

  discountPrice: Joi.number()
    .integer()
    .min(0)
    .max(Number.MAX_SAFE_INTEGER)
    .required(),
})
  .custom((pricing, helpers) => {
    if (pricing.isFree) {
      if (pricing.amount !== 0 || pricing.discountPrice !== 0) {
        return helpers.error("pricing.free");
      }
    }

    if (!pricing.isFree && pricing.amount <= 0) {
      return helpers.error("pricing.amount");
    }

    if (pricing.discountPrice > pricing.amount) {
      return helpers.error("pricing.discount");
    }

    return pricing;
  })
  .messages({
    "pricing.free":
      "Free courses must have zero amount and zero discount price.",

    "pricing.amount": "Paid courses must have an amount greater than zero.",

    "pricing.discount": "Discount price cannot be greater than course price.",
  });

// ======================================
// String Arrays
// ======================================

const stringArray = (maxLength, itemName) =>
  Joi.array()
    .items(
      Joi.string()
        .trim()
        .min(1)
        .max(maxLength)
        .messages({
          "string.empty": `${itemName} cannot be empty.`,
          "string.max": `${itemName} cannot exceed ${maxLength} characters.`,
        }),
    )
    .max(MAX_ARRAY_ITEMS)
    .unique()
    .default([]);

// ======================================
// Create Course Schema
// ======================================
//
// Deliberately does NOT accept:
//
// - tutor
// - slug
// - isDeleted
// - deletedAt
// - publishedAt
// - analytics
// - ratings
//
// Those fields must never be controlled directly
// by the client.
//

const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  description: Joi.string().trim().min(20).max(20000).required(),

  shortDescription: Joi.string().trim().max(250).allow("").default(""),

  thumbnail: thumbnailSchema.default({}),

  banner: safeUrl.allow("").default(""),

  trailerVideo: safeUrl.allow("").default(""),

  coTutors: Joi.array()
    .items(objectId)
    .max(MAX_ARRAY_ITEMS)
    .unique()
    .default([]),

  category: objectId.allow(null).default(null),

  pricing: pricingSchema.default({
    amount: 0,
    currency: "NGN",
    isFree: true,
    discountPrice: 0,
  }),

  difficulty: Joi.string()
    .trim()
    .lowercase()
    .valid(...COURSE_DIFFICULTIES)
    .default("beginner"),

  language: Joi.string().trim().min(2).max(50).default("English"),

  duration: Joi.number().integer().min(0).max(100000).default(0),

  certificateAvailable: Joi.boolean().default(true),

  liveClassEnabled: Joi.boolean().default(false),

  tags: stringArray(MAX_TAG_LENGTH, "Tag"),

  requirements: stringArray(MAX_REQUIREMENT_LENGTH, "Requirement"),

  learningOutcomes: stringArray(MAX_OUTCOME_LENGTH, "Learning outcome"),

  targetAudience: stringArray(MAX_AUDIENCE_LENGTH, "Target audience"),
}).unknown(false);

// ======================================
// Update Course Schema
// ======================================
//
// All fields are optional, but unknown fields
// are rejected.
//

const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),

  description: Joi.string().trim().min(20).max(20000),

  shortDescription: Joi.string().trim().max(250).allow(""),

  thumbnail: thumbnailSchema,

  banner: safeUrl.allow(""),

  trailerVideo: safeUrl.allow(""),

  coTutors: Joi.array().items(objectId).max(MAX_ARRAY_ITEMS).unique(),

  category: objectId.allow(null),

  pricing: pricingSchema,

  difficulty: Joi.string()
    .trim()
    .lowercase()
    .valid(...COURSE_DIFFICULTIES),

  language: Joi.string().trim().min(2).max(50),

  duration: Joi.number().integer().min(0).max(100000),

  certificateAvailable: Joi.boolean(),

  liveClassEnabled: Joi.boolean(),

  status: Joi.string()
    .trim()
    .lowercase()
    .valid(...COURSE_STATUSES),

  tags: stringArray(MAX_TAG_LENGTH, "Tag"),

  requirements: stringArray(MAX_REQUIREMENT_LENGTH, "Requirement"),

  learningOutcomes: stringArray(MAX_OUTCOME_LENGTH, "Learning outcome"),

  targetAudience: stringArray(MAX_AUDIENCE_LENGTH, "Target audience"),

  isFeatured: Joi.boolean(),
})
  .min(1)
  .unknown(false);

// ======================================
// Validation Middleware Factory
// ======================================

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: false,
      convert: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: messages,
      });
    }

    req.body = value;

    return next();
  };
};

// ======================================
// Export
// ======================================

module.exports = {
  validateCreateCourse: validateBody(createCourseSchema),

  validateUpdateCourse: validateBody(updateCourseSchema),

  createCourseSchema,
  updateCourseSchema,
};
