import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or file:// in dev)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback for local static file testing
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

// Body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check / Base route
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "🚀 Pet Adoption API is running smoothly",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/pets", petRoutes);


// Error Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

export default app;
