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
    const result = await createConversation(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Conversation Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get My Conversations
// GET /api/conversations
// ======================================
const getConversations = async (req, res) => {
  try {
    const result = await getMyConversations(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Conversation By ID
// GET /api/conversations/:id
// ======================================
const getConversation = async (req, res) => {
  try {
    const result = await getConversationById(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Conversation Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Conversation
// DELETE /api/conversations/:id
// ======================================
const removeConversation = async (req, res) => {
  try {
    const result = await deleteConversation(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Conversation Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewConversation,
  getConversations,
  getConversation,
  removeConversation,
};
