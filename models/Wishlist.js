const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ======================================
// Prevent Duplicate Wishlist Entries
// ======================================
wishlistSchema.index(
  {
    student: 1,
    course: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
