const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getIO } = require("../config/socket");

// ======================================
// Send Message
// ======================================
const sendMessage = async (conversationId, senderId, messageData) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation || conversation.isDeleted) {
    throw new Error("Conversation not found.");
  }

  // Ensure sender belongs to the conversation
  const member = conversation.members.find(
    (m) => m.user.toString() === senderId.toString(),
  );

  if (!member) {
    throw new Error("You are not a member of this conversation.");
  }

  // Announcement channels
  if (
    conversation.onlyAdminsCanPost &&
    !["owner", "admin"].includes(member.role)
  ) {
    throw new Error("Only admins can send messages in this conversation.");
  }

  const hasContent =
    (messageData.text && messageData.text.trim() !== "") ||
    (messageData.attachments && messageData.attachments.length > 0);

  if (!hasContent) {
    throw new Error("Message must contain text or attachment.");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    type: messageData.type || "text",
    text: messageData.text || "",
    attachments: messageData.attachments || [],
    replyTo: messageData.replyTo || null,
    forwardedFrom: messageData.forwardedFrom || null,
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();

  await conversation.save();

  await message.populate("sender", "firstName lastName avatar");

  // ======================================
  // Real-Time Event
  // ======================================
  const io = getIO();

  // Send to everyone in the conversation room
  io.to(conversationId.toString()).emit("new-message", message);

  return {
    success: true,
    message: "Message sent successfully.",
    data: message,
  };
};

// ======================================
// Get Conversation Messages
// ======================================
const getConversationMessages = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  const member = conversation.members.find(
    (m) => m.user.toString() === userId.toString(),
  );

  if (!member) {
    throw new Error("You are not a member of this conversation.");
  }

  const messages = await Message.find({
    conversation: conversationId,
    deletedForEveryone: false,
    deletedFor: {
      $ne: userId,
    },
  })
    .populate("sender", "firstName lastName avatar")
    .populate("replyTo", "text sender type")
    .sort({
      createdAt: 1,
    });

  return {
    success: true,
    message: "Messages retrieved successfully.",
    data: messages,
  };
};

// ======================================
// Edit Message
// ======================================
const editMessage = async (messageId, userId, text) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new Error("You can only edit your own messages.");
  }

  if (message.deletedForEveryone) {
    throw new Error("Message has been deleted.");
  }

  message.text = text;
  message.edited = true;
  message.editedAt = new Date();

  await message.save();

  // ======================================
  // Real-Time Edit
  // ======================================
  const io = getIO();

  io.to(message.conversation.toString()).emit("message-edited", message);

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
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  if (!message.deletedFor.some((id) => id.toString() === userId.toString())) {
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
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new Error("Only the sender can delete this message for everyone.");
  }

  message.deletedForEveryone = true;
  message.text = "This message was deleted.";
  message.attachments = [];

  await message.save();

  // ======================================
  // Real-Time Delete
  // ======================================
  const io = getIO();

  io.to(message.conversation.toString()).emit("message-deleted", {
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
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  const existingReaction = message.reactions.find(
    (reaction) => reaction.user.toString() === userId.toString(),
  );

  if (existingReaction) {
    existingReaction.emoji = emoji;
  } else {
    message.reactions.push({
      user: userId,
      emoji,
    });
  }

  await message.save();

  // ======================================
  // Real-Time Reaction
  // ======================================
  const io = getIO();

  io.to(message.conversation.toString()).emit("message-reaction", message);

  return {
    success: true,
    message: "Reaction updated successfully.",
    data: message,
  };
};

// ======================================
// Pin / Unpin Message
// ======================================
const togglePinMessage = async (messageId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  message.pinned = !message.pinned;

  await message.save();

  // ======================================
  // Real-Time Pin
  // ======================================
  const io = getIO();

  io.to(message.conversation.toString()).emit("message-pinned", message);

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
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  const alreadyDelivered = message.deliveredTo.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (!alreadyDelivered) {
    message.deliveredTo.push({
      user: userId,
      deliveredAt: new Date(),
    });
  }

  await message.save();

  // ======================================
  // Real-Time Delivery Receipt
  // ======================================
  const io = getIO();

  io.to(message.conversation.toString()).emit("message-delivered", {
    messageId: message._id,
    userId,
    deliveredAt: new Date(),
  });

  return {
    success: true,
    message: "Message delivered.",
  };
};

// ======================================
// Mark As Read
// ======================================
const markMessageRead = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found.");
  }

  const alreadyRead = message.readBy.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (!alreadyRead) {
    message.readBy.push({
      user: userId,
      readAt: new Date(),
    });
  }

  await message.save();

  // ======================================
  // Real-Time Read Receipt
  // ======================================
  const io = getIO();

  io.to(message.conversation.toString()).emit("message-read", {
    messageId: message._id,
    userId,
    readAt: new Date(),
  });

  return {
    success: true,
    message: "Message marked as read.",
  };
};

// ======================================
// Forward Message
// ======================================
const forwardMessage = async (messageId, conversationId, senderId) => {
  const originalMessage = await Message.findById(messageId);

  if (!originalMessage) {
    throw new Error("Original message not found.");
  }

  return sendMessage(conversationId, senderId, {
    type: originalMessage.type,
    text: originalMessage.text,
    attachments: originalMessage.attachments,
    forwardedFrom: originalMessage._id,
  });
};

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
