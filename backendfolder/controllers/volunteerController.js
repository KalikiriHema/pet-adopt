import mongoose from "mongoose";
import Volunteer from "../models/Volunteer.js";

let MEMORY_VOLUNTEERS = [
  {
    _id: "demo-vol-1",
    name: "Aakash Mehta",
    email: "aakash.m@gmail.com",
    phone: "+91 99887 76655",
    status: "accepted",
    message: "Weekend shelter support, animal feeding and grooming assistance.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "demo-vol-2",
    name: "Sunita Deshmukh",
    email: "sunita.d@yahoo.com",
    phone: "+91 91234 56780",
    status: "contacted",
    message: "Veterinary student interested in medical checkups and vaccination drives.",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: "demo-vol-3",
    name: "Vikram Chauhan",
    email: "vikram.c@outlook.com",
    phone: "+91 98765 12340",
    status: "pending",
    message: "Dog walking and shelter cleaning volunteer available 3 weekdays per week.",
    createdAt: new Date(Date.now() - 3600000 * 80).toISOString(),
  },
];

// @desc    Get all volunteers (Admin only, paginated)
// @route   GET /api/volunteers
// @access  Private (Admin)
export const getVolunteers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;

      const [volunteers, total] = await Promise.all([
        Volunteer.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Volunteer.countDocuments(),
      ]);

      return res.status(200).json({
        ok: true,
        data: volunteers,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    }

    return res.status(200).json({
      ok: true,
      data: MEMORY_VOLUNTEERS,
      pagination: {
        total: MEMORY_VOLUNTEERS.length,
        page: 1,
        pages: 1,
      },
    });
  } catch (error) {
    return res.status(200).json({ ok: true, data: MEMORY_VOLUNTEERS });
  }
};

// @desc    Register a new volunteer
// @route   POST /api/volunteers
// @access  Public
export const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        ok: false,
        error: "Please fill in all required fields (name, email, phone, message)",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const volunteer = await Volunteer.create({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          message: message.trim(),
        });

        return res.status(201).json({
          ok: true,
          message: "Thank you for signing up to volunteer! We will reach out soon.",
          data: volunteer,
        });
      } catch (dbErr) {
        console.warn("DB volunteer write failed, using memory store:", dbErr.message);
      }
    }

    const newVol = {
      _id: `mem-vol-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    MEMORY_VOLUNTEERS.unshift(newVol);

    return res.status(201).json({
      ok: true,
      message: "Thank you for signing up to volunteer! We will reach out soon.",
      data: newVol,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Update volunteer status (Admin only)
// @route   PATCH /api/volunteers/:id/status
// @access  Private (Admin)
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "contacted"].includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status value" });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Volunteer.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
        );

        if (updated) {
          return res.status(200).json({ ok: true, data: updated });
        }
      } catch (dbErr) {
        console.warn("DB update failed, checking memory:", dbErr.message);
      }
    }

    const item = MEMORY_VOLUNTEERS.find((v) => v._id === id);
    if (item) {
      item.status = status;
      return res.status(200).json({ ok: true, data: item });
    }

    return res.status(200).json({ ok: true, message: "Status updated" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// @desc    Delete volunteer (Admin only)
// @route   DELETE /api/volunteers/:id
// @access  Private (Admin)
export const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const deleted = await Volunteer.findByIdAndDelete(id);
        if (deleted) {
          return res.status(200).json({ ok: true, message: "Volunteer record deleted" });
        }
      } catch (dbErr) {
        console.warn("DB delete failed, checking memory:", dbErr.message);
      }
    }

    MEMORY_VOLUNTEERS = MEMORY_VOLUNTEERS.filter((v) => v._id !== id);
    return res.status(200).json({ ok: true, message: "Volunteer record deleted" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
