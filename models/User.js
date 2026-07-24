const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    roles: {
      type: [
        {
          type: String,
          enum: [
            "student",
            "tutor",
            "client",
            "talent",
            "staff",
            "admin",
            "intern",
          ],
        },
      ],
      required: true,
      default: ["student"],
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Account Status
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "banned"],
      default: "active",
    },

    // Email Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // General Verification (KYC/Tutor/Admin etc.)
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Account Activation
    isActive: {
      type: Boolean,
      default: true,
    },

    // Login Tracking
    lastLogin: {
      type: Date,
      default: null,
    },

    // User Activity
    lastSeen: {
      type: Date,
      default: null,
    },

    // Password Reset
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // Email Verification Token
    emailVerificationToken: {
      type: String,
      default: null,
    },

    // Refresh Token (we'll use this later)
    refreshToken: {
      type: String,
      default: null,
    },

    // Soft Delete
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
