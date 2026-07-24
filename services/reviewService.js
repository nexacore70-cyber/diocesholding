const Review = require("../models/Review");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ======================================
// Recalculate Course Rating
// ======================================
const recalculateCourseRating = async (courseId) => {
  const reviews = await Review.find({
    course: courseId,
    status: "published",
  });

  const total = reviews.length;

  let average = 0;

  if (total > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    average = Number((totalRating / total).toFixed(2));
  }

  await Course.findByIdAndUpdate(courseId, {
    "ratings.average": average,
    "ratings.total": total,
  });
};

// ======================================
// Create Review
// ======================================
const createReview = async (studentId, courseId, rating, comment = "") => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found.");
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: "active",
  });

  if (!enrollment) {
    throw new Error("You are not enrolled in this course.");
  }

  const existingReview = await Review.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this course.");
  }

  const review = await Review.create({
    student: studentId,
    course: courseId,
    enrollment: enrollment._id,
    rating,
    comment,
  });

  await recalculateCourseRating(courseId);

  return {
    success: true,
    message: "Review submitted successfully.",
    data: review,
  };
};

// ======================================
// Update Review
// ======================================
const updateReview = async (reviewId, studentId, rating, comment) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.student.toString() !== studentId.toString()) {
    throw new Error("You can only edit your own review.");
  }

  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    review.rating = rating;
  }

  if (comment !== undefined) {
    review.comment = comment;
  }

  await review.save();

  await recalculateCourseRating(review.course);

  return {
    success: true,
    message: "Review updated successfully.",
    data: review,
  };
};

// ======================================
// Delete Review
// ======================================
const deleteReview = async (reviewId, studentId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.student.toString() !== studentId.toString()) {
    throw new Error("You can only delete your own review.");
  }

  const courseId = review.course;

  await review.deleteOne();

  await recalculateCourseRating(courseId);

  return {
    success: true,
    message: "Review deleted successfully.",
  };
};

// ======================================
// Get Course Reviews
// ======================================
const getCourseReviews = async (courseId) => {
  const reviews = await Review.find({
    course: courseId,
    status: "published",
  })
    .populate("student", "firstName lastName profileImage")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Course reviews retrieved successfully.",
    data: reviews,
  };
};

// ======================================
// Get My Reviews
// ======================================
const getMyReviews = async (studentId) => {
  const reviews = await Review.find({
    student: studentId,
  })
    .populate("course", "title slug")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Reviews retrieved successfully.",
    data: reviews,
  };
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getMyReviews,
};
