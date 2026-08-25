const express = require("express");

const router = express.Router();

const {
  issueStudentCertificate,
  getStudentCertificates,
  getCertificate,
  verifyStudentCertificate,
  revokeStudentCertificate,
  deleteStudentCertificate,
  restoreStudentCertificate,
} = require("../controllers/certificateController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

// ======================================
// Test
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Certificate routes are working.",
  });
});

// ======================================
// Public Verification
// ======================================

router.get(
  "/verify/:verificationCode",
  verifyStudentCertificate,
);

// ======================================
// Student
// ======================================

router.get(
  "/my-certificates",
  protect,
  authorize("student"),
  getStudentCertificates,
);

// ======================================
// Authenticated Certificate Access
// ======================================

router.get(
  "/:id",
  protect,
  getCertificate,
);

// ======================================
// Admin
// ======================================

// Issue
router.post(
  "/issue/:enrollmentId",
  protect,
  authorize("admin"),
  issueStudentCertificate,
);

// Revoke
router.patch(
  "/revoke/:id",
  protect,
  authorize("admin"),
  revokeStudentCertificate,
);

// Soft Delete
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudentCertificate,
);

// Restore
router.patch(
  "/restore/:id",
  protect,
  authorize("admin"),
  restoreStudentCertificate,
);

module.exports = router;