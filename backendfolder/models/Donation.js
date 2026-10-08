import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["money", "item"],
      required: true
    },
    amount: {
      type: Number,
      min: [1, "Amount must be greater than 0"]
    },
    item: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"]
    },
    description: {
      type: String,
      trim: true
    },
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true
    },
    donorEmail: {
      type: String,
      required: [true, "Donor email is required"],
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true, bufferCommands: false }
);

donationSchema.index({ createdAt: -1 });

export default mongoose.model("Donation", donationSchema);
