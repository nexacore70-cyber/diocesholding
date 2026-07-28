const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// Storage
// ======================================
// ======================================
// Storage
// ======================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/temp";

    switch (file.fieldname) {
      case "avatar":
        folder = "uploads/avatars";
        break;

      case "thumbnail":
        folder = "uploads/course-thumbnails";
        break;

      case "categoryImage":
        folder = "uploads/categories";
        break;

      case "lessonVideo":
        folder = "uploads/lesson-videos";
        break;

      case "lessonDocument":
        folder = "uploads/lesson-documents";
        break;

      case "lessonResource":
        folder = "uploads/lesson-resources";
        break;

      case "assignmentFile":
        folder = "uploads/assignment-files";
        break;

      case "submissionFile":
        folder = "uploads/submissions";
        break;

      case "certificate":
        folder = "uploads/certificates";
        break;

      default:
        folder = "uploads/temp";
    }

    fs.mkdirSync(folder, {
      recursive: true,
    });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ======================================
// Allowed File Types
// ======================================
const fileFilter = (req, file, cb) => {
  const allowed = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".zip",
    ".rar",
    ".mp4",
    ".mov",
    ".avi",
    ".mp3",
    ".wav",
  ];

  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(extension)) {
    return cb(new Error("Unsupported file type."));
  }

  cb(null, true);
};

// ======================================
// Upload Configuration
// ======================================
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

module.exports = upload;
