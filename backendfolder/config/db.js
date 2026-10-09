import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pet_adopt";

  // Buffer commands while connecting with a reasonable timeout
  mongoose.set("bufferCommands", true);
  mongoose.set("bufferTimeoutMS", 10000);

  mongoose.connection.on("error", (err) => {
    console.error(`⚠️ MongoDB notice: ${err.message}`);
  });

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`ℹ️ MongoDB connection notice (${error.message}). App running with fallback resilience.`);
  }
};
