const {
  sendMessage,
  getConversationMessages,
  editMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  reactToMessage,
  togglePinMessage,
  markMessageDelivered,
  markMessageRead,
  forwardMessage,
} = require("../services/messageService");

// ======================================
// Send Message
// POST /api/messages/:conversationId
// ======================================
const sendNewMessage = async (req, res) => {
  try {
    const result = await sendMessage(
      req.params.conversationId,
      req.user._id,
      req.body,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Conversation Messages
// GET /api/messages/:conversationId
// ======================================
const getMessages = async (req, res) => {
  try {
    const result = await getConversationMessages(
      req.params.conversationId,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Edit Message
// PATCH /api/messages/:id
// ======================================
const updateMessage = async (req, res) => {
  try {
    const result = await editMessage(
      req.params.id,
      req.user._id,
      req.body.text,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Edit Message Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Message For Me
// DELETE /api/messages/:id/me
// ======================================
const removeMessageForMe = async (req, res) => {
  try {
    const result = await deleteMessageForMe(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete For Me Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Message For Everyone
// DELETE /api/messages/:id/everyone
// ======================================
const removeMessageForEveryone = async (req, res) => {
  try {
    const result = await deleteMessageForEveryone(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete For Everyone Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// React To Message
// PATCH /api/messages/:id/react
// ======================================
const reactMessage = async (req, res) => {
  try {
    const result = await reactToMessage(
      req.params.id,
      req.user._id,
      req.body.emoji,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Reaction Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Pin / Unpin Message
// PATCH /api/messages/:id/pin
// ======================================
const pinMessage = async (req, res) => {
  try {
    const result = await togglePinMessage(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Pin Message Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Delivered
// PATCH /api/messages/:id/delivered
// ======================================
const deliverMessage = async (req, res) => {
  try {
    const result = await markMessageDelivered(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delivered Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Read
// PATCH /api/messages/:id/read
// ======================================
const readMessage = async (req, res) => {
  try {
    const result = await markMessageRead(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Read Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Forward Message
// POST /api/messages/:id/forward/:conversationId
// ======================================
const forwardExistingMessage = async (req, res) => {
  try {
    const result = await forwardMessage(
      req.params.id,
      req.params.conversationId,
      req.user._id,
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Forward Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendNewMessage,
  getMessages,
  updateMessage,
  removeMessageForMe,
  removeMessageForEveryone,
  reactMessage,
  pinMessage,
  deliverMessage,
  readMessage,
  forwardExistingMessage,
};
