import express from "express";
const router = express.Router();
import { createPost, getUserAllPosts } from "../Controllers/postController.js";
router.post("/add-post/:id", createPost)
router.get("/get-posts/:id", getUserAllPosts)
export default router