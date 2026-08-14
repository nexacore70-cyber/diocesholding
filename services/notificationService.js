const Notification = require("../models/Notification");

// ======================================
// Create Notification
// ======================================
const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  data = {},
  priority = "normal",
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    data,
    priority,
  });

  return notification;
};

// ======================================
// Get User Notifications
// ======================================
const getUserNotifications = async (recipient, page = 1, limit = 20) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const query = {
    recipient,
    isDeleted: false,
  };

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .populate("sender", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

    Notification.countDocuments(query),
  ]);

  return {
    success: true,
    data: notifications,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// ======================================
// Get Unread Count
// ======================================
const getUnreadCount = async (recipient) => {
  const count = await Notification.countDocuments({
    recipient,
    isDeleted: false,
    isRead: false,
  });

  return {
    success: true,
    count,
  };
};

// ======================================
// Mark Notification as Read
// ======================================
const markAsRead = async (notificationId, recipient) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient,
      isDeleted: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      new: true,
    },
  );

  if (!notification) {
    throw new Error("Notification not found.");
  }

  return {
    success: true,
    message: "Notification marked as read.",
    data: notification,
  };
};

// ======================================
// Mark All Notifications as Read
// ======================================
const markAllAsRead = async (recipient) => {
  const result = await Notification.updateMany(
    {
      recipient,
      isDeleted: false,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
  );

  return {
    success: true,
    message: "All notifications marked as read.",
    modifiedCount: result.modifiedCount,
  };
};

// ======================================
// Soft Delete Notification
// ======================================
const deleteNotification = async (notificationId, recipient) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  if (!notification) {
    throw new Error("Notification not found.");
  }

  return {
    success: true,
    message: "Notification deleted successfully.",
    data: notification,
  };
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
