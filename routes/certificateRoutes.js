const express = require("express");
const router = express.Router();

const {
  issueStudentCertificate,
  getStudentCertificates,
  getCertificate,
  verifyStudentCertificate,
  revokeStudentCertificate,
} = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// =========================
// Test Route
// =========================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Certificate routes are working.",
  });
});

// =========================
// Public Routes
// =========================

// Verify Certificate
router.get(
  "/verify/:verificationCode",
  verifyStudentCertificate
);

// =========================
// Student Routes
// =========================

// Get My Certificates
router.get(
  "/my-certificates",
  protect,
  authorize("student"),
  getStudentCertificates
);

// Get Certificate By ID
router.get(
  "/:id",
  protect,
  getCertificate
);

// =========================
// Tutor/Admin Routes
// =========================

// Issue Certificate
router.post(
  "/issue/:enrollmentId",
  protect,
  authorize("tutor", "admin"),
  issueStudentCertificate
);

// Revoke Certificate
router.patch(
  "/revoke/:id",
  protect,
  authorize("tutor", "admin"),
  revokeStudentCertificate
);

module.exports = router;