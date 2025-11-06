import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["money", "item"], required: true },
    amount: Number, // for money type
    donorName: String,
    donorEmail: String,
    item: String,   // for item type
    quantity: Number,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
