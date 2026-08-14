const {
  createConversation,
  getMyConversations,
  getConversationById,
  deleteConversation,
} = require("../services/conversationService");

// ======================================
// Create Conversation
// POST /api/conversations
// ======================================
const createNewConversation = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await createConversation(req.body || {}, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Conversation Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to create conversation.",
    });
  }
};

// ======================================
// Get My Conversations
// GET /api/conversations
// ======================================
const getConversations = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await getMyConversations(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to retrieve conversations.",
    });
  }
};

// ======================================
// Get Conversation By ID
// GET /api/conversations/:id
// ======================================
const getConversation = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const result = await getConversationById(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Conversation Error:", error);

    const statusCode = error.message === "Conversation not found." ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to retrieve conversation.",
    });
  }
};

// ======================================
// Delete Conversation
// DELETE /api/conversations/:id
// ======================================
const removeConversation = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const result = await deleteConversation(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Conversation Error:", error);

    const statusCode =
      error.message === "Conversation not found."
        ? 404
        : error.message.includes("owner")
          ? 403
          : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to delete conversation.",
    });
  }
};

module.exports = {
  createNewConversation,
  getConversations,
  getConversation,
  removeConversation,
};
