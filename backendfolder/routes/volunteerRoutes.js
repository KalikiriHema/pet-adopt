import express from "express";
import Volunteer from "../models/Volunteer.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

// GET all volunteers
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json({ ok: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST a new volunteer
router.post("/", async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ ok: true, data: volunteer });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

export default router;
