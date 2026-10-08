import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Helper to get admin credentials from environment or fallback
const getAdminCredentials = () => {
  const email = process.env.ADMIN_EMAIL || "admin@petcare.com";
  const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(plainPassword, 10);
  return { email, passwordHash };
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "Please provide both email and password" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_pet_adopt";

    // Demo Admin Quick Access
    if (cleanEmail === "demo@petcare.com" && password === "demo123") {
      const token = jwt.sign({ email: "demo@petcare.com", role: "demo_admin" }, jwtSecret, { expiresIn: "4h" });
      return res.status(200).json({
        ok: true,
        message: "Demo admin authenticated successfully",
        token,
        isDemo: true
      });
    }

    const admin = getAdminCredentials();

    if (cleanEmail !== admin.email.toLowerCase().trim()) {
      return res.status(401).json({ ok: false, error: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ ok: false, error: "Invalid admin credentials" });
    }

    const token = jwt.sign({ email: admin.email, role: "admin" }, jwtSecret, { expiresIn: "4h" });

    return res.status(200).json({
      ok: true,
      message: "Admin authenticated successfully",
      token,
      isDemo: false
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
