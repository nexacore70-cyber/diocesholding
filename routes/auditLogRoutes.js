const express = require("express");

const {
  getAuditLogsController,
  getAuditLog,
} = require("../controllers/auditLogController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Admin Audit Logs
// ======================================

// Get audit logs
// GET /api/audit-logs
router.get(
  "/",
  protect,
  authorize("admin"),
  getAuditLogsController,
);

// Get single audit log
// GET /api/audit-logs/:id
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getAuditLog,
);

module.exports = router;