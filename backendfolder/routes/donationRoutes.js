import express from "express";
import Donation from "../models/Donation.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all donations
// router.get("/", async (req, res) => {
//   try {
//     const donations = await Donation.find();
//     res.status(200).json({ ok: true, data: donations });
//   } catch (error) {
//     res.status(500).json({ ok: false, error: error.message });
//   }
// });



router.get("/", verifyAdmin, async (req, res) => {
  const donations = await Donation.find();
  res.status(200).json({ ok: true, data: donations });
});


// POST money donation
router.post("/money", async (req, res) => {
  try {
    const { amount, name, email } = req.body;
    const donation = await Donation.create({
      type: "money",
      amount,
      donorName: name,
      donorEmail: email,
    });
    res.status(201).json({ ok: true, data: donation });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

// POST item donation
router.post("/item", async (req, res) => {
  try {
    const { item, quantity, description, name, email } = req.body;
    const donation = await Donation.create({
      type: "item",
      item,
      quantity,
      description,
      donorName: name,
      donorEmail: email,
    });
    res.status(201).json({ ok: true, data: donation });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

export default router;
