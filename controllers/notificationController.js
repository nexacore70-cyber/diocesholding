const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../services/notificationService");

// ======================================
// Get My Notifications
// ======================================
const getMyNotifications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await getUserNotifications(req.user._id, page, limit);

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      ...result,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Unread Count
// ======================================
const getMyUnreadCount = async (req, res) => {
  try {
    const result = await getUnreadCount(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Unread Count Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Notification as Read
// ======================================
const markNotificationAsRead = async (req, res) => {
  try {
    const result = await markAsRead(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Mark Read Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark All Notifications as Read
// ======================================
const markEveryNotificationAsRead = async (req, res) => {
  try {
    const result = await markAllAsRead(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Mark All Read Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Notification
// ======================================
const removeNotification = async (req, res) => {
  try {
    const result = await deleteNotification(req.params.id, req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  getMyUnreadCount,
  markNotificationAsRead,
  markEveryNotificationAsRead,
  removeNotification,
};
