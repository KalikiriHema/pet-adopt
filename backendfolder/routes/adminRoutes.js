import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Temporary hardcoded admin for testing
const ADMIN = {
  email: "admin@petcare.com",
  password: bcrypt.hashSync("admin123", 10) // hashed version
};

// ✅ POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== ADMIN.email) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, ADMIN.password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ ok: true, token });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
