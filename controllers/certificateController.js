const {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate,
} = require("../services/certificateService");

// =========================
// Issue Certificate
// =========================
// @desc Issue Certificate
// @route POST /api/certificates/issue/:enrollmentId
// @access Tutor/Admin
const issueStudentCertificate = async (req, res) => {
  try {
    const result = await issueCertificate(
      req.params.enrollmentId,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Issue Certificate Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get My Certificates
// =========================
// @desc Get My Certificates
// @route GET /api/certificates/my-certificates
// @access Student
const getStudentCertificates = async (req, res) => {
  try {
    const result = await getMyCertificates(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Certificates Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Certificate By ID
// =========================
// @desc Get Certificate By ID
// @route GET /api/certificates/:id
// @access Authenticated User
const getCertificate = async (req, res) => {
  try {
    const result = await getCertificateById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Certificate Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Verify Certificate
// =========================
// @desc Verify Certificate
// @route GET /api/certificates/verify/:verificationCode
// @access Public
const verifyStudentCertificate = async (req, res) => {
  try {
    const result = await verifyCertificate(req.params.verificationCode);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Verify Certificate Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Revoke Certificate
// =========================
// @desc Revoke Certificate
// @route PATCH /api/certificates/revoke/:id
// @access Tutor/Admin
const revokeStudentCertificate = async (req, res) => {
  try {
    const result = await revokeCertificate(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Revoke Certificate Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  issueStudentCertificate,
  getStudentCertificates,
  getCertificate,
  verifyStudentCertificate,
  revokeStudentCertificate,
};
