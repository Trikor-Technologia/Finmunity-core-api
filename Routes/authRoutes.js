import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../Controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);
router.put("/profile", authenticateToken, updateProfile);

export default router;
