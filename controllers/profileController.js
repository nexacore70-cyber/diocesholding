const mongoose = require("mongoose");
const Profile = require("../models/Profile");

// ======================================
// Helpers
// ======================================

const getUserId = (req) => {
  if (!req.user || !req.user._id) {
    return null;
  }

  return req.user._id;
};

const sanitizeProfile = (profile) => {
  if (!profile) {
    return null;
  }

  const profileObject = profile.toObject();

  delete profileObject.__v;

  return profileObject;
};

const createDefaultDisplayName = (user) => {
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
};

// ======================================
// Get My Profile
// ======================================
// GET /api/profile/me
// ======================================

const getMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user identifier.",
      });
    }

    let profile = await Profile.findOne({
      user: userId,
    });

    // ======================================
    // Automatically Create Profile
    // ======================================

    if (!profile) {
      profile = await Profile.create({
        user: userId,
        displayName: createDefaultDisplayName(req.user),
        phoneNumber: req.user.phone || "",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeProfile(profile),
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          Object.values(error.errors)[0]?.message || "Invalid profile data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

// ======================================
// Update My Profile
// ======================================
// PUT /api/profile/me
// ======================================

const updateMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user identifier.",
      });
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data.",
      });
    }

    // ======================================
    // Allowed Fields
    // ======================================

    const allowedFields = [
      "displayName",
      "bio",
      "dateOfBirth",
      "gender",
      "phoneNumber",
      "country",
      "state",
      "city",
      "address",
      "profilePicture",
      "timezone",
      "language",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    // ======================================
    // Social Links
    // ======================================

    if (req.body.socialLinks !== undefined) {
      if (
        !req.body.socialLinks ||
        typeof req.body.socialLinks !== "object" ||
        Array.isArray(req.body.socialLinks)
      ) {
        return res.status(400).json({
          success: false,
          message: "socialLinks must be an object.",
        });
      }

      const allowedSocialLinks = ["website", "linkedin", "github", "twitter"];

      updates.socialLinks = {};

      for (const field of allowedSocialLinks) {
        if (Object.prototype.hasOwnProperty.call(req.body.socialLinks, field)) {
          updates.socialLinks[field] = req.body.socialLinks[field];
        }
      }
    }

    // ======================================
    // Prevent Empty Update
    // ======================================

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile fields were provided.",
      });
    }

    // ======================================
    // Find Existing Profile
    // ======================================

    let profile = await Profile.findOne({
      user: userId,
    });

    // ======================================
    // Create If Missing
    // ======================================

    if (!profile) {
      profile = await Profile.create({
        user: userId,
        displayName: createDefaultDisplayName(req.user),
        phoneNumber: req.user.phone || "",
        ...updates,
      });
    } else {
      // ======================================
      // Update Normal Fields
      // ======================================

      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(updates, field)) {
          profile[field] = updates[field];
        }
      }

      // ======================================
      // Update Social Links Safely
      // ======================================

      if (updates.socialLinks) {
        for (const [field, value] of Object.entries(updates.socialLinks)) {
          profile.socialLinks[field] = value;
        }
      }

      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: sanitizeProfile(profile),
    });
  } catch (error) {
    console.error("Update My Profile Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          Object.values(error.errors)[0]?.message || "Invalid profile data.",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  getMyProfile,
  updateMyProfile,
};
