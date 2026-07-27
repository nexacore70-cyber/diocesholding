const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
  uploadFile,
  deleteFile,
} = require("../controllers/uploadController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Avatar
router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadFile,
);

// Course Thumbnail
router.post(
  "/course-thumbnail",
  protect,
  authorize("tutor", "admin"),
  upload.single("thumbnail"),
  uploadFile,
);

// Category Image
router.post(
  "/category-image",
  protect,
  authorize("admin"),
  upload.single("categoryImage"),
  uploadFile,
);

// Lesson File
router.post(
  "/lesson-file",
  protect,
  authorize("tutor", "admin"),
  upload.single("lessonFile"),
  uploadFile,
);

// Assignment File
router.post(
  "/assignment-file",
  protect,
  authorize("tutor", "admin"),
  upload.single("assignmentFile"),
  uploadFile,
);

// Student Submission
router.post(
  "/submission",
  protect,
  authorize("student"),
  upload.single("submissionFile"),
  uploadFile,
);

// Certificate
router.post(
  "/certificate",
  protect,
  authorize("admin"),
  upload.single("certificate"),
  uploadFile,
);

router.delete(
  "/",
  protect,
  authorize("admin"),
  deleteFile,
);

module.exports = router;