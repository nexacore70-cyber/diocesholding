const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    // ======================================
    // Actor
    // ======================================
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    actorRole: {
      type: String,
      enum: ["student", "tutor", "admin", "company", "system"],
      default: "system",
      index: true,
    },

    // ======================================
    // Action
    // ======================================
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    // ======================================
    // Resource
    // ======================================
    resource: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // ======================================
    // Request Information
    // ======================================
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      default: null,
    },

    endpoint: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    ipAddress: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // ======================================
    // Result
    // ======================================
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
      index: true,
    },

    statusCode: {
      type: Number,
      min: 100,
      max: 599,
      default: null,
    },

    // ======================================
    // Additional Context
    // ======================================
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ======================================
    // Error Information
    // ======================================
    errorMessage: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // ======================================
    // Security Classification
    // ======================================
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Indexes
// ======================================

auditLogSchema.index({
  actor: 1,
  createdAt: -1,
});

auditLogSchema.index({
  resource: 1,
  resourceId: 1,
  createdAt: -1,
});

auditLogSchema.index({
  action: 1,
  createdAt: -1,
});

auditLogSchema.index({
  severity: 1,
  createdAt: -1,
});

auditLogSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model("AuditLog", auditLogSchema);