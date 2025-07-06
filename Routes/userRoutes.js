import express from "express";
const router = express.Router();
import { register, login } from "../Controllers/userController.js";

router.post("/add-user", register);
router.post("/login-user", login);

export default router;
