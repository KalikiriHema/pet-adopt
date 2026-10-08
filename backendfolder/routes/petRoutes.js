import express from "express";
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from "../controllers/petController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// GET all pets (Public)
router.get("/", apiLimiter, getPets);

// GET single pet by ID (Public)
router.get("/:id", apiLimiter, getPetById);

// POST new pet (Admin protected)
router.post("/", verifyAdmin, createPet);

// PUT update pet (Admin protected)
router.put("/:id", verifyAdmin, updatePet);

// PATCH update pet status/partial (Admin protected)
router.patch("/:id", verifyAdmin, updatePet);

// DELETE pet (Admin protected)
router.delete("/:id", verifyAdmin, deletePet);

export default router;
