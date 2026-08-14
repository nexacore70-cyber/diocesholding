const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // ======================================
    // Conversation
    // ======================================
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    // ======================================
    // Sender
    // ======================================
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ======================================
    // Message Type
    // ======================================
    type: {
      type: String,
      enum: [
        "text",
        "image",
        "video",
        "audio",
        "voice",
        "document",
        "file",
        "link",
        "system",
      ],
      default: "text",
    },

    // ======================================
    // Text
    // ======================================
    text: {
      type: String,
      default: "",
      trim: true,
      maxlength: 10000,
    },

    // ======================================
    // Attachments
    // ======================================
    attachments: [
      {
        fileName: {
          type: String,
          trim: true,
        },

        fileUrl: {
          type: String,
          trim: true,
        },

        fileType: {
          type: String,
          trim: true,
        },

        fileSize: {
          type: Number,
          min: 0,
        },
      },
    ],

    // ======================================
    // Reply
    // ======================================
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // ======================================
    // Forwarded Message
    // ======================================
    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // ======================================
    // Reactions
    // ======================================
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        emoji: {
          type: String,
          required: true,
          trim: true,
          maxlength: 20,
        },
      },
    ],

    // ======================================
    // Read Receipts
    // ======================================
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ======================================
    // Delivery Receipts
    // ======================================
    deliveredTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ======================================
    // Pin
    // ======================================
    pinned: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Edit
    // ======================================
    edited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    // ======================================
    // Delete For Everyone
    // ======================================
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // Delete For Specific User
    // ======================================
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ======================================
    // Message Status
    // ======================================
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Indexes
// ======================================

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

messageSchema.index({
  sender: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Message", messageSchema);
