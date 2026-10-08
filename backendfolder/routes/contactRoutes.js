import express from "express";
import {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// GET all contacts (Admin protected)
router.get("/", verifyAdmin, getContacts);

// POST a new contact inquiry (Public with rate limiting)
router.post("/", apiLimiter, createContact);

// PATCH contact status (Admin protected)
router.patch("/:id/status", verifyAdmin, updateContactStatus);

// DELETE contact (Admin protected)
router.delete("/:id", verifyAdmin, deleteContact);

export default router;
