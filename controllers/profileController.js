const Profile = require("../models/Profile");

/**
 * @desc    Get logged in user's profile
 * @route   GET /api/profile/me
 * @access  Private
 */
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    // Create a profile automatically if it doesn't exist
    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        displayName: `${req.user.firstName} ${req.user.lastName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

/**
 * @desc    Update logged in user's profile
 * @route   PUT /api/profile/me
 * @access  Private
 */
const updateMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    Object.assign(profile, req.body);

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
