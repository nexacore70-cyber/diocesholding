const crypto = require("crypto");

const Payment = require("../models/Payment");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const { processRevenue } = require("./revenueService");
const { createNotification } = require("./notificationService");
const { createAuditLog } = require("./auditLogService");

// ======================================
// Configuration
// ======================================

const PAYSTACK_BASE_URL =
  process.env.PAYSTACK_BASE_URL || "https://api.paystack.co";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const SUPPORTED_GATEWAYS = ["paystack"];

// ======================================
// Generate Unique Payment Reference
// ======================================

const generatePaymentReference = () => {
  return `NEXA-${Date.now()}-${crypto
    .randomBytes(8)
    .toString("hex")
    .toUpperCase()}`;
};

// ======================================
// Validate Payment Reference
// ======================================

const validateReference = (reference) => {
  if (!reference || typeof reference !== "string") {
    throw new Error("Payment reference is required.");
  }

  const cleaned = reference.trim();

  if (!/^[A-Za-z0-9_.=-]{6,100}$/.test(cleaned)) {
    throw new Error("Invalid payment reference.");
  }

  return cleaned;
};

// ======================================
// Validate Amount
// ======================================

const normalizeAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isSafeInteger(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid payment amount.");
  }

  return numericAmount;
};

// ======================================
// Paystack Request
// ======================================

const paystackRequest = async (path, options = {}) => {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not configured.");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let result;

  try {
    result = await response.json();
  } catch (error) {
    throw new Error("Invalid response received from payment gateway.");
  }

  if (!response.ok || !result?.status) {
    throw new Error(
      result?.message || "Payment gateway request failed.",
    );
  }

  return result;
};

// ======================================
// Verify Payment With Paystack
// ======================================

const verifyPaystackTransaction = async (reference) => {
  const result = await paystackRequest(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );

  if (!result?.data) {
    throw new Error("Invalid verification response from Paystack.");
  }

  return result.data;
};

// ======================================
// Initialize Payment
// ======================================

const initializePayment = async (
  studentId,
  courseId,
  gateway = "paystack",
  requestContext = {},
) => {
  if (!studentId) {
    throw new Error("Student is required.");
  }

  if (!courseId) {
    throw new Error("Course is required.");
  }

  gateway = String(gateway || "paystack").toLowerCase();

  if (!SUPPORTED_GATEWAYS.includes(gateway)) {
    throw new Error(
      `Payment gateway "${gateway}" is not currently supported.`,
    );
  }

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  if (course.status !== "published") {
    throw new Error("This course is not available for enrollment.");
  }

  if (course.pricing?.isFree) {
    throw new Error("This course is free. No payment required.");
  }

  const courseAmount = normalizeAmount(course.pricing?.amount);

  const currency = String(
    course.pricing?.currency || "NGN",
  ).toUpperCase();

  // ======================================
  // Existing Enrollment
  // ======================================

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    isDeleted: false,
  });

  if (existingEnrollment) {
    throw new Error(
      "Student is already enrolled in this course.",
    );
  }

  // ======================================
  // Existing Pending Payment
  //
  // Reuse it instead of creating unlimited
  // pending payments for the same course.
  // ======================================

  const existingPendingPayment = await Payment.findOne({
    student: studentId,
    course: courseId,
    status: "pending",
    isDeleted: false,
  }).sort({ createdAt: -1 });

  if (existingPendingPayment) {
    return {
      success: true,
      message: "Existing pending payment retrieved.",
      data: existingPendingPayment,
    };
  }

  // ======================================
  // Create Internal Payment
  // ======================================

  const reference = generatePaymentReference();

  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount: courseAmount,
    currency,
    gateway,
    reference,
    status: "pending",
    fulfillmentStatus: "pending",
    metadata: {
      courseId: courseId.toString(),
      studentId: studentId.toString(),
    },
  });

  try {
    // ======================================
    // Initialize Paystack Transaction
    // ======================================

    const user = await require("../models/User").findById(
      studentId,
    ).select("email firstName lastName");

    if (!user?.email) {
      throw new Error("Student email is required for payment.");
    }

    const gatewayResponse = await paystackRequest(
      "/transaction/initialize",
      {
        method: "POST",
        body: {
          email: user.email,
          amount: String(courseAmount),
          currency,
          reference,
          metadata: {
            paymentId: payment._id.toString(),
            studentId: studentId.toString(),
            courseId: courseId.toString(),
          },
        },
      },
    );

    payment.gatewayReference =
      gatewayResponse?.data?.reference || reference;

    payment.metadata = {
      ...payment.metadata,
      authorizationUrl:
        gatewayResponse?.data?.authorization_url || "",
      accessCode:
        gatewayResponse?.data?.access_code || "",
    };

    await payment.save();

    await createAuditLog({
      actor: studentId,
      actorRole: "student",
      action: "PAYMENT_INITIALIZED",
      resource: "Payment",
      resourceId: payment._id,
      status: "success",
      statusCode: 201,
      description: "Payment initialized.",
      metadata: {
        courseId: courseId.toString(),
        amount: courseAmount,
        currency,
        gateway,
      },
      ...requestContext,
    });

    return {
      success: true,
      message: "Payment initialized successfully.",
      data: {
        payment,
        authorizationUrl:
          gatewayResponse?.data?.authorization_url || null,
        accessCode:
          gatewayResponse?.data?.access_code || null,
        reference,
      },
    };
  } catch (error) {
    payment.status = "failed";
    payment.fulfillmentStatus = "failed";
    payment.fulfillmentError = error.message;

    await payment.save();

    await createAuditLog({
      actor: studentId,
      actorRole: "student",
      action: "PAYMENT_FAILED",
      resource: "Payment",
      resourceId: payment._id,
      status: "failed",
      statusCode: 400,
      description: "Payment initialization failed.",
      errorMessage: error.message,
      metadata: {
        courseId: courseId.toString(),
        amount: courseAmount,
        currency,
        gateway,
      },
      ...requestContext,
    });

    throw error;
  }
};

