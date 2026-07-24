const express = require("express");

const {
  getMyNotifications,
  getMyUnreadCount,
  markNotificationAsRead,
  markEveryNotificationAsRead,
  removeNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// Get My Notifications
// GET /api/notifications
// ======================================
router.get("/", protect, getMyNotifications);

// ======================================
// Get Unread Count
// GET /api/notifications/unread-count
// ======================================
router.get("/unread-count", protect, getMyUnreadCount);

// ======================================
// Mark One Notification as Read
// PATCH /api/notifications/:id/read
// ======================================
router.patch("/:id/read", protect, markNotificationAsRead);

// ======================================
// Mark All Notifications as Read
// PATCH /api/notifications/read-all
// ======================================
router.patch("/read-all", protect, markEveryNotificationAsRead);

// ======================================
// Delete Notification
// DELETE /api/notifications/:id
// ======================================
router.delete("/:id", protect, removeNotification);

module.exports = router;
