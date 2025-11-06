import express from "express";
import Adoption from "../models/Adoption.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

// GET all adoption requests
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const adoptions = await Adoption.find();
    res.status(200).json({ ok: true, data: adoptions });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST a new adoption
router.post("/", async (req, res) => {
  try {
    const adoption = await Adoption.create(req.body);
    res.status(201).json({ ok: true, data: adoption });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

export default router;
