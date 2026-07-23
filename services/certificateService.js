const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Certificate = require("../models/Certificate");
const Enrollment = require("../models/Enrollment");
const {
  createNotification,
} = require("./notificationService");

// =========================
// Generate Certificate Number
// =========================
// =========================
// Generate Unique Certificate Number
// =========================
const generateCertificateNumber = async () => {
  let certificateNumber;
  let exists = true;

  while (exists) {
    const year = new Date().getFullYear();
    const random = Math.floor(
      100000 + Math.random() * 900000
    );

    certificateNumber = `NCA-${year}-${random}`;

    exists = await Certificate.exists({
      certificateNumber,
    });
  }

  return certificateNumber;
};

// =========================
// Generate PDF Certificate
// =========================
const generateCertificatePDF = (
  certificate,
  student,
  course
) => {
  return new Promise((resolve, reject) => {
    const folderPath = path.join(
      __dirname,
      "../uploads/certificates"
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {
        recursive: true,
      });
    }

    const fileName = `${certificate.certificateNumber}.pdf`;

    const filePath = path.join(
      folderPath,
      fileName
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // =========================
    // Header
    // =========================

    doc
      .fontSize(30)
      .text("NexaCore Academy", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(22)
      .text("Certificate of Completion", {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(16)
      .text("This certifies that", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(26)
      .text(
        `${student.firstName} ${student.lastName}`,
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(16)
      .text(
        "has successfully completed the course",
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(22)
      .text(course.title, {
        align: "center",
      });

      doc.moveDown();

const tutorName = course.tutor
  ? `${course.tutor.firstName} ${course.tutor.lastName}`
  : "NexaCore Academy";

doc
  .fontSize(16)
  .text(`Instructor: ${tutorName}`, {
    align: "center",
  });

doc.moveDown();

doc
  .fontSize(16)
  .text(
    `Completion Date: ${certificate.issuedAt.toDateString()}`,
    {
      align: "center",
    }
  );

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(
      `Certificate Number: ${certificate.certificateNumber}`
    );

   doc.text(
  `Verification Code: ${certificate.verificationCode}`
);

doc.text(
  `Verification URL: https://academy.nexacore.com/verify/${certificate.verificationCode}`
);

    doc.text(
      `Issued On: ${certificate.issuedAt.toDateString()}`
    );

    doc.moveDown(3);

    doc.text(
      "Verify this certificate using the verification code.",
      {
        align: "center",
      }
    );

    doc.end();

    stream.on("finish", () => {
      resolve(
        `/uploads/certificates/${fileName}`
      );
    });

    stream.on("error", reject);
  });
};

// =========================
// Issue Certificate
// =========================
const issueCertificate = async (
  enrollmentId,
  issuedBy
) => {
  const enrollment = await Enrollment.findById(
  enrollmentId
)
  .populate("student")
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

  if (enrollment.status !== "completed") {
    throw new Error(
      "Student has not completed this course."
    );
  }

  if (enrollment.progress < 100) {
    throw new Error(
      "Student has not completed all lessons."
    );
  }

  if (enrollment.certificateIssued) {
    throw new Error(
      "Certificate has already been issued."
    );
  }

  const certificate = await Certificate.create({
    student: enrollment.student._id,
    course: enrollment.course._id,
    enrollment: enrollment._id,
    certificateNumber: await generateCertificateNumber(),
    verificationCode: crypto.randomUUID(),
    issuedBy,
  });

  // Generate PDF

  const pdfUrl = await generateCertificatePDF(
    certificate,
    enrollment.student,
    enrollment.course
  );

  certificate.pdfUrl = pdfUrl;

await certificate.save();

enrollment.certificateIssued = true;

await enrollment.save();

await createNotification(
  enrollment.student._id,
  "certificate",
  "Certificate Issued",
  `Congratulations! Your certificate for "${enrollment.course.title}" has been issued successfully.`
);

return {
  success: true,
  message: "Certificate issued successfully.",
  data: certificate,
};
};

// =========================
// Get My Certificates
// =========================
const getMyCertificates = async (studentId) => {
  const certificates = await Certificate.find({
    student: studentId,
    status: "issued",
  })
    .populate("course", "title slug")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message:
      "Certificates retrieved successfully.",
    data: certificates,
  };
};

// =========================
// Get Certificate By ID
// =========================
const getCertificateById = async (
  certificateId
) => {
  const certificate =
    await Certificate.findById(
      certificateId
    )
      .populate(
        "student",
        "firstName lastName email"
      )
      .populate("course", "title slug")
      .populate(
        "issuedBy",
        "firstName lastName"
      );

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  return {
    success: true,
    message:
      "Certificate retrieved successfully.",
    data: certificate,
  };
};

// =========================
// Verify Certificate
// =========================
const verifyCertificate = async (
  verificationCode
) => {
  const certificate =
    await Certificate.findOne({
      verificationCode,
      status: "issued",
    })
      .populate(
        "student",
        "firstName lastName"
      )
      .populate("course", "title slug");

  if (!certificate) {
    throw new Error(
      "Certificate is invalid or does not exist."
    );
  }

  return {
    success: true,
    message:
      "Certificate verified successfully.",
    data: certificate,
  };
};

// =========================
// Revoke Certificate
// =========================
const revokeCertificate = async (
  certificateId
) => {
  const certificate =
    await Certificate.findById(
      certificateId
    );

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  if (certificate.status === "revoked") {
    throw new Error(
      "Certificate has already been revoked."
    );
  }

  certificate.status = "revoked";

  await certificate.save();

  return {
    success: true,
    message:
      "Certificate revoked successfully.",
    data: certificate,
  };
};

module.exports = {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate,
};