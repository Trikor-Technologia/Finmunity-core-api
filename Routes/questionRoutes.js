import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionCategories,
  getUserQuestions,
  getQuestionComments,
  addQuestionComment,
  updateComment,
  deleteComment,
  likeComment,
} from "../Controllers/questionController.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuestions);
router.get("/categories", getQuestionCategories);
router.get("/users/:id", getUserQuestions);
router.get("/:id", getQuestionById);
router.get("/:id/comments", getQuestionComments);

// Protected routes
router.post("/", authenticateToken, createQuestion);
router.put("/:id", authenticateToken, updateQuestion);
router.delete("/:id", authenticateToken, deleteQuestion);

// Comment routes
router.post("/:id/comments", authenticateToken, addQuestionComment);
router.put("/comments/:id", authenticateToken, updateComment);
router.delete("/comments/:id", authenticateToken, deleteComment);
router.post("/comments/:id/like", authenticateToken, likeComment);

export default router;
