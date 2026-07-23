const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} = require("../services/wishlistService");

// ======================================
// Add To Wishlist
// POST /api/wishlist
// ======================================
const createWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await addToWishlist(
      req.user._id,
      courseId
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Wishlist
// GET /api/wishlist
// ======================================
const getWishlist = async (req, res) => {
  try {
    const result = await getMyWishlist(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Remove Wishlist Item
// DELETE /api/wishlist/:id
// ======================================
const deleteWishlist = async (req, res) => {
  try {
    const result = await removeFromWishlist(
      req.user._id,
      req.params.id
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Wishlist Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWishlist,
  getWishlist,
  deleteWishlist,
};