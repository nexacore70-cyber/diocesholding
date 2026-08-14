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
// Error Handler
// ======================================

const handleError = (res, error, fallback) => {
  console.error(fallback, error);

  const message = error?.message || fallback;

  const normalized = message.toLowerCase();

  if (
    normalized.includes("not found") ||
    normalized.includes("does not exist") ||
    normalized.includes("invalid")
  ) {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  if (
    normalized.includes("already") ||
    normalized.includes("cannot") ||
    normalized.includes("only administrators") ||
    normalized.includes("not authorized")
  ) {
    return res.status(409).json({
      success: false,
      message,
    });
  }

  return res.status(400).json({
    success: false,
    message,
  });
};

// ======================================
// Issue Certificate
// ======================================

const issueStudentCertificate = async (
  req,
  res,
) => {
  try {
    const result =
      await issueCertificate(
        req.params.enrollmentId,
        req.user._id,
      );

    return res.status(201).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to issue certificate.",
    );
  }
};

// ======================================
// Get My Certificates
// ======================================

const getStudentCertificates = async (
  req,
  res,
) => {
  try {
    const result =
      await getMyCertificates(
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to retrieve certificates.",
    );
  }
};

// ======================================
// Get Certificate By ID
// ======================================

const getCertificate = async (
  req,
  res,
) => {
  try {
    const result =
      await getCertificateById(
        req.params.id,
        req.user._id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to retrieve certificate.",
    );
  }
};

// ======================================
// Verify Certificate
// ======================================

const verifyStudentCertificate = async (
  req,
  res,
) => {
  try {
    const result =
      await verifyCertificate(
        req.params.verificationCode,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to verify certificate.",
    );
  }
};

// ======================================
// Revoke Certificate
// ======================================

const revokeStudentCertificate = async (
  req,
  res,
) => {
  try {
    const { reason } = req.body;

    const result =
      await revokeCertificate(
        req.params.id,
        req.user._id,
        reason,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to revoke certificate.",
    );
  }
};

// ======================================
// Soft Delete Certificate
// ======================================

const deleteStudentCertificate = async (
  req,
  res,
) => {
  try {
    const result =
      await deleteCertificate(
        req.params.id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to delete certificate.",
    );
  }
};

// ======================================
// Restore Certificate
// ======================================

const restoreStudentCertificate = async (
  req,
  res,
) => {
  try {
    const result =
      await restoreCertificate(
        req.params.id,
      );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to restore certificate.",
    );
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