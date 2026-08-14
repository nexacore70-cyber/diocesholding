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
// Helpers
// ======================================

const getUserId = (req) => {
  if (!req.user || !req.user._id) {
    throw new Error("Authenticated user not found.");
  }

  return req.user._id;
};

const isValidText = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const sendControllerError = (res, error, defaultStatus = 400) => {
  console.error("Message Controller Error:", error);

  return res.status(defaultStatus).json({
    success: false,
    message: error.message || "Something went wrong.",
  });
};

// ======================================
// Send Message
// POST /api/messages/:conversationId
// ======================================
const sendNewMessage = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const { type, text, attachments, replyTo, forwardedFrom } = req.body || {};

    if (
      !isValidText(text) &&
      (!Array.isArray(attachments) || attachments.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Message must contain text or attachment.",
      });
    }

    const result = await sendMessage(conversationId, userId, {
      type,
      text: typeof text === "string" ? text.trim() : "",
      attachments: Array.isArray(attachments) ? attachments : [],
      replyTo: replyTo || null,
      forwardedFrom: forwardedFrom || null,
    });

    return res.status(201).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Get Conversation Messages
// GET /api/messages/:conversationId
// ======================================
const getMessages = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const result = await getConversationMessages(conversationId, userId);

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Edit Message
// PATCH /api/messages/:id
// ======================================
const updateMessage = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { text } = req.body || {};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    if (!isValidText(text)) {
      return res.status(400).json({
        success: false,
        message: "Message text is required.",
      });
    }

    const result = await editMessage(id, userId, text.trim());

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Delete Message For Me
// DELETE /api/messages/:id/me
// ======================================
const removeMessageForMe = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    const result = await deleteMessageForMe(id, userId);

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Delete Message For Everyone
// DELETE /api/messages/:id/everyone
// ======================================
const removeMessageForEveryone = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    const result = await deleteMessageForEveryone(id, userId);

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// React To Message
// PATCH /api/messages/:id/react
// ======================================
const reactMessage = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { emoji } = req.body || {};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    if (!isValidText(emoji)) {
      return res.status(400).json({
        success: false,
        message: "Emoji is required.",
      });
    }

    const result = await reactToMessage(id, userId, emoji.trim());

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Pin / Unpin Message
// PATCH /api/messages/:id/pin
// ======================================
const pinMessage = async (req, res) => {
  try {
    getUserId(req);

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    const result = await togglePinMessage(id);

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Mark Message Delivered
// PATCH /api/messages/:id/delivered
// ======================================
const deliverMessage = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    const result = await markMessageDelivered(id, userId);

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Mark Message Read
// PATCH /api/messages/:id/read
// ======================================
const readMessage = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    const result = await markMessageRead(id, userId);

    return res.status(200).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Forward Message
// POST /api/messages/:id/forward/:conversationId
// ======================================
const forwardExistingMessage = async (req, res) => {
  try {
    const userId = getUserId(req);

    const { id, conversationId } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Destination conversation ID is required.",
      });
    }

    const result = await forwardMessage(id, conversationId, userId);

    return res.status(201).json(result);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

// ======================================
// Exports
// ======================================

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
