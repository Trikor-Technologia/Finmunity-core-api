import express from "express";
import { register } from "../Controllers/userController.js";
const router = express.Router();

router.post("/add-user", register);

export default router;
