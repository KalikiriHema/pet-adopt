import express from "express";
import {
  getVolunteers,
  createVolunteer,
  updateVolunteerStatus,
  deleteVolunteer,
} from "../controllers/volunteerController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// GET all volunteers (Admin protected)
router.get("/", verifyAdmin, getVolunteers);

// POST a new volunteer registration (Public with rate limiting)
router.post("/", apiLimiter, createVolunteer);

// PATCH volunteer status (Admin protected)
router.patch("/:id/status", verifyAdmin, updateVolunteerStatus);

// DELETE volunteer (Admin protected)
router.delete("/:id", verifyAdmin, deleteVolunteer);

export default router;
