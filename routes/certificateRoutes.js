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

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// ======================================
// Test Route
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Certificate routes are working.",
  });
});

// ======================================
// Public
// ======================================

// Verify certificate
router.get(
  "/verify/:verificationCode",
  verifyStudentCertificate,
);

// ======================================
// Student
// ======================================

// Get student's certificates
router.get(
  "/my-certificates",
  protect,
  authorize("student"),
  getStudentCertificates,
);

// ======================================
// Authenticated
// ======================================

// Get certificate
//
// Students can only access their own certificate.
// Admins can access any certificate.
router.get(
  "/:id",
  protect,
  getCertificate,
);

// ======================================
// Admin
// ======================================

// Issue certificate
router.post(
  "/issue/:enrollmentId",
  protect,
  authorize("admin"),
  issueStudentCertificate,
);

// Revoke certificate
router.patch(
  "/revoke/:id",
  protect,
  authorize("admin"),
  revokeStudentCertificate,
);

// Soft delete certificate
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudentCertificate,
);

// Restore certificate
router.patch(
  "/restore/:id",
  protect,
  authorize("admin"),
  restoreStudentCertificate,
);

module.exports = router;