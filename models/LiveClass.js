const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      default: null,
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    provider: {
      type: String,
      enum: ["zoom", "google_meet", "microsoft_teams", "jitsi", "custom"],
      default: "custom",
    },

    meetingLink: {
      type: String,
      required: true,
      trim: true,
    },

    meetingId: {
      type: String,
      default: "",
    },

    meetingPassword: {
      type: String,
      default: "",
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    timezone: {
      type: String,
      default: "Africa/Lagos",
    },

    recordingUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "live", "completed", "cancelled"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("LiveClass", liveClassSchema);
