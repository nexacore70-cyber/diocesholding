const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================
// Configuration
// ======================================

const JWT_ALGORITHM = "HS256";
const LAST_SEEN_UPDATE_INTERVAL = 5 * 60 * 1000;

// ======================================
// Authentication Error
// ======================================

const authenticationError = (res, message = "Authentication required.") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

// ======================================
// Account Authorization Error
// ======================================

const accountError = (res, message) => {
  return res.status(403).json({
    success: false,
    message,
  });
};

// ======================================
// Validate JWT Configuration
// ======================================

const validateJwtConfiguration = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || typeof secret !== "string") {
    return false;
  }

  if (secret.length < 32) {
    return false;
  }

  return true;
};

// ======================================
// Validate JWT Payload
// ======================================

const isValidJwtPayload = (decoded) => {
  if (!decoded || typeof decoded !== "object") {
    return false;
  }

  if (!decoded.id || typeof decoded.id !== "string") {
    return false;
  }

  if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
    return false;
  }

  return true;
};

// ======================================
// Check Password Change
// ======================================

const isTokenIssuedBeforePasswordChange = (decoded, user) => {
  if (!decoded?.iat) {
    return false;
  }

  if (!user?.passwordChangedAt) {
    return false;
  }

  const passwordChangedAt = new Date(user.passwordChangedAt);

  if (Number.isNaN(passwordChangedAt.getTime())) {
    return false;
  }

  const tokenIssuedAt = new Date(decoded.iat * 1000);

  return tokenIssuedAt <= passwordChangedAt;
};

// ======================================
// Update Last Seen
// ======================================

const updateLastSeen = async (user) => {
  try {
    const now = new Date();

    const lastSeen = user.lastSeen ? new Date(user.lastSeen) : null;

    const shouldUpdate =
      !lastSeen ||
      Number.isNaN(lastSeen.getTime()) ||
      now.getTime() - lastSeen.getTime() >= LAST_SEEN_UPDATE_INTERVAL;

    if (!shouldUpdate) {
      return;
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          lastSeen: now,
        },
      },
    );

    user.lastSeen = now;
  } catch (error) {
    console.error("Last Seen Update Error:", error.message);
  }
};

// ======================================
// Protect Routes
// ======================================

const protect = async (req, res, next) => {
  try {
    // ======================================
    // Validate JWT Configuration
    // ======================================

    if (!validateJwtConfiguration()) {
      console.error(
        "Authentication Error: JWT_SECRET is missing or too weak.",
      );

      return res.status(500).json({
        success: false,
        message: "Authentication service is not properly configured.",
      });
    }

    // ======================================
    // Get Authentication Token
    // ======================================

    let token = null;

    // --------------------------------------
    // Check Authorization Header
    // --------------------------------------

    const authHeader = req.headers.authorization;

    if (authHeader && typeof authHeader === "string") {
      const parts = authHeader.trim().split(/\s+/);

      if (
        parts.length === 2 &&
        parts[0].toLowerCase() === "bearer"
      ) {
        token = parts[1]?.trim();
      }
    }

    // --------------------------------------
    // Check HTTP-Only Cookie
    // --------------------------------------

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // --------------------------------------
    // No Token
    // --------------------------------------

    if (!token) {
      return authenticationError(res);
    }

    // ======================================
    // Verify JWT
    // ======================================

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return authenticationError(
          res,
          "Authentication token has expired.",
        );
      }

      if (error.name === "JsonWebTokenError") {
        return authenticationError(
          res,
          "Invalid authentication token.",
        );
      }

      if (error.name === "NotBeforeError") {
        return authenticationError(
          res,
          "Authentication token is not yet active.",
        );
      }

      return authenticationError(
        res,
        "Authentication failed.",
      );
    }

    // ======================================
    // Validate JWT Payload
    // ======================================

    if (!isValidJwtPayload(decoded)) {
      return authenticationError(
        res,
        "Invalid authentication token.",
      );
    }

    // ======================================
    // Find User
    // ======================================

    const user = await User.findOne({
      _id: decoded.id,
      deletedAt: null,
    }).select("+passwordChangedAt");

    // ======================================
    // User Not Found
    // ======================================

    if (!user) {
      return authenticationError(
        res,
        "User account not found.",
      );
    }

    // ======================================
    // Password Change Check
    // ======================================

    if (isTokenIssuedBeforePasswordChange(decoded, user)) {
      return authenticationError(
        res,
        "Your authentication session has expired. Please log in again.",
      );
    }

    // ======================================
    // Account Status
    // ======================================

    if (user.status === "banned") {
      return accountError(
        res,
        "Your account has been banned.",
      );
    }

    if (user.status === "suspended") {
      return accountError(
        res,
        "Your account has been suspended.",
      );
    }

    if (user.status === "pending") {
      return accountError(
        res,
        "Your account is pending activation.",
      );
    }

    if (user.status !== "active") {
      return accountError(
        res,
        "Your account is not active.",
      );
    }

    // ======================================
    // Active Flag
    // ======================================

    if (user.isActive !== true) {
      return accountError(
        res,
        "Your account has been deactivated.",
      );
    }

    // ======================================
    // Deleted Account
    // ======================================

    if (user.deletedAt) {
      return accountError(
        res,
        "This account is no longer active.",
      );
    }

    // ======================================
    // Validate Roles
    // ======================================

    if (!Array.isArray(user.roles)) {
      user.roles = [];
    }

    // ======================================
    // Update Last Seen
    // ======================================

    await updateLastSeen(user);

    // ======================================
    // Attach User
    // ======================================

    req.user = user;

    // ======================================
    // Continue
    // ======================================

    return next();
  } catch (error) {
    console.error(
      "Authentication Middleware Error:",
      error,
    );

    // ======================================
    // MongoDB Errors
    // ======================================

    if (
      error.name === "MongoServerError" ||
      error.name === "MongoNetworkError"
    ) {
      return res.status(503).json({
        success: false,
        message:
          "Authentication service is temporarily unavailable.",
      });
    }

    // ======================================
    // Cast Error
    // ======================================

    if (error.name === "CastError") {
      return authenticationError(
        res,
        "Invalid authentication credentials.",
      );
    }

    // ======================================
    // Generic Error
    // ======================================

    return res.status(500).json({
      success: false,
      message: "Authentication service error.",
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  protect,
};