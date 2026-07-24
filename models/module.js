const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    order: {
      type: Number,
      required: true,
      default: 1,
    },

    estimatedDuration: {
      type: Number,
      default: 0,
    },

    learningObjectives: [
      {
        type: String,
      },
    ],

    resources: [
      {
        title: String,
        url: String,
      },
    ],

    unlockRule: {
      type: String,
      enum: ["previous_module", "manual", "date"],
      default: "previous_module",
    },

    isLocked: {
      type: Boolean,
      default: true,
    },

    isFreePreview: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Module", moduleSchema);