// ======================================
// Fulfill Successful Payment
// ======================================

const fulfillSuccessfulPayment = async (
  payment,
  gatewayData,
  requestContext = {},
) => {
  // ======================================
  // Already fulfilled
  // ======================================

  if (payment.fulfillmentStatus === "completed") {
    return {
      payment,
      enrollment: payment.enrollment
        ? await Enrollment.findById(payment.enrollment)
        : null,
      alreadyFulfilled: true,
    };
  }

  // ======================================
  // Claim fulfillment
  //
  // Atomic state transition prevents two
  // simultaneous verification/webhook calls
  // from fulfilling the same payment.
  // ======================================

  const claimedPayment = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      fulfillmentStatus: {
        $in: ["pending", "failed"],
      },
      status: "successful",
    },
    {
      $set: {
        fulfillmentStatus: "processing",
        fulfillmentError: "",
      },
    },
    {
      new: true,
    },
  );

  if (!claimedPayment) {
    const currentPayment = await Payment.findById(payment._id);

    if (
      currentPayment?.fulfillmentStatus === "completed"
    ) {
      return {
        payment: currentPayment,
        enrollment: currentPayment.enrollment
          ? await Enrollment.findById(
              currentPayment.enrollment,
            )
          : null,
        alreadyFulfilled: true,
      };
    }

    throw new Error(
      "Payment fulfillment is currently being processed.",
    );
  }

  try {
    const course = await Course.findOne({
      _id: claimedPayment.course,
      isDeleted: false,
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    // ======================================
    // Find or create enrollment
    // ======================================

    let enrollment = await Enrollment.findOne({
      student: claimedPayment.student,
      course: claimedPayment.course,
      isDeleted: false,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: claimedPayment.student,
        course: claimedPayment.course,
        status: "active",
        progress: 0,
      });
    }

    // ======================================
    // Attach Enrollment
    // ======================================

    claimedPayment.enrollment = enrollment._id;

    // ======================================
    // Revenue Processing
    //
    // Your existing revenueService remains
    // responsible for the 60/40 split.
    // ======================================

    await processRevenue(claimedPayment);

    // ======================================
    // Mark Fulfilled
    // ======================================

    claimedPayment.fulfillmentStatus = "completed";

    claimedPayment.metadata = {
      ...claimedPayment.metadata,
      gatewayStatus: gatewayData?.status || "",
      gatewayChannel: gatewayData?.channel || "",
      gatewayPaidAt: gatewayData?.paid_at || null,
    };

    await claimedPayment.save();

    // ======================================
    // Notification
    // ======================================

    try {
      await createNotification({
        recipient: claimedPayment.student,
        type: "payment_success",
        title: "Payment Successful",
        message: `Your payment for "${course.title}" was successful. You now have access to this course.`,
        data: {
          payment: claimedPayment._id,
          course: course._id,
          enrollment: enrollment._id,
        },
      });
    } catch (notificationError) {
      // Notification failure must not make the
      // financial transaction look unsuccessful.
      console.error(
        "Payment notification error:",
        notificationError,
      );
    }

    await createAuditLog({
      actor: claimedPayment.student,
      actorRole: "student",
      action: "PAYMENT_VERIFIED",
      resource: "Payment",
      resourceId: claimedPayment._id,
      status: "success",
      statusCode: 200,
      description:
        "Payment verified and fulfillment completed.",
      metadata: {
        enrollmentId: enrollment._id.toString(),
        gateway: claimedPayment.gateway,
        gatewayReference:
          claimedPayment.gatewayReference,
        amount: claimedPayment.amount,
        currency: claimedPayment.currency,
      },
      ...requestContext,
    });

    return {
      payment: claimedPayment,
      enrollment,
      alreadyFulfilled: false,
    };
  } catch (error) {
    await Payment.findByIdAndUpdate(
      claimedPayment._id,
      {
        $set: {
          fulfillmentStatus: "failed",
          fulfillmentError: error.message,
        },
      },
    );

    throw error;
  }
};

