const jwt = require("jsonwebtoken");

// ======================================
// Generate JWT
// ======================================

const generateToken = (userId) => {
  // ======================================
  // Validate User ID
  // ======================================

  if (!userId) {
    throw new Error("User ID is required to generate authentication token.");
  }

  // ======================================
  // Validate JWT Secret
  // ======================================

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  // ======================================
  // Validate JWT Secret Strength
  // ======================================

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }

  // ======================================
  // Token Expiration
  // ======================================

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  // ======================================
  // Generate Token
  // ======================================

  return jwt.sign(
    {
      id: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
      algorithm: "HS256",
    },
  );
};

module.exports = generateToken;
