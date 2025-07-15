import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getMarketStocks,
  getMarketOverview,
} from "../Controllers/newsController.js";

const router = express.Router();

// Market routes
router.get("/stocks", getMarketStocks);
router.get("/overview", getMarketOverview);

export default router;
