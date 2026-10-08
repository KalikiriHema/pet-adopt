import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import { sendDonationReceiptEmail } from "../services/emailService.js";

let MEMORY_DONATIONS = [
  {
    _id: "demo-don-1",
    type: "money",
    amount: 5000,
    donorName: "Ananya Sharma",
    donorEmail: "ananya.s@gmail.com",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: "demo-don-2",
    type: "money",
    amount: 2500,
    donorName: "Karan Patel",
    donorEmail: "karan.patel@outlook.com",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: "demo-don-3",
    type: "item",
    item: "Dog Food Bags",
    quantity: 10,
    description: "Pedigree 10kg adult dog food bags for shelter residents.",
    donorName: "Pooja Hegde",
    donorEmail: "pooja.h@yahoo.com",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    _id: "demo-don-4",
    type: "money",
    amount: 10000,
    donorName: "Rohan Varma",
    donorEmail: "rohan.v@yahoo.com",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

// @desc    Get all donations (Admin only, paginated)
// @route   GET /api/donations
// @access  Private (Admin)
export const getDonations = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;

      const [donations, total] = await Promise.all([
        Donation.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Donation.countDocuments(),
      ]);

      return res.status(200).json({
        ok: true,
        data: donations,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    }

    return res.status(200).json({
      ok: true,
      data: MEMORY_DONATIONS,
      pagination: {
        total: MEMORY_DONATIONS.length,
        page: 1,
        pages: 1,
      },
    });
  } catch (error) {
    return res.status(200).json({ ok: true, data: MEMORY_DONATIONS });
  }
};

// @desc    Submit a money donation
// @route   POST /api/donations/money
// @access  Public
export const createMoneyDonation = async (req, res) => {
  try {
    const { amount, name, email } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({
        ok: false,
        error: "Please enter a valid donation amount greater than 0",
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        ok: false,
        error: "Donor name and email are required",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const donation = await Donation.create({
          type: "money",
          amount: numAmount,
          donorName: name.trim(),
          donorEmail: email.trim().toLowerCase(),
        });

        sendDonationReceiptEmail({
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          type: "money",
          amount: donation.amount,
          donationId: donation._id.toString(),
        }).catch((err) => console.error("Donation email delivery failed:", err.message));

        return res.status(201).json({
          ok: true,
          message: `Thank you ${donation.donorName}! Your donation was received.`,
          data: donation,
        });
      } catch (dbErr) {
        console.warn("DB donation write failed, using memory fallback:", dbErr.message);
      }
    }

    const newDon = {
      _id: `mem-don-${Date.now()}`,
      type: "money",
      amount: numAmount,
      donorName: name.trim(),
      donorEmail: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };
    MEMORY_DONATIONS.unshift(newDon);

    return res.status(201).json({
      ok: true,
      message: `Thank you ${newDon.donorName}! Your donation was received.`,
      data: newDon,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Submit an item donation
// @route   POST /api/donations/item
// @access  Public
export const createItemDonation = async (req, res) => {
  try {
    const { item, quantity, description, name, email } = req.body;

    if (!item) {
      return res.status(400).json({
        ok: false,
        error: "Please select an item to donate",
      });
    }

    const numQuantity = Number(quantity);
    if (!numQuantity || numQuantity <= 0) {
      return res.status(400).json({
        ok: false,
        error: "Please enter a valid quantity of at least 1",
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        ok: false,
        error: "Donor name and email are required",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const donation = await Donation.create({
          type: "item",
          item: item.trim(),
          quantity: numQuantity,
          description: description ? description.trim() : "",
          donorName: name.trim(),
          donorEmail: email.trim().toLowerCase(),
        });

        sendDonationReceiptEmail({
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          type: "item",
          item: donation.item,
          quantity: donation.quantity,
          description: donation.description,
          donationId: donation._id.toString(),
        }).catch((err) => console.error("Item donation email failed:", err.message));

        return res.status(201).json({
          ok: true,
          message: `Thank you ${donation.donorName}! Your item donation was recorded.`,
          data: donation,
        });
      } catch (dbErr) {
        console.warn("DB item donation write failed, using memory fallback:", dbErr.message);
      }
    }

    const newDon = {
      _id: `mem-don-${Date.now()}`,
      type: "item",
      item: item.trim(),
      quantity: numQuantity,
      description: description ? description.trim() : "",
      donorName: name.trim(),
      donorEmail: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };
    MEMORY_DONATIONS.unshift(newDon);

    return res.status(201).json({
      ok: true,
      message: `Thank you ${newDon.donorName}! Your item donation was recorded.`,
      data: newDon,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Delete donation (Admin only)
// @route   DELETE /api/donations/:id
// @access  Private (Admin)
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const deleted = await Donation.findByIdAndDelete(id);
        if (deleted) {
          return res.status(200).json({ ok: true, message: "Donation record deleted" });
        }
      } catch (dbErr) {
        console.warn("DB donation delete failed, checking memory:", dbErr.message);
      }
    }

    MEMORY_DONATIONS = MEMORY_DONATIONS.filter((d) => d._id !== id);
    return res.status(200).json({ ok: true, message: "Donation record deleted" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
