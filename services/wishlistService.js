const Wishlist = require("../models/Wishlist");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ======================================
// Add Course To Wishlist
// ======================================
const addToWishlist = async (studentId, courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  if (!course.isPublished) {
    throw new Error("This course is not available.");
  }

  const enrolled = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: "active",
  });

  if (enrolled) {
    throw new Error("You are already enrolled in this course.");
  }

  const existingWishlist = await Wishlist.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingWishlist) {
    if (existingWishlist.isDeleted) {
      existingWishlist.isDeleted = false;
      await existingWishlist.save();

      return {
        success: true,
        message: "Course restored to wishlist successfully.",
        data: existingWishlist,
      };
    }

    throw new Error("Course is already in your wishlist.");
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
    isDeleted: false,
  })
    .populate({
      path: "course",
      select:
        "title slug thumbnail pricing difficulty ratings tutor isPublished",
      populate: {
        path: "tutor",
        select: "firstName lastName",
      },
    })
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    message: "Wishlist retrieved successfully.",
    data: wishlist,
  };
};

// ======================================
// Remove From Wishlist (Soft Delete)
// ======================================
const removeFromWishlist = async (studentId, wishlistId) => {
  const wishlist = await Wishlist.findOne({
    _id: wishlistId,
    student: studentId,
    isDeleted: false,
  });

  if (!wishlist) {
    throw new Error("Wishlist item not found.");
  }

  wishlist.isDeleted = true;

  await wishlist.save();

  return {
    success: true,
    message: "Course removed from wishlist successfully.",
  };
};

// ======================================
// Restore Wishlist Item
// ======================================
const restoreWishlistItem = async (wishlistId, studentId) => {
  const wishlist = await Wishlist.findOne({
    _id: wishlistId,
    student: studentId,
    isDeleted: true,
  });

  if (!wishlist) {
    throw new Error("Wishlist item not found.");
  }

  wishlist.isDeleted = false;

  await wishlist.save();

  return {
    success: true,
    message: "Wishlist restored successfully.",
    data: wishlist,
  };
};

module.exports = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
  restoreWishlistItem,
};
