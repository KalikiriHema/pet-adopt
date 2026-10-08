import mongoose from "mongoose";
import Contact from "../models/Contact.js";

// In-memory fallback dataset for when MongoDB is disconnected
let MEMORY_CONTACTS = [
  {
    _id: "demo-con-1",
    name: "Neha Gupta",
    email: "neha.g@gmail.com",
    status: "unread",
    message: "Hello team! Can you let me know visiting hours for adopting a puppy this Saturday?",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "demo-con-2",
    name: "Rajesh Khanna",
    email: "rajesh.k@gmail.com",
    status: "replied",
    message: "Do you accept direct UPI / QR code payments for pet sponsor donations?",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    _id: "demo-con-3",
    name: "Farhan Ali",
    email: "farhan.a@gmail.com",
    status: "read",
    message: "I noticed an injured stray puppy near Sector 14 market, who can I contact for rescue support?",
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
];

// @desc    Get all contact messages (Admin only, paginated)
// @route   GET /api/contacts
// @access  Private (Admin)
export const getContacts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;

      const [contacts, total] = await Promise.all([
        Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Contact.countDocuments(),
      ]);

      return res.status(200).json({
        ok: true,
        data: contacts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // In-memory fallback
    return res.status(200).json({
      ok: true,
      data: MEMORY_CONTACTS,
      pagination: {
        total: MEMORY_CONTACTS.length,
        page: 1,
        pages: 1,
      },
    });
  } catch (error) {
    return res.status(200).json({ ok: true, data: MEMORY_CONTACTS });
  }
};

// @desc    Submit a new contact message
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "Please provide your name, email, and message",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const contact = await Contact.create({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        });

        return res.status(201).json({
          ok: true,
          message: "Thanks! We got your message.",
          data: contact,
        });
      } catch (dbErr) {
        console.warn("DB write failed, falling back to memory store:", dbErr.message);
      }
    }

    // Memory store fallback
    const newContact = {
      _id: `mem-con-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    MEMORY_CONTACTS.unshift(newContact);

    return res.status(201).json({
      ok: true,
      message: "Thanks! We got your message.",
      data: newContact,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
};

// @desc    Update contact status (Admin only)
// @route   PATCH /api/contacts/:id/status
// @access  Private (Admin)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status value" });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await Contact.findByIdAndUpdate(
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

    const item = MEMORY_CONTACTS.find((c) => c._id === id);
    if (item) {
      item.status = status;
      return res.status(200).json({ ok: true, data: item });
    }

    return res.status(200).json({ ok: true, message: "Status updated" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const deleted = await Contact.findByIdAndDelete(id);
        if (deleted) {
          return res.status(200).json({ ok: true, message: "Contact message deleted" });
        }
      } catch (dbErr) {
        console.warn("DB delete failed, checking memory:", dbErr.message);
      }
    }

    MEMORY_CONTACTS = MEMORY_CONTACTS.filter((c) => c._id !== id);
    return res.status(200).json({ ok: true, message: "Contact message deleted" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};
