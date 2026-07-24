const express = require("express");

const {
  createWishlist,
  getWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ======================================
// Add Course To Wishlist
// POST /api/wishlist
// ======================================
router.post("/", protect, authorize("student"), createWishlist);

// ======================================
// Get My Wishlist
// GET /api/wishlist
// ======================================
router.get("/", protect, authorize("student"), getWishlist);

// ======================================
// Remove Course From Wishlist
// DELETE /api/wishlist/:id
// ======================================
router.delete("/:id", protect, authorize("student"), deleteWishlist);

module.exports = router;
