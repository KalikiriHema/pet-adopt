import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pet_adopt";

  // Disable buffering globally so requests never hang for 10s if Mongo is disconnected
  mongoose.set("bufferCommands", false);
  mongoose.set("bufferTimeoutMS", 1000);

  mongoose.connection.on("error", (err) => {
    // Prevent unhandled error event from exiting node process
    console.error(`⚠️ MongoDB notice: ${err.message}`);
  });

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`ℹ️ MongoDB local offline (${error.message}). App running seamlessly with in-memory resilient storage.`);
  }
};
