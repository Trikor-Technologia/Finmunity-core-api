import express from "express";
const router = express.Router();
import { userblogComments,userpostComments } from "../Controllers/commentsController.js";
router.post("/add-blog-comment/:id", userblogComments);
router.post("/add-post-comment/:id", userpostComments);

export default router