const crypto = require("crypto");

const {
  initializePayment,
  verifyPayment,
  handlePaystackWebhook,
  getPaymentByReference,
  getStudentPayments,
} = require("../services/paymentService");

// ======================================
// Request Context
// ======================================

const getRequestContext = (req) => ({
  ipAddress:
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "",

  userAgent:
    req.headers["user-agent"] || "",

  requestId:
    req.id ||
    req.headers["x-request-id"] ||
    "",
});

// ======================================
// Initialize Payment
// POST /api/payments/initialize
// @access Student
// ======================================

const initializeStudentPayment = async (req, res) => {
  try {
    const { courseId, gateway = "paystack" } =
      req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const result = await initializePayment(
      req.user._id,
      courseId,
      gateway,
      getRequestContext(req),
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error(
      "Initialize Payment Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Verify Payment
// PATCH /api/payments/verify/:reference
// @access Student
// ======================================

const verifyStudentPayment = async (req, res) => {
  try {
    const result = await verifyPayment(
      req.params.reference,
      getRequestContext(req),
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Paystack Webhook
// POST /api/payments/webhook/paystack
// @access Public
// ======================================

const paystackWebhook = async (req, res) => {
  try {
    const signature =
      req.headers["x-paystack-signature"];

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: "Missing webhook signature.",
      });
    }

    const secret =
      process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error(
        "PAYSTACK_SECRET_KEY is not configured.",
      );

      return res.status(500).json({
        success: false,
        message: "Payment gateway is not configured.",
      });
    }

    // ======================================
    // Raw body is required here.
    // ======================================

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from("");

    const expectedSignature =
      crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");

    const receivedBuffer = Buffer.from(
      String(signature),
      "utf8",
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8",
    );

    if (
      receivedBuffer.length !==
        expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer,
      )
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    let payload;

    try {
      payload = JSON.parse(
        rawBody.toString("utf8"),
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook payload.",
      });
    }

    const result = await handlePaystackWebhook(
      payload,
      signature,
      getRequestContext(req),
    );

    // Paystack only needs acknowledgement.
    return res.status(200).json({
      success: true,
      message: "Webhook received.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Paystack Webhook Error:",
      error,
    );

    // Return 200 for already-known/processed
    // payment states where appropriate, but
    // return 500 here so Paystack can retry
    // genuinely failed processing.
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
};

// ======================================
// Get Payment By Reference
// GET /api/payments/:reference
// @access Student / Tutor / Admin
// ======================================

const getPayment = async (req, res) => {
  try {
    const roles = Array.isArray(req.user?.roles)
      ? req.user.roles
      : req.user?.role
        ? [req.user.role]
        : [];

    const result = await getPaymentByReference(
      req.params.reference,
      req.user._id,
      roles,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Payment Error:",
      error,
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Payments
// GET /api/payments/my-payments
// @access Student
// ======================================

const getMyPayments = async (req, res) => {
  try {
    const result = await getStudentPayments(
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get My Payments Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  initializeStudentPayment,
  verifyStudentPayment,
  paystackWebhook,
  getPayment,
  getMyPayments,
};