const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    displayName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    country: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    profilePicture: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    timezone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    language: {
      type: String,
      default: "English",
      trim: true,
      maxlength: 50,
    },

    socialLinks: {
      website: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },

      linkedin: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },

      github: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },

      twitter: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", profileSchema);
