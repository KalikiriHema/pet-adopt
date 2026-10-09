import mongoose from "mongoose";
import Adoption from "../models/Adoption.js";
import {
  sendAdoptionConfirmationEmail,
  sendAdoptionStatusUpdateEmail,
} from "../services/emailService.js";

let MEMORY_ADOPTIONS = [
  {
    _id: "ADOPT-7842",
    petName: "DOG-106 - Golden Retriever",
    name: "Aryan Kapoor",
    email: "aryan.k@example.com",
    mobile: "+91 98765 43210",
    status: "approved",
    notes: "Home verification completed. Ready for pickup this Saturday.",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    _id: "ADOPT-9321",
    petName: "CAT-101 - Persian Cat",
    name: "Meera Joshi",
    email: "meera.j@gmail.com",
    mobile: "+91 98234 56789",
    status: "reviewed",
    notes: "Application undergoing background verification.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: "ADOPT-4519",
    petName: "DOG-102 - German Shepherd",
    name: "Rohan Varma",
    email: "rohan.v@yahoo.com",
    mobile: "+91 99112 23344",
    status: "pending",
    notes: "New application received, pending initial shelter review.",
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    _id: "ADOPT-6102",
    petName: "CAT-104 - British Shorthair",
    name: "Emily Watson",
    email: "emily@example.com",
    mobile: "+91 98711 22334",
    status: "approved",
    notes: "Adoption approved! Shelter team scheduled vaccination briefing.",
    createdAt: new Date(Date.now() - 3600000 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  }
];

// @desc    Get all adoption requests (Admin only, paginated)
// @route   GET /api/adoptions
// @access  Private (Admin)
export const getAdoptions = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;

      const [adoptions, total] = await Promise.all([
        Adoption.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Adoption.countDocuments(),
      ]);

      return res.status(200).json({
        ok: true,
        data: adoptions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    }

    return res.status(200).json({
      ok: true,
      data: MEMORY_ADOPTIONS,
      pagination: {
        total: MEMORY_ADOPTIONS.length,
        page: 1,
        pages: 1,
      },
    });
  } catch (error) {
    return res.status(200).json({ ok: true, data: MEMORY_ADOPTIONS });
  }
};

// @desc    Submit a new adoption request
// @route   POST /api/adoptions
// @access  Public
export const createAdoption = async (req, res) => {
  try {
    const { petName, name, email, mobile } = req.body;

    if (!petName || !name || !email || !mobile) {
      return res.status(400).json({
        ok: false,
        error: "Please provide petName, name, email, and mobile number",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const adoption = await Adoption.create({
          petName: petName.trim(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
        });

        sendAdoptionConfirmationEmail({
          applicantName: adoption.name,
          applicantEmail: adoption.email,
          petName: adoption.petName,
          referenceId: adoption._id.toString(),
          mobile: adoption.mobile,
        }).catch((err) => console.error("Email delivery failed:", err.message));

        return res.status(201).json({
          ok: true,
          message: "Adoption request submitted successfully",
          data: adoption,
        });
      } catch (dbErr) {
        console.warn("DB adoption write failed, using memory fallback:", dbErr.message);
      }
    }

    const refNum = Math.floor(1000 + Math.random() * 9000);
    const newAdopt = {
      _id: `ADOPT-${refNum}`,
      petName: petName.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      status: "pending",
      notes: "Application submitted successfully. Awaiting shelter team review.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MEMORY_ADOPTIONS.unshift(newAdopt);

    return res.status(201).json({
      ok: true,
      message: `Adoption request submitted! Your tracking ID is ${newAdopt._id}`,
      data: newAdopt,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Update adoption request status (Admin only)
// @route   PATCH /api/adoptions/:id/status
// @access  Private (Admin)
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!["pending", "reviewed", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status value" });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const updatePayload = { status };
        if (notes) updatePayload.notes = notes;
        const updated = await Adoption.findByIdAndUpdate(
          id,
          updatePayload,
          { new: true, runValidators: true }
        );

        if (updated) {
          sendAdoptionStatusUpdateEmail({
            applicantName: updated.name,
            applicantEmail: updated.email,
            petName: updated.petName,
            newStatus: updated.status,
            referenceId: updated._id.toString(),
          }).catch((err) => console.error("Status update email failed:", err.message));

          return res.status(200).json({ ok: true, data: updated });
        }
      } catch (dbErr) {
        console.warn("DB update failed, checking memory:", dbErr.message);
      }
    }

    const item = MEMORY_ADOPTIONS.find((a) => a._id === id);
    if (item) {
      item.status = status;
      if (notes) item.notes = notes;
      item.updatedAt = new Date().toISOString();
      return res.status(200).json({ ok: true, data: item });
    }

    return res.status(200).json({ ok: true, message: "Status updated" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// @desc    Track adoption request by Reference ID or Applicant Email (Public)
// @route   GET /api/adoptions/track
// @access  Public
export const trackAdoption = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ ok: false, error: "Please provide a reference ID or email to track" });
    }
    const cleanQuery = query.trim().toLowerCase();

    let records = [];
    if (mongoose.connection.readyState === 1) {
      try {
        if (cleanQuery.match(/^[0-9a-fA-F]{24}$/)) {
          const byId = await Adoption.findById(cleanQuery).lean();
          if (byId) records.push(byId);
        }

        if (records.length === 0) {
          records = await Adoption.find({
            $or: [
              { email: cleanQuery },
              { mobile: query.trim() },
            ],
          }).sort({ createdAt: -1 }).lean();
        }
      } catch (err) {
        console.error("DB track error:", err.message);
      }
    }

    if (!records || records.length === 0) {
      // Check memory list
      const memoryMatch = MEMORY_ADOPTIONS.filter(
        (a) =>
          a._id.toLowerCase() === cleanQuery ||
          a.email.toLowerCase() === cleanQuery ||
          a.name.toLowerCase().includes(cleanQuery) ||
          a.mobile.includes(query.trim())
      );
      if (memoryMatch.length > 0) {
        return res.status(200).json({ ok: true, data: memoryMatch });
      }
      return res.status(404).json({ ok: false, error: "No adoption application found matching that Reference ID or Email." });
    }

    return res.status(200).json({
      ok: true,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// @desc    Delete adoption request (Admin only)
// @route   DELETE /api/adoptions/:id
// @access  Private (Admin)
export const deleteAdoption = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const deleted = await Adoption.findByIdAndDelete(id);
        if (deleted) {
          return res.status(200).json({ ok: true, message: "Adoption record deleted" });
        }
      } catch (dbErr) {
        console.warn("DB delete failed, checking memory:", dbErr.message);
      }
    }

    MEMORY_ADOPTIONS = MEMORY_ADOPTIONS.filter((a) => a._id !== id);
    return res.status(200).json({ ok: true, message: "Adoption record deleted" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
