const {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate,
  deleteCertificate,
  restoreCertificate,
} = require("../services/certificateService");

// ======================================
// Issue Certificate
// POST /api/certificates/issue/:enrollmentId
// Admin
// ======================================
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

// ======================================
// Get My Certificates
// GET /api/certificates/my-certificates
// Student
// ======================================
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

// ======================================
// Get Certificate By ID
// GET /api/certificates/:id
// Authenticated
// ======================================
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

// ======================================
// Verify Certificate
// GET /api/certificates/verify/:verificationCode
// Public
// ======================================
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

// ======================================
// Revoke Certificate
// PATCH /api/certificates/revoke/:id
// Admin
// ======================================
const revokeStudentCertificate = async (req, res) => {
  try {
    const { reason } = req.body;

    const result = await revokeCertificate(req.params.id, reason);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Revoke Certificate Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Certificate (Soft Delete)
// DELETE /api/certificates/:id
// Admin
// ======================================
const deleteStudentCertificate = async (req, res) => {
  try {
    const result = await deleteCertificate(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Certificate Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Restore Certificate
// PATCH /api/certificates/restore/:id
// Admin
// ======================================
const restoreStudentCertificate = async (req, res) => {
  try {
    const result = await restoreCertificate(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Restore Certificate Error:", error);

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
  deleteStudentCertificate,
  restoreStudentCertificate,
};
