import express from "express";
const router = express.Router();
import { createPost, getUserAllPosts } from "../Controllers/postController.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' });
router.post("/add-post/:id",upload.single('image'), createPost)
router.get("/get-posts/:id", getUserAllPosts)
export default router