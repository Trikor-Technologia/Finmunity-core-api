import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllNews,
  getNewsById,
  getTrendingNews,
  createNews,
  updateNews,
  deleteNews,
  getNewsCategories,
} from "../Controllers/newsController.js";

const router = express.Router();

// Public routes - Order matters! More specific routes first
router.get("/trending", getTrendingNews);
router.get("/categories", getNewsCategories);
router.get("/", getAllNews); // This should handle category filtering
router.get("/:id", getNewsById); // This should be last to catch specific IDs

// Protected routes (Admin only - you can add admin middleware later)
router.post("/", authenticateToken, createNews);
router.put("/:id", authenticateToken, updateNews);
router.delete("/:id", authenticateToken, deleteNews);

export default router;
