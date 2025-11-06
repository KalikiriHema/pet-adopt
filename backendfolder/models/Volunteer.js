import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Volunteer", volunteerSchema);
