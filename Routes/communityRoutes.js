import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  // Posts
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  bookmarkPost,

  // Blogs
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  bookmarkBlog,

  // Comments
  addComment,
  updateComment,
  deleteComment,
  likeComment,

  // User interactions
  followUser,
  getSuggestedUsers,
  getUserBookmarks,

  // Discovery & Trending
  getTrendingContent,
  getDiscoveryContent,
} from "../Controllers/communityController.js";

const router = express.Router();

// ===========================================
// ROOT COMMUNITY ROUTE
// ===========================================

// Get community overview (public)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Finmunity Community API",
      endpoints: {
        posts: "/api/community/posts",
        blogs: "/api/community/blogs",
        trending: "/api/community/trending",
        discover: "/api/community/discover",
      },
      note: "Most endpoints require authentication",
    },
  });
});

// ===========================================
// POST ROUTES
// ===========================================

// Create post with image upload
router.post("/posts", authenticateToken, upload.single("image"), createPost);

// Get all posts with pagination
router.get("/posts", getAllPosts);

// Get single post
router.get("/posts/:id", authenticateToken, getPostById);

// Update post with image upload
router.put("/posts/:id", authenticateToken, upload.single("image"), updatePost);

// Delete post
router.delete("/posts/:id", authenticateToken, deletePost);

// Like/unlike post
router.post("/posts/:id/like", authenticateToken, likePost);

// Bookmark/unbookmark post
router.post("/posts/:id/bookmark", authenticateToken, bookmarkPost);

// ===========================================
// BLOG ROUTES
// ===========================================

// Create blog with image upload
router.post("/blogs", authenticateToken, upload.single("image"), createBlog);

// Get all blogs with pagination and filtering
router.get("/blogs", getAllBlogs);

// Get single blog
router.get("/blogs/:id", authenticateToken, getBlogById);

// Update blog with image upload
router.put("/blogs/:id", authenticateToken, upload.single("image"), updateBlog);

// Delete blog
router.delete("/blogs/:id", authenticateToken, deleteBlog);

// Like/unlike blog
router.post("/blogs/:id/like", authenticateToken, likeBlog);

// Bookmark/unbookmark blog
router.post("/blogs/:id/bookmark", authenticateToken, bookmarkBlog);

// ===========================================
// COMMENT ROUTES
// ===========================================

// Add comment to post or blog
router.post("/comments", authenticateToken, addComment);

// Update comment
router.put("/comments/:id", authenticateToken, updateComment);

// Delete comment
router.delete("/comments/:id", authenticateToken, deleteComment);

// Like/unlike comment
router.post("/comments/:id/like", authenticateToken, likeComment);

// ===========================================
// USER INTERACTION ROUTES
// ===========================================

// Follow/unfollow user
router.post("/users/:id/follow", authenticateToken, followUser);

// Get suggested users
router.get("/users/suggested", authenticateToken, getSuggestedUsers);

// Get user bookmarks
router.get("/users/bookmarks", authenticateToken, getUserBookmarks);

// ===========================================
// DISCOVERY & TRENDING ROUTES
// ===========================================

// Get trending content
router.get("/trending", authenticateToken, getTrendingContent);

// Get discovery content
router.get("/discover", authenticateToken, getDiscoveryContent);

export default router;
