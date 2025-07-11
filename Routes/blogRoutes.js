import express from "express";
const router = express.Router();
import { createBlog,getUserAllBlogs } from "../Controllers/blogController.js";
router.post("/add-blog/:id", createBlog)
router.get("/get-blogs/:id", getUserAllBlogs)
export default router