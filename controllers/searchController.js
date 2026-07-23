const {
  searchCourses,
} = require("../services/searchService");

// ======================================
// Search Courses
// GET /api/search
// ======================================
const search = async (req, res) => {
  try {
    const result = await searchCourses(req.query);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Search Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  search,
};