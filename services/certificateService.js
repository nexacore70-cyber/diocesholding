const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");

const User = require("../models/User");
const Certificate = require("../models/Certificate");
const Enrollment = require("../models/Enrollment");
const { createNotification } = require("./notificationService");

// ======================================
// Helpers
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeVerificationCode = (code) => {
  if (!code || typeof code !== "string") {
    throw new Error("Verification code is required.");
  }

  return code.trim().toLowerCase();
};

const normalizeReason = (reason) => {
  if (!reason) {
    return "No reason provided";
  }

  if (typeof reason !== "string") {
    throw new Error("Revocation reason must be a string.");
  }

  const cleaned = reason.trim();

  if (!cleaned) {
    return "No reason provided";
  }

  if (cleaned.length > 500) {
    throw new Error("Revocation reason cannot exceed 500 characters.");
  }

  return cleaned;
};

// ======================================
// Generate Certificate Number
// ======================================

const generateCertificateNumber = async () => {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const randomNumber = crypto.randomInt(100000, 1000000);

    const certificateNumber = `NCA-${year}-${randomNumber}`;

    const exists = await Certificate.exists({
      certificateNumber,
    });

    if (!exists) {
      return certificateNumber;
    }
  }

  throw new Error(
    "Unable to generate a unique certificate number. Please try again.",
  );
};

// ======================================
// Generate Verification Code
// ======================================

const generateVerificationCode = () => {
  return crypto.randomBytes(24).toString("hex");
};

// ======================================
// Generate Certificate PDF
// ======================================

