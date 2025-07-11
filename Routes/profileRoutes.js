import express from "express";
const router = express.Router();
import { createProfile,getUserProfileData } from "../Controllers/profileController.js";
router.post("/add-profile/:id", createProfile)
router.get("/get-profile/:id", getUserProfileData)
export default router