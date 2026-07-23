const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 1,
    },

    lessonType: {
      type: String,
      enum: ["video", "text", "quiz", "assignment", "live"],
      default: "video",
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    content: {
      type: String,
    },

    attachments: [
      {
        title: String,
        fileUrl: String,
      },
    ],

    isPreview: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
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
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);