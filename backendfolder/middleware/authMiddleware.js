import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      error: "Access denied. No authorization token provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_pet_adopt";
    const verified = jwt.verify(token, jwtSecret);
    req.admin = verified;
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      error: "Invalid or expired token. Please log in again."
    });
  }
};
