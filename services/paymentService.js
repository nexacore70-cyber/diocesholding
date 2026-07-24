const crypto = require("crypto");

const Payment = require("../models/Payment");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const { processRevenue } = require("./revenueService");

const { createNotification } = require("./notificationService");

// ======================================
// Generate Unique Payment Reference
// ======================================
const generatePaymentReference = () => {
  return `NEXA-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
};

// ======================================
// Initialize Payment
// ======================================
const initializePayment = async (studentId, courseId, gateway = "paystack") => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found.");
  }

  // Free courses should not go through payment
  if (course.pricing.isFree) {
    throw new Error("This course is free. No payment required.");
  }

  // Prevent duplicate enrollment
  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this course.");
  }

  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount: course.pricing.amount,
    currency: course.pricing.currency,
    gateway,
    reference: generatePaymentReference(),
    status: "pending",
  });

  return {
    success: true,
    message: "Payment initialized successfully.",
    data: payment,
  };
};

// ======================================
// Verify Payment
// ======================================
const verifyPayment = async (reference, gatewayReference = "") => {
  const payment = await Payment.findOne({
    reference,
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  if (payment.status === "successful") {
    throw new Error("Payment has already been verified.");
  }

  payment.status = "successful";
  payment.gatewayReference = gatewayReference;
  payment.paidAt = new Date();

  // Get course
  const course = await Course.findById(payment.course);

  if (!course) {
    throw new Error("Course not found.");
  }

  // Automatically enroll student
  let enrollment = await Enrollment.findOne({
    student: payment.student,
    course: payment.course,
  });

  if (!enrollment) {
    enrollment = await Enrollment.create({
      student: payment.student,
      course: payment.course,
      status: "active",
      progress: 0,
    });
  }

  payment.enrollment = enrollment._id;

  // Save payment
  await payment.save();

  // ======================================
  // Process Revenue Sharing
  // ======================================
  await processRevenue(payment);

  // ======================================
  // Notify Student
  // ======================================
  await createNotification({
    recipient: payment.student,
    type: "payment_success",
    title: "Payment Successful",
    message: `Your payment for "${course.title}" was successful. You now have access to this course.`,
    data: {
      payment: payment._id,
      course: course._id,
      enrollment: enrollment._id,
    },
  });

  return {
    success: true,
    message: "Payment verified successfully.",
    data: {
      payment,
      enrollment,
    },
  };
};

// ======================================
// Get Payment By Reference
// ======================================
const getPaymentByReference = async (reference) => {
  const payment = await Payment.findOne({
    reference,
  })
    .populate("student", "firstName lastName email")
    .populate("course", "title slug")
    .populate("enrollment");

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return {
    success: true,
    message: "Payment retrieved successfully.",
    data: payment,
  };
};

// ======================================
// Get My Payments
// ======================================
const getStudentPayments = async (studentId) => {
  const payments = await Payment.find({
    student: studentId,
    isDeleted: false,
  })
    .populate("course", "title slug")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Payments retrieved successfully.",
    data: payments,
  };
};

module.exports = {
  initializePayment,
  verifyPayment,
  getPaymentByReference,
  getStudentPayments,
};
