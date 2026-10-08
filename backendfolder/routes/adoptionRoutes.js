import express from "express";
import {
  getAdoptions,
  createAdoption,
  trackAdoption,
  updateAdoptionStatus,
  deleteAdoption,
} from "../controllers/adoptionController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// GET all adoptions (Admin protected)
router.get("/", verifyAdmin, getAdoptions);

// GET track adoption status by query (Public)
router.get("/track", apiLimiter, trackAdoption);

// POST a new adoption request (Public with rate limiting)
router.post("/", apiLimiter, createAdoption);

// PATCH adoption status (Admin protected)
router.patch("/:id/status", verifyAdmin, updateAdoptionStatus);

// DELETE adoption request (Admin protected)
router.delete("/:id", verifyAdmin, deleteAdoption);

export default router;

