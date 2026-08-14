// ======================================
// Role Authorization Middleware
// ======================================

const VALID_ROLES = new Set([
  "student",
  "tutor",
  "client",
  "talent",
  "staff",
  "admin",
  "intern",
]);

// ======================================
// Normalize Roles
// ======================================

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) {
    return [];
  }

  return [
    ...new Set(
      roles
        .filter((role) => role !== null && role !== undefined)
        .map((role) => String(role).trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
};

// ======================================
// Role Authorization Middleware
// ======================================

const authorize = (...allowedRoles) => {
  // ======================================
  // Normalize Allowed Roles
  // ======================================

  const normalizedAllowedRoles = normalizeRoles(allowedRoles);

  // ======================================
  // Validate Authorization Configuration
  // ======================================

  const invalidAllowedRoles = normalizedAllowedRoles.filter(
    (role) => !VALID_ROLES.has(role),
  );

  if (invalidAllowedRoles.length > 0) {
    console.error(
      "Authorization Configuration Error: Invalid roles:",
      invalidAllowedRoles,
    );
  }

  // ======================================
  // Middleware
  // ======================================

  return (req, res, next) => {
    try {
      // ======================================
      // Authentication Check
      // ======================================

      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // ======================================
      // Authorization Configuration Check
      // ======================================

      if (normalizedAllowedRoles.length === 0) {
        console.error(
          "Authorization Error: No allowed roles configured for route.",
        );

        return res.status(500).json({
          success: false,
          message: "Authorization configuration error.",
        });
      }

      // ======================================
      // Reject Invalid Route Configuration
      // ======================================

      if (invalidAllowedRoles.length > 0) {
        return res.status(500).json({
          success: false,
          message: "Authorization configuration error.",
        });
      }

      // ======================================
      // Account Status
      // ======================================

      const status = String(req.user.status || "")
        .trim()
        .toLowerCase();

      if (status === "banned") {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned.",
        });
      }

      if (status === "suspended") {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended.",
        });
      }

      if (status === "pending") {
        return res.status(403).json({
          success: false,
          message: "Your account is pending activation.",
        });
      }

      if (status !== "active") {
        return res.status(403).json({
          success: false,
          message: "Your account is not active.",
        });
      }

      // ======================================
      // Active Account Check
      // ======================================

      if (req.user.isActive !== true) {
        return res.status(403).json({
          success: false,
          message: "This account is inactive.",
        });
      }

      // ======================================
      // Deleted Account Check
      // ======================================

      if (req.user.deletedAt) {
        return res.status(403).json({
          success: false,
          message: "This account is no longer active.",
        });
      }

      // ======================================
      // Get User Roles
      // ======================================

      const normalizedUserRoles = normalizeRoles(req.user.roles);

      // ======================================
      // Validate User Roles
      // ======================================

      if (normalizedUserRoles.length === 0) {
        console.error(
          `Authorization Error: User ${req.user._id} has no valid roles.`,
        );

        return res.status(403).json({
          success: false,
          message: "Your account has no valid permissions.",
        });
      }

      // ======================================
      // Permission Check
      // ======================================

      const hasPermission = normalizedUserRoles.some((userRole) =>
        normalizedAllowedRoles.includes(userRole),
      );

      // ======================================
      // Permission Denied
      // ======================================

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource.",
        });
      }

      // ======================================
      // Authorized
      // ======================================

      return next();
    } catch (error) {
      console.error("Authorization Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Authorization service error.",
      });
    }
  };
};

// ======================================
// Export
// ======================================

module.exports = authorize;
