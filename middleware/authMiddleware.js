const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided.",
      });
    }

    console.log("Received Token:", token);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if account is active
    if (!user.isActive || user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
   console.error("Authentication Error:", error.name);
   console.error("Authentication Message:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = {
  protect,
};