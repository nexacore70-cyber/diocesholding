const Course = require("../models/Course");

// ======================================
// Search Courses
// ======================================
const searchCourses = async (query) => {
  const {
    keyword,
    category,
    tutor,
    difficulty,
    language,
    featured,
    isFree,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 10,
  } = query;

  const filter = {
    isDeleted: false,
    status: "published",
  };

  // ==========================
  // Keyword Search
  // ==========================
  if (keyword) {
    filter.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        tags: {
          $in: [new RegExp(keyword, "i")],
        },
      },
    ];
  }

  // ==========================
  // Filters
  // ==========================
  if (category) {
    filter.category = category;
  }

  if (tutor) {
    filter.tutor = tutor;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (language) {
    filter.language = language;
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === "true";
  }

  if (isFree !== undefined) {
    filter["pricing.isFree"] = isFree === "true";
  }

  if (minPrice || maxPrice) {
    filter["pricing.amount"] = {};

    if (minPrice) {
      filter["pricing.amount"].$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter["pricing.amount"].$lte = Number(maxPrice);
    }
  }

  // ==========================
  // Sorting
  // ==========================
  let sortOption = {};

  switch (sort) {
    case "oldest":
      sortOption = {
        createdAt: 1,
      };
      break;

    case "price-low":
      sortOption = {
        "pricing.amount": 1,
      };
      break;

    case "price-high":
      sortOption = {
        "pricing.amount": -1,
      };
      break;

    case "rating":
      sortOption = {
        "ratings.average": -1,
      };
      break;

    case "popular":
      sortOption = {
        "analytics.enrolledStudents": -1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };
  }

  // ==========================
  // Pagination
  // ==========================
  const currentPage = Number(page) || 1;

  const pageSize = Number(limit) || 10;

  const skip = (currentPage - 1) * pageSize;

  const totalCourses = await Course.countDocuments(filter);

  const totalPages = Math.ceil(totalCourses / pageSize);

  const courses = await Course.find(filter)
    .populate("tutor", "firstName lastName profileImage")
    .populate("category", "name")
    .sort(sortOption)
    .skip(skip)
    .limit(pageSize);

  return {
    success: true,
    message: "Courses retrieved successfully.",
    data: courses,

    pagination: {
      page: currentPage,
      limit: pageSize,
      totalCourses,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    },
  };
};

module.exports = {
  searchCourses,
};
