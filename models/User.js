const mongoose = require("mongoose");

// ======================================
// Constants
// ======================================

const USER_ROLES = [
  "student",
  "tutor",
  "client",
  "talent",
  "staff",
  "admin",
  "intern",
];

const USER_STATUSES = ["pending", "active", "suspended", "banned"];

const PRESENCE_STATUSES = [
  "online",
  "offline",
  "typing",
  "recording",
  "uploading",
  "busy",
  "in-call",
  "away",
];

// ======================================
// User Schema
// ======================================

const userSchema = new mongoose.Schema(
  {
    // ======================================
    // Basic Information
    // ======================================

    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
      match: [
        /^[a-z0-9._-]+$/,
        "Username can only contain letters, numbers, dots, underscores, and hyphens.",
      ],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    // ======================================
    // Authentication
    // ======================================

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },

    // ======================================
    // Roles
    // ======================================

    roles: {
      type: [
        {
          type: String,
          enum: USER_ROLES,
          lowercase: true,
          trim: true,
        },
      ],
      required: true,
      default: ["student"],
      validate: {
        validator: function (roles) {
          if (!Array.isArray(roles) || roles.length === 0) {
            return false;
          }

          const normalizedRoles = roles.map((role) =>
            String(role).trim().toLowerCase(),
          );

          return new Set(normalizedRoles).size === normalizedRoles.length;
        },
        message: "User must have at least one unique role.",
      },
    },

    // ======================================
    // Profile Image
    // ======================================

    profileImage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // ======================================
    // Account Status
    // ======================================

    status: {
      type: String,
      enum: USER_STATUSES,
      default: "active",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    suspendedAt: {
      type: Date,
      default: null,
    },

    suspendedReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    bannedAt: {
      type: Date,
      default: null,
    },

    bannedReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ======================================
    // Verification
    // ======================================

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Login / Activity Tracking
    // ======================================

    lastLogin: {
      type: Date,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    presence: {
      type: String,
      enum: PRESENCE_STATUSES,
      default: "offline",
    },

    // ======================================
    // Password Reset
    // ======================================

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // ======================================
    // Email Verification
    // ======================================

    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // ======================================
    // Refresh Token
    // ======================================

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    // ======================================
    // Soft Delete
    // ======================================

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,

    // ======================================
    // JSON Protection
    // ======================================

    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordChangedAt;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.refreshToken;
        delete ret.__v;

        return ret;
      },
    },

    // ======================================
    // Object Protection
    // ======================================

    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordChangedAt;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.refreshToken;
        delete ret.__v;

        return ret;
      },
    },
  },
);

// ======================================
// Indexes
// ======================================

// Username and email already have unique indexes
// through `unique: true`.

// Account management
userSchema.index({
  status: 1,
  isActive: 1,
});

// Role-based queries
userSchema.index({
  roles: 1,
});

// Soft-delete queries
userSchema.index({
  deletedAt: 1,
  status: 1,
});

// Activity queries
userSchema.index({
  lastSeen: 1,
});

// Online users
userSchema.index({
  isOnline: 1,
  lastSeen: -1,
});

// ======================================
// Normalize User Fields
// ======================================

userSchema.pre("validate", function (next) {
  // ======================================
  // Normalize Username
  // ======================================

  if (this.username) {
    this.username = String(this.username).trim().toLowerCase();
  }

  // ======================================
  // Normalize Email
  // ======================================

  if (this.email) {
    this.email = String(this.email).trim().toLowerCase();
  }

  // ======================================
  // Normalize Roles
  // ======================================

  if (Array.isArray(this.roles)) {
    this.roles = [
      ...new Set(
        this.roles
          .filter(Boolean)
          .map((role) => String(role).trim().toLowerCase()),
      ),
    ];
  }

  next();
});

// ======================================
// Password Change Tracking
// ======================================
//
// Whenever the password field is modified,
// automatically update passwordChangedAt.
//
// This works with the authentication middleware
// we just hardened.
//

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Don't set the timestamp for a brand-new account
  // unless an explicit passwordChangedAt value exists.
  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }

  next();
});

// ======================================
// Account Status Consistency
// ======================================

userSchema.pre("validate", function (next) {
  // ======================================
  // Banned Account
  // ======================================

  if (this.status === "banned") {
    this.isActive = false;

    if (!this.bannedAt) {
      this.bannedAt = new Date();
    }

    this.suspendedAt = null;
    this.suspendedReason = "";
  }

  // ======================================
  // Suspended Account
  // ======================================

  if (this.status === "suspended") {
    this.isActive = false;

    if (!this.suspendedAt) {
      this.suspendedAt = new Date();
    }

    this.bannedAt = null;
    this.bannedReason = "";
  }

  // ======================================
  // Active Account
  // ======================================

  if (this.status === "active") {
    this.isActive = true;

    this.suspendedAt = null;
    this.suspendedReason = "";

    this.bannedAt = null;
    this.bannedReason = "";
  }

  // ======================================
  // Pending Account
  // ======================================

  if (this.status === "pending") {
    this.isActive = false;
  }

  next();
});

// ======================================
// Prevent Password Changes Through
// findOneAndUpdate Without Tracking
// ======================================
//
// We don't want passwordChangedAt to become
// inconsistent when password is updated through
// findOneAndUpdate.
//

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) {
    return next();
  }

  const password = update.password || (update.$set && update.$set.password);

  if (password !== undefined) {
    if (update.$set) {
      update.$set.passwordChangedAt = new Date();
    } else {
      update.$set = {
        passwordChangedAt: new Date(),
      };
    }
  }

  next();
});

// ======================================
// Prevent Invalid Account States During
// findOneAndUpdate
// ======================================

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) {
    return next();
  }

  const status = update.status || (update.$set && update.$set.status);

  if (!status) {
    return next();
  }

  if (!update.$set) {
    update.$set = {};
  }

  if (status === "active") {
    update.$set.isActive = true;
    update.$set.suspendedAt = null;
    update.$set.suspendedReason = "";
    update.$set.bannedAt = null;
    update.$set.bannedReason = "";
  }

  if (status === "suspended") {
    update.$set.isActive = false;

    if (!update.$set.suspendedAt) {
      update.$set.suspendedAt = new Date();
    }

    update.$set.bannedAt = null;
    update.$set.bannedReason = "";
  }

  if (status === "banned") {
    update.$set.isActive = false;

    if (!update.$set.bannedAt) {
      update.$set.bannedAt = new Date();
    }

    update.$set.suspendedAt = null;
    update.$set.suspendedReason = "";
  }

  if (status === "pending") {
    update.$set.isActive = false;
  }

  next();
});

// ======================================
// Static: Available Roles
// ======================================

userSchema.statics.getAvailableRoles = function () {
  return [...USER_ROLES];
};

// ======================================
// Static: Available Statuses
// ======================================

userSchema.statics.getAvailableStatuses = function () {
  return [...USER_STATUSES];
};

// ======================================
// Export
// ======================================

module.exports = mongoose.model("User", userSchema);
