import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /api/admin/login with rate limiting
router.post("/login", authLimiter, adminLogin);

export default router;
