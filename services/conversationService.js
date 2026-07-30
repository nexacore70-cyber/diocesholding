const Conversation = require("../models/Conversation");
const Course = require("../models/Course");

// ======================================
// Create Conversation
// ======================================
const createConversation = async (data, userId) => {
  const {
    type,
    name,
    description,
    image,
    members = [],
    course,
    liveClass,
    allowMemberMessages,
    allowMemberInvite,
    onlyAdminsCanPost,
  } = data;

  // -----------------------------
  // Validate direct conversation
  // -----------------------------
  if (type === "direct") {
    if (members.length !== 1) {
      throw new Error(
        "Direct conversation must contain exactly one recipient.",
      );
    }

    const existingConversation = await Conversation.findOne({
      type: "direct",
      "members.user": {
        $all: [userId, members[0]],
      },
    });

    if (existingConversation) {
      return {
        success: true,
        message: "Conversation already exists.",
        data: existingConversation,
      };
    }
  }

  // -----------------------------
  // Validate course conversation
  // -----------------------------
  if (type === "course") {
    if (!course) {
      throw new Error("Course is required.");
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      throw new Error("Course not found.");
    }
  }

  // -----------------------------
  // Build Members
  // -----------------------------
  const conversationMembers = [];

  conversationMembers.push({
    user: userId,
    role: "owner",
  });

  members.forEach((memberId) => {
    if (memberId.toString() !== userId.toString()) {
      conversationMembers.push({
        user: memberId,
        role: "member",
      });
    }
  });

  // -----------------------------
  // Create Conversation
  // -----------------------------
  const conversation = await Conversation.create({
    type,
    name,
    description,
    image,
    createdBy: userId,
    members: conversationMembers,
    course: course || null,
    liveClass: liveClass || null,
    allowMemberMessages:
      allowMemberMessages !== undefined ? allowMemberMessages : true,
    allowMemberInvite:
      allowMemberInvite !== undefined ? allowMemberInvite : false,
    onlyAdminsCanPost:
      onlyAdminsCanPost !== undefined ? onlyAdminsCanPost : false,
  });

  await conversation.populate(
    "members.user",
    "firstName lastName email avatar",
  );

  return {
    success: true,
    message: "Conversation created successfully.",
    data: conversation,
  };
};

// ======================================
// Get My Conversations
// ======================================
const getMyConversations = async (userId) => {
  const conversations = await Conversation.find({
    "members.user": userId,
    isDeleted: false,
  })
    .populate("members.user", "firstName lastName avatar")
    .populate("lastMessage")
    .sort({
      lastMessageAt: -1,
      updatedAt: -1,
    });

  return {
    success: true,
    message: "Conversations retrieved successfully.",
    data: conversations,
  };
};

// ======================================
// Get Conversation By ID
// ======================================
const getConversationById = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    "members.user": userId,
    isDeleted: false,
  })
    .populate("members.user", "firstName lastName email avatar")
    .populate("lastMessage");

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  return {
    success: true,
    message: "Conversation retrieved successfully.",
    data: conversation,
  };
};

// ======================================
// Delete Conversation
// ======================================
const deleteConversation = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  if (conversation.createdBy.toString() !== userId.toString()) {
    throw new Error("Only the conversation owner can delete it.");
  }

  conversation.isDeleted = true;
  conversation.status = "deleted";

  await conversation.save();

  return {
    success: true,
    message: "Conversation deleted successfully.",
  };
};

module.exports = {
  createConversation,
  getMyConversations,
  getConversationById,
  deleteConversation,
};
