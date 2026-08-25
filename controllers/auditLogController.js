const {
  getAuditLogs,
  getAuditLogById,
} = require("../services/auditLogService");

// ======================================
// Get Audit Logs
// GET /api/audit-logs
// @access Admin
// ======================================
const getAuditLogsController = async (req, res) => {
  try {
    const {
      page,
      limit,
      actor,
      action,
      resource,
      resourceId,
      status,
      severity,
      startDate,
      endDate,
    } = req.query;

    const result = await getAuditLogs({
      page,
      limit,
      actor,
      action,
      resource,
      resourceId,
      status,
      severity,
      startDate,
      endDate,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve audit logs.",
    });
  }
};

// ======================================
// Get Audit Log By ID
// GET /api/audit-logs/:id
// @access Admin
// ======================================
const getAuditLog = async (req, res) => {
  try {
    const result = await getAuditLogById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Audit Log Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAuditLogsController,
  getAuditLog,
};