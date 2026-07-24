const express = require("express");

const { search } = require("../controllers/searchController");

const router = express.Router();

// ======================================
// Search Courses
// GET /api/search
// ======================================
router.get("/", search);

module.exports = router;
