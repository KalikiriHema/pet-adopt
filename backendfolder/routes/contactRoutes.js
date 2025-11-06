import express from "express";
import Contact from "../models/Contact.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

// GET all contact messages
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ ok: true, data: contacts });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST a new contact
router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ ok: true, data: contact });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

export default router;
