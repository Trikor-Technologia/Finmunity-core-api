import express from "express";
const router = express.Router();
import { createProfile } from "../Controllers/profileController.js";
router.post("/add-profile/:id", createProfile)
export default router