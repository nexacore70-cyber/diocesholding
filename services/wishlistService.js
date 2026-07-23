const Wishlist = require("../models/Wishlist");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ======================================
// Add Course To Wishlist
// ======================================
const addToWishlist = async (
  studentId,
  courseId
) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const enrolled = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (enrolled) {
    throw new Error(
      "You are already enrolled in this course."
    );
  }

  const exists = await Wishlist.findOne({
    student: studentId,
    course: courseId,
  });

  if (exists) {
    throw new Error(
      "Course is already in your wishlist."
    );
  }

  const wishlist = await Wishlist.create({
    student: studentId,
    course: courseId,
  });

  return {
    success: true,
    message: "Course added to wishlist successfully.",
    data: wishlist,
  };
};

// ======================================
// Get My Wishlist
// ======================================
const getMyWishlist = async (studentId) => {
  const wishlist = await Wishlist.find({
    student: studentId,
  })
    .populate({
      path: "course",
      select:
        "title slug thumbnail pricing difficulty ratings tutor",
      populate: {
        path: "tutor",
        select: "firstName lastName",
      },
    })
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Wishlist retrieved successfully.",
    data: wishlist,
  };
};

// ======================================
// Remove From Wishlist
// ======================================
const removeFromWishlist = async (
  studentId,
  wishlistId
) => {
  const wishlist = await Wishlist.findOne({
    _id: wishlistId,
    student: studentId,
  });

  if (!wishlist) {
    throw new Error("Wishlist item not found.");
  }

  await wishlist.deleteOne();

  return {
    success: true,
    message:
      "Course removed from wishlist successfully.",
  };
};

module.exports = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
};