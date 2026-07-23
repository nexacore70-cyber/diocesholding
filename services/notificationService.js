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
const getUserNotifications = async (
  recipient,
  page = 1,
  limit = 20
) => {
  const notifications = await Notification.find({
    recipient,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return notifications;
};

// ======================================
// Get Unread Count
// ======================================
const getUnreadCount = async (recipient) => {
  return await Notification.countDocuments({
    recipient,
    isDeleted: false,
    isRead: false,
  });
};

// ======================================
// Mark Notification as Read
// ======================================
const markAsRead = async (
  notificationId,
  recipient
) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      new: true,
    }
  );
};

// ======================================
// Mark All Notifications as Read
// ======================================
const markAllAsRead = async (recipient) => {
  await Notification.updateMany(
    {
      recipient,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  return true;
};

// ======================================
// Soft Delete Notification
// ======================================
const deleteNotification = async (
  notificationId,
  recipient
) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};