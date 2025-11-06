import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

import adoptionRoutes from "./routes/adoptionRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/admin", adminRoutes);


// Mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Pet Adoption API is running successfully!");
});

// API routes
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/volunteers", volunteerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
