const {
  createReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getMyReviews,
} = require("../services/reviewService");

// ======================================
// Create Review
// ======================================
const addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    const result = await createReview(
      req.user._id,
      courseId,
      rating,
      comment
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Review
// ======================================
const editReview = async (req, res) => {
  try {
    const result = await updateReview(
      req.params.id,
      req.user._id,
      req.body.rating,
      req.body.comment
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Review
// ======================================
const removeReview = async (req, res) => {
  try {
    const result = await deleteReview(
      req.params.id,
      req.user._id
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Course Reviews
// ======================================
const getReviewsByCourse = async (req, res) => {
  try {
    const result = await getCourseReviews(
      req.params.courseId
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Course Reviews Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Reviews
// ======================================
const getMyReviewList = async (req, res) => {
  try {
    const result = await getMyReviews(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get My Reviews Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  editReview,
  removeReview,
  getReviewsByCourse,
  getMyReviewList,
};