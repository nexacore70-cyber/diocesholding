const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getIO } = require("../config/socket");

// ======================================
// Constants
// ======================================

const MAX_MESSAGE_LENGTH = 10000;
const MAX_PAGE_LIMIT = 100;

const ALLOWED_MESSAGE_TYPES = [
  "text",
  "image",
  "video",
  "audio",
  "voice",
  "document",
  "file",
  "link",
  "system",
];

const ADMIN_ROLES = ["owner", "admin"];

// ======================================
// Socket Helper
// ======================================
// Socket failures should not make a successful
// database operation fail.

const emitToConversation = (conversationId, event, data) => {
  try {
    const io = getIO();

    if (!io) {
      console.warn("Socket.IO is not initialized.");
      return;
    }

    io.to(conversationId.toString()).emit(event, data);
  } catch (error) {
    console.error(`Socket.IO ${event} Error:`, error.message);
  }
};

// ======================================
// Validate ObjectId
// ======================================

const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(id?.toString());
};

// ======================================
// Get Conversation + Membership
// ======================================

const getConversationMember = async (conversationId, userId) => {
  if (!isValidObjectId(conversationId)) {
    throw new Error("Invalid conversation ID.");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation || conversation.isDeleted) {
    throw new Error("Conversation not found.");
  }

  const member = conversation.members.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (!member) {
    throw new Error("You are not a member of this conversation.");
  }

  return {
    conversation,
    member,
  };
};

// ======================================
// Get Message + Authorization
// ======================================

const getMessageWithAccess = async (messageId, userId) => {
  if (!isValidObjectId(messageId)) {
    throw new Error("Invalid message ID.");
  }

  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  const { conversation, member } = await getConversationMember(
    message.conversation,
    userId,
  );

  return {
    message,
    conversation,
    member,
  };
};

// ======================================
// Validate Message Type
// ======================================

const validateMessageType = (type) => {
  if (!ALLOWED_MESSAGE_TYPES.includes(type)) {
    throw new Error("Invalid message type.");
  }
};

// ======================================
// Validate Message Content
// ======================================

const validateMessageContent = (messageData = {}) => {
  const text =
    typeof messageData.text === "string" ? messageData.text.trim() : "";

  const attachments = Array.isArray(messageData.attachments)
    ? messageData.attachments
    : [];

  if (!text && attachments.length === 0) {
    throw new Error("Message must contain text or attachment.");
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`);
  }
};

// ======================================
// Send Message
// ======================================

const sendMessage = async (conversationId, senderId, messageData = {}) => {
  const { conversation, member } = await getConversationMember(
    conversationId,
    senderId,
  );

  const type = messageData.type || "text";

  validateMessageType(type);
  validateMessageContent(messageData);

  // Announcement channels
  if (conversation.onlyAdminsCanPost && !ADMIN_ROLES.includes(member.role)) {
    throw new Error("Only admins can send messages in this conversation.");
  }

  // Validate reply message
  if (messageData.replyTo) {
    const replyMessage = await Message.findById(messageData.replyTo);

    if (!replyMessage) {
      throw new Error("Reply message not found.");
    }

    if (replyMessage.conversation.toString() !== conversationId.toString()) {
      throw new Error(
        "You cannot reply to a message from another conversation.",
      );
    }

    if (replyMessage.deletedForEveryone) {
      throw new Error("Cannot reply to a deleted message.");
    }
  }

  // Validate forwarded message
  if (messageData.forwardedFrom) {
    const forwardedMessage = await Message.findById(messageData.forwardedFrom);

    if (!forwardedMessage) {
      throw new Error("Forwarded message not found.");
    }
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    type,
    text: typeof messageData.text === "string" ? messageData.text.trim() : "",
    attachments: Array.isArray(messageData.attachments)
      ? messageData.attachments
      : [],
    replyTo: messageData.replyTo || null,
    forwardedFrom: messageData.forwardedFrom || null,
    status: "sent",
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();

  await conversation.save();

  await message.populate("sender", "firstName lastName avatar");

  emitToConversation(conversationId, "new-message", message);

  return {
    success: true,
    message: "Message sent successfully.",
    data: message,
  };
};

// ======================================
// Get Conversation Messages
// ======================================

const getConversationMessages = async (
  conversationId,
  userId,
  page = 1,
  limit = 50,
) => {
  await getConversationMember(conversationId, userId);

  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 50, 1), MAX_PAGE_LIMIT);

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversation: conversationId,

    $and: [
      {
        $or: [
          { deletedForEveryone: false },
          { deletedForEveryone: { $exists: false } },
        ],
      },
      {
        deletedFor: {
          $ne: userId,
        },
      },
    ],
  })
    .populate("sender", "firstName lastName avatar")
    .populate("replyTo", "text sender type deletedForEveryone")
    .populate("forwardedFrom", "text sender type")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    success: true,
    message: "Messages retrieved successfully.",
    data: messages.reverse(),
    pagination: {
      page,
      limit,
      count: messages.length,
    },
  };
};

// ======================================
// Edit Message
// ======================================

const editMessage = async (messageId, userId, text) => {
  const { message } = await getMessageWithAccess(messageId, userId);

  if (message.sender.toString() !== userId.toString()) {
    throw new Error("You can only edit your own messages.");
  }

  if (message.deletedForEveryone) {
    throw new Error("Message has been deleted.");
  }

  if (message.type !== "text") {
    throw new Error("Only text messages can be edited.");
  }

  if (!text || !text.trim()) {
    throw new Error("Message text cannot be empty.");
  }

  if (text.trim().length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`);
  }

  message.text = text.trim();
  message.edited = true;
  message.editedAt = new Date();

  await message.save();

  emitToConversation(message.conversation, "message-edited", message);

  return {
    success: true,
    message: "Message updated successfully.",
    data: message,
  };
};

