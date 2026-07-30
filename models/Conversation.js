const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // ======================================
    // Conversation Type
    // ======================================
    type: {
      type: String,
      enum: [
        "direct",
        "group",
        "broadcast",
        "announcement",
        "course",
        "live_class",
      ],
      default: "direct",
    },

    // ======================================
    // Conversation Name
    // (Used for groups, broadcasts, etc.)
    // ======================================
    name: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // ======================================
    // Owner / Creator
    // ======================================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================
    // Members
    // ======================================
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },

        isMuted: {
          type: Boolean,
          default: false,
        },

        isArchived: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ======================================
    // Linked Resources
    // ======================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    liveClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveClass",
      default: null,
    },

    // ======================================
    // Conversation Settings
    // ======================================
    allowMemberMessages: {
      type: Boolean,
      default: true,
    },

    allowMemberInvite: {
      type: Boolean,
      default: false,
    },

    onlyAdminsCanPost: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Last Message
    // ======================================
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Status
    // ======================================
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Conversation", conversationSchema);