const generateCertificatePDF = (certificate, student, course) => {
  return new Promise((resolve, reject) => {
    const folderPath = path.join(
      __dirname,
      "../uploads/certificates",
    );

    try {
      fs.mkdirSync(folderPath, {
        recursive: true,
      });
    } catch (error) {
      return reject(error);
    }

    const fileName = `${certificate.certificateNumber}.pdf`;
    const filePath = path.join(folderPath, fileName);

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Title: "NexaCore Academy Certificate",
        Author: "NexaCore Academy",
        Subject: "Certificate of Completion",
      },
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(30).text("NexaCore Academy", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(22).text("Certificate of Completion", {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(16).text("This certifies that", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(26).text(
      `${student.firstName} ${student.lastName}`,
      {
        align: "center",
      },
    );

    doc.moveDown();

    doc.fontSize(16).text(
      "has successfully completed the course",
      {
        align: "center",
      },
    );

    doc.moveDown();

    doc.fontSize(22).text(course.title, {
      align: "center",
    });

    doc.moveDown();

    const tutorName = course.tutor
      ? `${course.tutor.firstName} ${course.tutor.lastName}`
      : "NexaCore Academy";

    doc.fontSize(16).text(
      `Instructor: ${tutorName}`,
      {
        align: "center",
      },
    );

    doc.moveDown();

    doc.fontSize(16).text(
      `Completion Date: ${certificate.issuedAt.toDateString()}`,
      {
        align: "center",
      },
    );

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(
      `Certificate Number: ${certificate.certificateNumber}`,
    );

    doc.text(
      `Verification Code: ${certificate.verificationCode}`,
    );

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:3000";

    const verificationUrl =
      `${frontendUrl}/verify/${certificate.verificationCode}`;

    doc.text(
      `Verification URL: ${verificationUrl}`,
    );

    doc.text(
      `Issued On: ${certificate.issuedAt.toDateString()}`,
    );

    doc.moveDown(3);

    doc.text(
      "Verify this certificate using the verification code.",
      {
        align: "center",
      },
    );

    doc.end();

    stream.on("finish", () => {
      resolve({
        filePath,
        relativeUrl: `/uploads/certificates/${fileName}`,
      });
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

// ======================================
// Issue Certificate
// ======================================

const issueCertificate = async (enrollmentId, issuedBy) => {
  if (!isValidObjectId(enrollmentId)) {
    throw new Error("Invalid enrollment ID.");
  }

  if (!isValidObjectId(issuedBy)) {
    throw new Error("Invalid administrator ID.");
  }

  const admin = await User.findById(issuedBy).select(
    "_id role",
  );

  if (!admin) {
    throw new Error("User not found.");
  }

  if (admin.role !== "admin") {
    throw new Error(
      "Only administrators can issue certificates.",
    );
  }

  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("student", "firstName lastName")
    .populate({
      path: "course",
      populate: {
        path: "tutor",
        select: "firstName lastName",
      },
    });

  if (!enrollment) {
    throw new Error("Enrollment not found.");
  }

  if (!enrollment.student) {
    throw new Error(
      "Enrollment student information is missing.",
    );
  }

  if (!enrollment.course) {
    throw new Error(
      "Enrollment course information is missing.",
    );
  }

  if (enrollment.status !== "completed") {
    throw new Error(
      "Student has not completed this course.",
    );
  }

  if (Number(enrollment.progress) < 100) {
    throw new Error(
      "Student has not completed all lessons.",
    );
  }

  if (enrollment.certificateIssued) {
    throw new Error(
      "Certificate has already been issued.",
    );
  }

  const existingCertificate =
    await Certificate.findOne({
      enrollment: enrollment._id,
    });

  if (existingCertificate) {
    throw new Error(
      "Certificate already exists for this enrollment.",
    );
  }

  const certificateNumber =
    await generateCertificateNumber();

  const verificationCode =
    generateVerificationCode();

  const issuedAt = new Date();

  const certificatePreview = {
    certificateNumber,
    verificationCode,
    issuedAt,
  };

  let generatedFile = null;

  try {
    /*
     * Generate the PDF before committing the transaction.
     * If the transaction fails, the generated file is removed.
     */
    generatedFile = await generateCertificatePDF(
      certificatePreview,
      enrollment.student,
      enrollment.course,
    );

    const session = await mongoose.startSession();

    let certificate;

    try {
      await session.withTransaction(async () => {
        /*
         * Re-check inside the transaction to reduce race conditions.
         */
        const lockedEnrollment =
          await Enrollment.findById(enrollment._id).session(
            session,
          );

        if (!lockedEnrollment) {
          throw new Error("Enrollment not found.");
        }

        if (lockedEnrollment.certificateIssued) {
          throw new Error(
            "Certificate has already been issued.",
          );
        }

        const duplicate =
          await Certificate.findOne({
            enrollment: lockedEnrollment._id,
          }).session(session);

        if (duplicate) {
          throw new Error(
            "Certificate already exists for this enrollment.",
          );
        }

        const created =
          await Certificate.create(
            [
              {
                student: enrollment.student._id,
                course: enrollment.course._id,
                enrollment: enrollment._id,
                certificateNumber,
                verificationCode,
                issuedBy: admin._id,
                issuedAt,
                pdfUrl: generatedFile.relativeUrl,
              },
            ],
            { session },
          );

        certificate = created[0];

        lockedEnrollment.certificateIssued = true;

        await lockedEnrollment.save({
          session,
        });
      });
    } finally {
      await session.endSession();
    }

    /*
     * Notification failure should NOT undo certificate issuance.
     */
    try {
      await createNotification(
        enrollment.student._id,
        "certificate",
        "Certificate Issued",
        `Congratulations! Your certificate for "${enrollment.course.title}" has been issued successfully.`,
      );
    } catch (notificationError) {
      console.error(
        "Certificate notification error:",
        notificationError,
      );
    }

    return {
      success: true,
      message: "Certificate issued successfully.",
      data: certificate,
    };
  } catch (error) {
    /*
     * Remove orphaned PDF if database issuance failed.
     */
    if (
      generatedFile &&
      generatedFile.filePath &&
      fs.existsSync(generatedFile.filePath)
    ) {
      try {
        fs.unlinkSync(generatedFile.filePath);
      } catch (cleanupError) {
        console.error(
          "Certificate PDF cleanup error:",
          cleanupError,
        );
      }
    }

    if (error?.code === 11000) {
      throw new Error(
        "A certificate with these details already exists.",
      );
    }

    throw error;
  }
};

// ======================================
// Get My Certificates
// ======================================

const getMyCertificates = async (studentId) => {
  if (!isValidObjectId(studentId)) {
    throw new Error("Invalid student ID.");
  }

  const certificates = await Certificate.find({
    student: studentId,
    status: "issued",
    isDeleted: false,
  })
    .select(
      "certificateNumber course issuedAt pdfUrl verificationCode status",
    )
    .populate("course", "title slug")
    .sort({
      issuedAt: -1,
    })
    .lean();

  return {
    success: true,
    message: "Certificates retrieved successfully.",
    data: certificates,
  };
};

// ======================================
// Get Certificate By ID
// ======================================

const getCertificateById = async (
  certificateId,
  requesterId,
) => {
  if (!isValidObjectId(certificateId)) {
    throw new Error("Invalid certificate ID.");
  }

  if (!isValidObjectId(requesterId)) {
    throw new Error("Invalid user ID.");
  }

  const requester = await User.findById(requesterId).select(
    "_id role",
  );

  if (!requester) {
    throw new Error("User not found.");
  }

  const query = {
    _id: certificateId,
    isDeleted: false,
  };

  /*
   * Students may only access their own certificate.
   * Admins can access any certificate.
   */
  if (requester.role !== "admin") {
    query.student = requesterId;
  }

  const certificate = await Certificate.findOne(query)
    .populate(
      "student",
      "firstName lastName email",
    )
    .populate("course", "title slug")
    .populate(
      "issuedBy",
      "firstName lastName",
    )
    .populate(
      "revokedBy",
      "firstName lastName",
    )
    .lean();

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  return {
    success: true,
    message: "Certificate retrieved successfully.",
    data: certificate,
  };
};

// ======================================
// Verify Certificate
// ======================================

const verifyCertificate = async (
  verificationCode,
) => {
  const normalizedCode =
    normalizeVerificationCode(
      verificationCode,
    );

  const certificate =
    await Certificate.findOne({
      verificationCode: normalizedCode,
      status: "issued",
      isDeleted: false,
    })
      .select(
        "certificateNumber student course issuedAt status verificationCode",
      )
      .populate(
        "student",
        "firstName lastName",
      )
      .populate(
        "course",
        "title slug",
      )
      .lean();

  if (!certificate) {
    throw new Error(
      "Certificate is invalid, revoked, or does not exist.",
    );
  }

  return {
    success: true,
    message: "Certificate verified successfully.",
    data: {
      certificateNumber:
        certificate.certificateNumber,

      verificationCode:
        certificate.verificationCode,

      student: certificate.student
        ? {
            firstName:
              certificate.student.firstName,
            lastName:
              certificate.student.lastName,
          }
        : null,

      course: certificate.course
        ? {
            title:
              certificate.course.title,
            slug:
              certificate.course.slug,
          }
        : null,

      issuedAt: certificate.issuedAt,

      status: certificate.status,
    },
  };
};

// ======================================
// Revoke Certificate
// ======================================

const revokeCertificate = async (
  certificateId,
  revokedBy,
  reason,
) => {
  if (!isValidObjectId(certificateId)) {
    throw new Error("Invalid certificate ID.");
  }

  if (!isValidObjectId(revokedBy)) {
    throw new Error("Invalid administrator ID.");
  }

  const admin = await User.findById(revokedBy).select(
    "_id role",
  );

  if (!admin) {
    throw new Error("User not found.");
  }

  if (admin.role !== "admin") {
    throw new Error(
      "Only administrators can revoke certificates.",
    );
  }

  const normalizedReason =
    normalizeReason(reason);

  const certificate =
    await Certificate.findOne({
      _id: certificateId,
      isDeleted: false,
    });

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  if (certificate.status === "revoked") {
    throw new Error(
      "Certificate has already been revoked.",
    );
  }

  certificate.status = "revoked";
  certificate.revokedAt = new Date();
  certificate.revokedBy = admin._id;
  certificate.revokedReason =
    normalizedReason;

  await certificate.save();

  return {
    success: true,
    message: "Certificate revoked successfully.",
    data: certificate,
  };
};

// ======================================
// Soft Delete Certificate
// ======================================

const deleteCertificate = async (
  certificateId,
) => {
  if (!isValidObjectId(certificateId)) {
    throw new Error("Invalid certificate ID.");
  }

  const certificate =
    await Certificate.findOne({
      _id: certificateId,
      isDeleted: false,
    });

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  certificate.isDeleted = true;

  await certificate.save();

  return {
    success: true,
    message: "Certificate deleted successfully.",
  };
};

// ======================================
// Restore Certificate
// ======================================

const restoreCertificate = async (
  certificateId,
) => {
  if (!isValidObjectId(certificateId)) {
    throw new Error("Invalid certificate ID.");
  }

  const certificate =
    await Certificate.findOne({
      _id: certificateId,
      isDeleted: true,
    });

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  certificate.isDeleted = false;

  await certificate.save();

  return {
    success: true,
    message: "Certificate restored successfully.",
    data: certificate,
  };
};

module.exports = {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate,
  deleteCertificate,
  restoreCertificate,
};