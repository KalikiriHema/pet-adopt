import express from "express";
import {
  getDonations,
  createMoneyDonation,
  createItemDonation,
} from "../controllers/donationController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import Donation from "../models/Donation.js";

const router = express.Router();

// GET all donations (Admin protected)
router.get("/", verifyAdmin, getDonations);

// POST money donation (Public with rate limiting)
router.post("/money", apiLimiter, createMoneyDonation);

// POST item donation (Public with rate limiting)
router.post("/item", apiLimiter, createItemDonation);

// DELETE donation (Admin protected)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Donation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Donation not found" });
    }
    res.status(200).json({ ok: true, message: "Donation record deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
