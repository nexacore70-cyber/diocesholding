const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateToken = require("../utils/generateToken");

// ======================================
// Configuration
// ======================================

const SALT_ROUNDS = 12;

// ======================================
// Sanitize User
// ======================================

const sanitizeUser = (user) => {
  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.passwordChangedAt;
  delete userResponse.passwordResetToken;
  delete userResponse.passwordResetExpires;
  delete userResponse.emailVerificationToken;
  delete userResponse.emailVerificationExpires;
  delete userResponse.refreshToken;

  return userResponse;
};

// ======================================
// Register User
// ======================================

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    // ======================================
    // Required Fields
    // ======================================

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // ======================================
    // Normalize Input
    // ======================================

    const normalizedFirstName = String(firstName).trim();
    const normalizedLastName = String(lastName).trim();
    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = phone ? String(phone).trim() : "";

    // ======================================
    // Validate Names
    // ======================================

    if (normalizedFirstName.length < 2 || normalizedFirstName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "First name must be between 2 and 100 characters.",
      });
    }

    if (normalizedLastName.length < 2 || normalizedLastName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Last name must be between 2 and 100 characters.",
      });
    }

    // ======================================
    // Validate Username
    // ======================================

    if (normalizedUsername.length < 3 || normalizedUsername.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 50 characters.",
      });
    }

    if (!/^[a-z0-9._-]+$/.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        message:
          "Username can only contain letters, numbers, dots, underscores, and hyphens.",
      });
    }

    // ======================================
    // Validate Email
    // ======================================

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // ======================================
    // Validate Phone
    // ======================================

    if (normalizedPhone.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Phone number is too long.",
      });
    }

    // ======================================
    // Validate Password
    // ======================================

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password cannot exceed 128 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter.",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one lowercase letter.",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number.",
      });
    }

    // ======================================
    // Check Existing Account
    // ======================================

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    }).select("_id email username");

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }

      if (existingUser.username === normalizedUsername) {
        return res.status(409).json({
          success: false,
          message: "Username already exists.",
        });
      }
    }

    // ======================================
    // Hash Password
    // ======================================

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ======================================
    // Create User
    // ======================================

    const user = await User.create({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      username: normalizedUsername,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,

      // ======================================
      // IMPORTANT
      // ======================================
      // Public registration can NEVER choose
      // privileged roles.
      //
      // Student is the default role.
      // ======================================

      roles: ["student"],

      status: "active",
      isActive: true,
      emailVerified: false,
      isVerified: false,
    });

    // ======================================
    // Generate Token
    // ======================================

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ======================================
    // Response
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration Error:", error);

    // ======================================
    // Duplicate Key
    // ======================================

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message:
          duplicateField === "email"
            ? "Email already exists."
            : duplicateField === "username"
              ? "Username already exists."
              : "An account with these details already exists.",
      });
    }

    // ======================================
    // Mongoose Validation
    // ======================================

    if (error.name === "ValidationError") {
      const message =
        Object.values(error.errors)[0]?.message ||
        "Invalid registration information.";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to complete registration.",
    });
  }
};

// ======================================
// Login User
// ======================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
      deletedAt: null,
    }).select("+password +passwordChangedAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ======================================
    // Account Status
    // ======================================

    if (user.status === "banned") {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned.",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending activation.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active.",
      });
    }

    if (user.isActive !== true) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // ======================================
    // Password
    // ======================================

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ======================================
    // Login Information
    // ======================================

    const now = new Date();

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: now,
          lastSeen: now,
          isOnline: true,
          presence: "online",
        },
      },
    );

    user.lastLogin = now;
    user.lastSeen = now;
    user.isOnline = true;
    user.presence = "online";

    // ======================================
    // Token
    // ======================================

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to complete login.",
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  registerUser,
  loginUser,
};
