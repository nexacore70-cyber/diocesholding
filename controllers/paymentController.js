const {
  initializePayment,
  verifyPayment,
  getPaymentByReference,
  getStudentPayments,
} = require("../services/paymentService");

// ======================================
// Initialize Payment
// POST /api/payments/initialize
// ======================================
const initializeStudentPayment = async (req, res) => {
  try {
    const { courseId, gateway } = req.body;

    const result = await initializePayment(
      req.user._id,
      courseId,
      gateway
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Initialize Payment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Verify Payment
// PATCH /api/payments/verify/:reference
// ======================================
const verifyStudentPayment = async (req, res) => {
  try {
    const { gatewayReference } = req.body;

    console.log("Request Body:", req.body);
    console.log("Gateway Reference:", gatewayReference);

    const result = await verifyPayment(
      req.params.reference,
      gatewayReference
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Payment By Reference
// GET /api/payments/:reference
// ======================================
const getPayment = async (req, res) => {
  try {
    const result = await getPaymentByReference(
      req.params.reference
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Payment Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Payments
// GET /api/payments/my-payments
// ======================================
const getMyPayments = async (req, res) => {
  try {
    const result = await getStudentPayments(
      req.user._id
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get My Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  initializeStudentPayment,
  verifyStudentPayment,
  getPayment,
  getMyPayments,
};