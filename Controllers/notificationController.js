import { PrismaClient } from "@prisma/client";
import {
  createPagination,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/helpers.js";

const prisma = new PrismaClient();

// Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user.id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    let where = { userId };
    if (unreadOnly === "true") {
      where.isRead = false;
    }

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
        include: {
          fromUser: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    const pagination = createPagination(page, limit, total);

    res.status(200).json(
      createSuccessResponse({
        data: notifications,
        pagination,
      })
    );
  } catch (error) {
    console.error("Get notifications error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching notifications"
        )
      );
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Notification not found"));
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res
      .status(200)
      .json(createSuccessResponse({}, "Notification marked as read"));
  } catch (error) {
    console.error("Mark notification read error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error marking notification as read"
        )
      );
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res
      .status(200)
      .json(createSuccessResponse({}, "All notifications marked as read"));
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error marking all notifications as read"
        )
      );
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Notification not found"));
    }

    await prisma.notification.delete({
      where: { id },
    });

    res
      .status(200)
      .json(createSuccessResponse({}, "Notification deleted successfully"));
  } catch (error) {
    console.error("Delete notification error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error deleting notification"
        )
      );
  }
};

// Create notification (utility function for other controllers)
export const createNotification = async (
  userId,
  type,
  fromUserId,
  fromUsername,
  content,
  itemId = null,
  itemType = null
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        fromUserId,
        fromUsername,
        content,
        itemId,
        itemType,
      },
    });

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.status(200).json(
      createSuccessResponse({
        unreadCount: count,
      })
    );
  } catch (error) {
    console.error("Get unread count error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching unread count"
        )
      );
  }
};