// ======================================
// Verify Payment
// ======================================

const verifyPayment = async (
  reference,
  requestContext = {},
) => {
  reference = validateReference(reference);

  const payment = await Payment.findOne({
    reference,
    isDeleted: false,
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  // ======================================
  // Already completely fulfilled
  // ======================================

  if (
    payment.status === "successful" &&
    payment.fulfillmentStatus === "completed"
  ) {
    await createAuditLog({
      actor: payment.student,
      actorRole: "student",
      action: "PAYMENT_ALREADY_VERIFIED",
      resource: "Payment",
      resourceId: payment._id,
      status: "success",
      statusCode: 200,
      description:
        "Already fulfilled payment verification requested.",
      ...requestContext,
    });

    return {
      success: true,
      message: "Payment has already been verified.",
      data: {
        payment,
        enrollment: payment.enrollment
          ? await Enrollment.findById(payment.enrollment)
          : null,
        alreadyVerified: true,
      },
    };
  }

  // ======================================
  // Only Paystack verification supported
  // ======================================

  if (payment.gateway !== "paystack") {
    throw new Error(
      `Verification for gateway "${payment.gateway}" is not implemented.`,
    );
  }

  try {
    payment.verificationAttempts += 1;
    payment.lastVerifiedAt = new Date();

    await payment.save();

    // ======================================
    // Verify directly with Paystack
    // ======================================

    const gatewayData =
      await verifyPaystackTransaction(reference);

    // ======================================
    // Critical Reference Check
    // ======================================

    if (
      gatewayData.reference &&
      gatewayData.reference !== payment.reference
    ) {
      throw new Error(
        "Payment reference mismatch.",
      );
    }

    // ======================================
    // Critical Amount Check
    // ======================================

    const gatewayAmount = Number(gatewayData.amount);

    if (
      !Number.isSafeInteger(gatewayAmount) ||
      gatewayAmount !== payment.amount
    ) {
      throw new Error(
        "Payment amount does not match the expected amount.",
      );
    }

    // ======================================
    // Critical Currency Check
    // ======================================

    const gatewayCurrency = String(
      gatewayData.currency || "",
    ).toUpperCase();

    if (gatewayCurrency !== payment.currency) {
      throw new Error(
        "Payment currency does not match the expected currency.",
      );
    }

    // ======================================
    // Payment Status
    // ======================================

    if (gatewayData.status !== "success") {
      payment.status =
        gatewayData.status === "failed"
          ? "failed"
          : "pending";

      payment.gatewayReference =
        gatewayData.reference || payment.gatewayReference;

      payment.paymentMethod =
        gatewayData.channel || payment.paymentMethod;

      payment.metadata = {
        ...payment.metadata,
        gatewayStatus: gatewayData.status,
        gatewayResponse:
          gatewayData.gateway_response || "",
      };

      await payment.save();

      await createAuditLog({
        actor: payment.student,
        actorRole: "student",
        action: "PAYMENT_FAILED",
        resource: "Payment",
        resourceId: payment._id,
        status: "failed",
        statusCode: 400,
        description:
          "Payment gateway verification did not return success.",
        metadata: {
          gatewayStatus: gatewayData.status,
          gatewayResponse:
            gatewayData.gateway_response || "",
        },
        ...requestContext,
      });

      throw new Error(
        `Payment is not successful. Gateway status: ${gatewayData.status}.`,
      );
    }

    // ======================================
    // Mark successful
    // ======================================

    payment.status = "successful";

    payment.gatewayReference =
      gatewayData.reference || payment.gatewayReference;

    payment.gatewayTransactionId = gatewayData.id
      ? String(gatewayData.id)
      : payment.gatewayTransactionId;

    payment.paymentMethod =
      gatewayData.channel || payment.paymentMethod;

    payment.paidAt = gatewayData.paid_at
      ? new Date(gatewayData.paid_at)
      : new Date();

    payment.metadata = {
      ...payment.metadata,
      gatewayStatus: gatewayData.status,
      gatewayResponse:
        gatewayData.gateway_response || "",
      gatewayTransactionId: gatewayData.id || null,
    };

    await payment.save();

    // ======================================
    // Fulfill
    // ======================================

    const fulfillment = await fulfillSuccessfulPayment(
      payment,
      gatewayData,
      requestContext,
    );

    return {
      success: true,
      message: "Payment verified successfully.",
      data: fulfillment,
    };
  } catch (error) {
    await createAuditLog({
      actor: payment.student,
      actorRole: "student",
      action: "PAYMENT_FAILED",
      resource: "Payment",
      resourceId: payment._id,
      status: "failed",
      statusCode: 400,
      description: "Payment verification failed.",
      errorMessage: error.message,
      metadata: {
        gateway: payment.gateway,
        reference: payment.reference,
      },
      ...requestContext,
    });

    throw error;
  }
};

// ======================================
// Paystack Webhook
// ======================================

const handlePaystackWebhook = async (
  payload,
  signature,
  requestContext = {},
) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid webhook payload.");
  }

  if (!signature) {
    throw new Error("Webhook signature is required.");
  }

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key is not configured.");
  }

  // Signature verification must be performed
  // against the raw request body by the controller.
  // This function expects the verified payload.
  const event = payload.event;
  const data = payload.data;

  if (event !== "charge.success") {
    return {
      success: true,
      ignored: true,
      message: `Webhook event "${event}" ignored.`,
    };
  }

  if (!data?.reference) {
    throw new Error(
      "Webhook payment reference is missing.",
    );
  }

  // Reuse the same verification path.
  //
  // Never trust webhook payload alone for financial
  // fulfillment. We still verify with Paystack.
  return await verifyPayment(
    data.reference,
    requestContext,
  );
};

// ======================================
// Get Payment By Reference
// ======================================

const getPaymentByReference = async (
  reference,
  requesterId,
  requesterRoles = [],
) => {
  reference = validateReference(reference);

  const isPrivileged =
    requesterRoles.includes("admin") ||
    requesterRoles.includes("tutor");

  const filter = {
    reference,
    isDeleted: false,
  };

  // Students can only retrieve their own payment.
  if (!isPrivileged) {
    filter.student = requesterId;
  }

  const payment = await Payment.findOne(filter)
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
    .populate("enrollment")
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
  handlePaystackWebhook,
  getPaymentByReference,
  getStudentPayments,
};