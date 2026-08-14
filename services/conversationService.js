const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Course = require("../models/Course");
const User = require("../models/User");

// ======================================
// Helpers
// ======================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeMemberIds = (members = []) => {
  if (!Array.isArray(members)) {
    throw new Error("Members must be an array.");
  }

  const uniqueMembers = [
    ...new Set(members.filter(Boolean).map((member) => member.toString())),
  ];

  return uniqueMembers;
};

const ensureUserExists = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID.");
  }

  const user = await User.findById(userId).select("_id isActive status");

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.isActive || user.status !== "active") {
    throw new Error("User account is inactive.");
  }

  return user;
};

const ensureConversationAccess = async (conversationId, userId) => {
  if (!isValidObjectId(conversationId)) {
    throw new Error("Invalid conversation ID.");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    "members.user": userId,
    isDeleted: false,
  });

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  return conversation;
};

// ======================================
// Create Conversation
// ======================================

const createConversation = async (data = {}, userId) => {
  if (!userId) {
    throw new Error("Authenticated user is required.");
  }

  await ensureUserExists(userId);

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

  const allowedTypes = ["direct", "group", "course", "announcement"];

  if (!type || !allowedTypes.includes(type)) {
    throw new Error("Invalid conversation type.");
  }

  // ======================================
  // Normalize Members
  // ======================================

  const memberIds = normalizeMemberIds(members);

  // Prevent invalid IDs
  for (const memberId of memberIds) {
    if (!isValidObjectId(memberId)) {
      throw new Error("One or more member IDs are invalid.");
    }
  }

  // Prevent adding nonexistent/inactive users
  if (memberIds.length > 0) {
    const activeUsers = await User.find({
      _id: { $in: memberIds },
      isActive: true,
      status: "active",
    }).select("_id");

    if (activeUsers.length !== memberIds.length) {
      throw new Error(
        "One or more selected members do not exist or are inactive.",
      );
    }
  }

  // ======================================
  // Direct Conversation
  // ======================================

  if (type === "direct") {
    if (memberIds.length !== 1) {
      throw new Error(
        "Direct conversation must contain exactly one recipient.",
      );
    }

    const recipientId = memberIds[0];

    if (recipientId.toString() === userId.toString()) {
      throw new Error("You cannot create a direct conversation with yourself.");
    }

    // A direct conversation must contain exactly these two users.
    const existingConversation = await Conversation.findOne({
      type: "direct",
      isDeleted: false,
      "members.user": {
        $all: [userId, recipientId],
      },
    });

    if (existingConversation && existingConversation.members.length === 2) {
      await existingConversation.populate([
        {
          path: "members.user",
          select: "firstName lastName email avatar",
        },
        {
          path: "lastMessage",
        },
      ]);

      return {
        success: true,
        message: "Conversation already exists.",
        data: existingConversation,
      };
    }
  }

  // ======================================
  // Course Conversation
  // ======================================

  if (type === "course") {
    if (!course) {
      throw new Error("Course is required.");
    }

    if (!isValidObjectId(course)) {
      throw new Error("Invalid course ID.");
    }

    const existingCourse = await Course.findById(course).select("_id tutor");

    if (!existingCourse) {
      throw new Error("Course not found.");
    }
  }

  // ======================================
  // Group / Announcement Validation
  // ======================================

  if (["group", "announcement"].includes(type) && memberIds.length === 0) {
    throw new Error("At least one member is required.");
  }

  // ======================================
  // Build Members
  // ======================================

  const conversationMembers = [
    {
      user: userId,
      role: "owner",
    },
  ];

  for (const memberId of memberIds) {
    if (memberId.toString() !== userId.toString()) {
      conversationMembers.push({
        user: memberId,
        role: "member",
      });
    }
  }

  // ======================================
  // Create Conversation
  // ======================================

  const conversation = await Conversation.create({
    type,
    name: typeof name === "string" ? name.trim() : "",

    description: typeof description === "string" ? description.trim() : "",

    image: typeof image === "string" ? image.trim() : "",

    createdBy: userId,

    members: conversationMembers,

    course: course || null,

    liveClass: liveClass || null,

    allowMemberMessages:
      allowMemberMessages !== undefined ? Boolean(allowMemberMessages) : true,

    allowMemberInvite:
      allowMemberInvite !== undefined ? Boolean(allowMemberInvite) : false,

    onlyAdminsCanPost:
      onlyAdminsCanPost !== undefined ? Boolean(onlyAdminsCanPost) : false,
  });

  await conversation.populate([
    {
      path: "members.user",
      select: "firstName lastName email avatar",
    },
    {
      path: "course",
      select: "title slug",
    },
  ]);

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
  await ensureUserExists(userId);

  const conversations = await Conversation.find({
    "members.user": userId,
    isDeleted: false,
  })
    .populate("members.user", "firstName lastName avatar")
    .populate("lastMessage", "sender type text attachments createdAt")
    .populate("course", "title slug")
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
  await ensureUserExists(userId);

  const conversation = await ensureConversationAccess(conversationId, userId);

  await conversation.populate([
    {
      path: "members.user",
      select: "firstName lastName email avatar",
    },
    {
      path: "lastMessage",
      select:
        "sender type text attachments createdAt edited deletedForEveryone",
    },
    {
      path: "course",
      select: "title slug",
    },
    {
      path: "createdBy",
      select: "firstName lastName email avatar",
    },
  ]);

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
  await ensureUserExists(userId);

  const conversation = await ensureConversationAccess(conversationId, userId);

  // Find member's role
  const member = conversation.members.find(
    (item) => item.user.toString() === userId.toString(),
  );

  if (!member) {
    throw new Error("You are not a member of this conversation.");
  }

  // Only owner can delete
  if (member.role !== "owner") {
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

// ======================================
// Export
// ======================================

module.exports = {
  createConversation,
  getMyConversations,
  getConversationById,
  deleteConversation,
};
