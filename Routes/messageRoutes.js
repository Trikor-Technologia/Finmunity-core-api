import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  startConversation,
  markMessageRead,
  getUnreadMessageCount,
} from "../Controllers/messageController.js";

const router = express.Router();

// All message routes require authentication
router.use(authenticateToken);

// Get user's conversations
router.get("/conversations", getConversations);

// Get unread message count
router.get("/unread-count", getUnreadMessageCount);

// Start new conversation
router.post("/conversations", startConversation);

// Get messages in a conversation
router.get("/conversations/:id/messages", getConversationMessages);

// Send message in conversation
router.post("/conversations/:id/messages", sendMessage);

// Mark message as read
router.put("/messages/:id/read", markMessageRead);

export default router;
