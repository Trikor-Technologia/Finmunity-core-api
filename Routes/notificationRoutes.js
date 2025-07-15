import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadCount,
} from "../Controllers/notificationController.js";

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

// Get user's notifications
router.get("/", getNotifications);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

// Mark notification as read
router.put("/:id/read", markNotificationRead);

// Mark all notifications as read
router.put("/read-all", markAllNotificationsRead);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;