// ======================================
// Delete Message For Me
// ======================================

const deleteMessageForMe = async (messageId, userId) => {
  const { message } = await getMessageWithAccess(messageId, userId);

  const alreadyDeleted = message.deletedFor.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!alreadyDeleted) {
    message.deletedFor.push(userId);
    await message.save();
  }

  return {
    success: true,
    message: "Message deleted for you.",
  };
};

// ======================================
// Delete Message For Everyone
// ======================================

const deleteMessageForEveryone = async (messageId, userId) => {
  const { message } = await getMessageWithAccess(messageId, userId);

  if (message.sender.toString() !== userId.toString()) {
    throw new Error("Only the sender can delete this message for everyone.");
  }

  if (message.deletedForEveryone) {
    throw new Error("Message has already been deleted.");
  }

  message.deletedForEveryone = true;
  message.text = "This message was deleted.";
  message.attachments = [];

  await message.save();

  emitToConversation(message.conversation, "message-deleted", {
    messageId: message._id,
  });

  return {
    success: true,
    message: "Message deleted for everyone.",
  };
};

// ======================================
// React To Message
// ======================================

const reactToMessage = async (messageId, userId, emoji) => {
  const { message } = await getMessageWithAccess(messageId, userId);

  if (message.deletedForEveryone) {
    throw new Error("Cannot react to a deleted message.");
  }

  if (!emoji || !emoji.trim()) {
    throw new Error("Reaction emoji is required.");
  }

  const cleanEmoji = emoji.trim();

  if (cleanEmoji.length > 20) {
    throw new Error("Reaction is too long.");
  }

  const existingReaction = message.reactions.find(
    (reaction) => reaction.user.toString() === userId.toString(),
  );

  if (existingReaction) {
    existingReaction.emoji = cleanEmoji;
  } else {
    message.reactions.push({
      user: userId,
      emoji: cleanEmoji,
    });
  }

  await message.save();

  emitToConversation(message.conversation, "message-reaction", message);

  return {
    success: true,
    message: "Reaction updated successfully.",
    data: message,
  };
};

// ======================================
// Pin / Unpin Message
// ======================================

const togglePinMessage = async (messageId, userId) => {
  const { message, member } = await getMessageWithAccess(messageId, userId);

  if (message.deletedForEveryone) {
    throw new Error("Cannot pin a deleted message.");
  }

  if (!ADMIN_ROLES.includes(member.role)) {
    throw new Error("Only conversation admins can pin or unpin messages.");
  }

  message.pinned = !message.pinned;

  await message.save();

  emitToConversation(message.conversation, "message-pinned", message);

  return {
    success: true,
    message: message.pinned
      ? "Message pinned successfully."
      : "Message unpinned successfully.",
    data: message,
  };
};

// ======================================
// Mark As Delivered
// ======================================

const markMessageDelivered = async (messageId, userId) => {
  const { message } = await getMessageWithAccess(messageId, userId);

  // Sender doesn't need delivery receipt
  if (message.sender.toString() === userId.toString()) {
    return {
      success: true,
      message: "Message already belongs to sender.",
    };
  }

  const alreadyDelivered = message.deliveredTo.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (!alreadyDelivered) {
    const deliveredAt = new Date();

    message.deliveredTo.push({
      user: userId,
      deliveredAt,
    });

    await message.save();

    emitToConversation(message.conversation, "message-delivered", {
      messageId: message._id,
      userId,
      deliveredAt,
    });
  }

  return {
    success: true,
    message: "Message delivered.",
  };
};

// ======================================
// Mark As Read
// ======================================

const markMessageRead = async (messageId, userId) => {
  const { message } = await getMessageWithAccess(messageId, userId);

  const alreadyRead = message.readBy.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (!alreadyRead) {
    const readAt = new Date();

    message.readBy.push({
      user: userId,
      readAt,
    });

    await message.save();

    emitToConversation(message.conversation, "message-read", {
      messageId: message._id,
      userId,
      readAt,
    });
  }

  return {
    success: true,
    message: "Message marked as read.",
  };
};

// ======================================
// Forward Message
// ======================================

const forwardMessage = async (
  messageId,
  destinationConversationId,
  senderId,
) => {
  if (!isValidObjectId(messageId)) {
    throw new Error("Invalid message ID.");
  }

  if (!isValidObjectId(destinationConversationId)) {
    throw new Error("Invalid destination conversation ID.");
  }

  const originalMessage = await Message.findById(messageId);

  if (!originalMessage) {
    throw new Error("Original message not found.");
  }

  if (originalMessage.deletedForEveryone) {
    throw new Error("Deleted messages cannot be forwarded.");
  }

  // Verify source conversation membership
  await getConversationMember(originalMessage.conversation, senderId);

  // Verify destination membership
  const { conversation: destinationConversation } = await getConversationMember(
    destinationConversationId,
    senderId,
  );

  const forwardedMessage = await Message.create({
    conversation: destinationConversation._id,
    sender: senderId,
    type: originalMessage.type,
    text: originalMessage.text || "",
    attachments: originalMessage.attachments || [],
    forwardedFrom: originalMessage._id,
    status: "sent",
  });

  destinationConversation.lastMessage = forwardedMessage._id;

  destinationConversation.lastMessageAt = new Date();

  await destinationConversation.save();

  await forwardedMessage.populate("sender", "firstName lastName avatar");

  emitToConversation(
    destinationConversation._id,
    "new-message",
    forwardedMessage,
  );

  return {
    success: true,
    message: "Message forwarded successfully.",
    data: forwardedMessage,
  };
};

// ======================================
// Export
// ======================================

module.exports = {
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
};
