const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// Storage
// ======================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/temp";

    if (file.fieldname === "avatar") {
      folder = "uploads/avatars";
    }

    if (file.fieldname === "thumbnail") {
      folder = "uploads/course-thumbnails";
    }

    if (file.fieldname === "categoryImage") {
      folder = "uploads/categories";
    }

    if (file.fieldname === "lessonFile") {
      folder = "uploads/lesson-files";
    }

    if (file.fieldname === "assignmentFile") {
      folder = "uploads/assignment-files";
    }

    if (file.fieldname === "submissionFile") {
      folder = "uploads/submissions";
    }

    if (file.fieldname === "certificate") {
      folder = "uploads/certificates";
    }

    fs.mkdirSync(folder, { recursive: true });

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
    fileSize: 1024 * 1024 * 100, // 100 MB
  },
});

module.exports = upload;