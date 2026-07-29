const express = require("express");

const {
  createWishlist,
  getWishlist,
  deleteWishlist,
  restoreWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Student Routes
// ======================================

// Add Course To Wishlist
router.post("/", protect, authorize("student"), createWishlist);

// Get My Wishlist
router.get("/", protect, authorize("student"), getWishlist);

// Remove Course From Wishlist (Soft Delete)
router.delete("/:id", protect, authorize("student"), deleteWishlist);

// Restore Wishlist Item
router.patch("/restore/:id", protect, authorize("student"), restoreWishlist);

module.exports = router;
