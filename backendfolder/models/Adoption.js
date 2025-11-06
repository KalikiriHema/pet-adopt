import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    petName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Adoption", adoptionSchema);
