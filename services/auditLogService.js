const AuditLog = require("../models/AuditLog");

// ======================================
// Create Audit Log
// ======================================
const createAuditLog = async ({
  actor = null,
  actorRole = "system",
  action,
  resource,
  resourceId = null,
  method = null,
  endpoint = "",
  ipAddress = "",
  userAgent = "",
  status,
  statusCode = null,
  description = "",
  metadata = {},
  errorMessage = "",
  severity = "low",
}) => {
  try {
    if (!action) {
      throw new Error("Audit action is required.");
    }

    if (!resource) {
      throw new Error("Audit resource is required.");
    }

    if (!["success", "failure"].includes(status)) {
      throw new Error("Invalid audit status.");
    }

    const auditLog = await AuditLog.create({
      actor,
      actorRole,
      action,
      resource,
      resourceId,
      method,
      endpoint,
      ipAddress,
      userAgent,
      status,
      statusCode,
      description,
      metadata,
      errorMessage,
      severity,
    });

    return auditLog;
  } catch (error) {
    // Audit logging must not break the main application flow.
    console.error("AUDIT LOG ERROR:", error.message);

    return null;
  }
};

// ======================================
// Get Audit Logs
// ======================================
const getAuditLogs = async ({
  page = 1,
  limit = 50,
  actor = null,
  action = null,
  resource = null,
  resourceId = null,
  status = null,
  severity = null,
  startDate = null,
  endDate = null,
} = {}) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 50, 1), 100);

  const filter = {};

  if (actor) {
    filter.actor = actor;
  }

  if (action) {
    filter.action = action;
  }

  if (resource) {
    filter.resource = resource;
  }

  if (resourceId) {
    filter.resourceId = resourceId;
  }

  if (status) {
    filter.status = status;
  }

  if (severity) {
    filter.severity = severity;
  }

  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);

      // Include the entire requested end date.
      end.setHours(23, 59, 59, 999);

      filter.createdAt.$lte = end;
    }
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("actor", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    AuditLog.countDocuments(filter),
  ]);

  return {
    success: true,
    message: "Audit logs retrieved successfully.",
    data: logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

// ======================================
// Get Audit Log By ID
// ======================================
const getAuditLogById = async (auditLogId) => {
  const auditLog = await AuditLog.findById(auditLogId)
    .populate("actor", "firstName lastName email")
    .lean();

  if (!auditLog) {
    throw new Error("Audit log not found.");
  }

  return {
    success: true,
    message: "Audit log retrieved successfully.",
    data: auditLog,
  };
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
};