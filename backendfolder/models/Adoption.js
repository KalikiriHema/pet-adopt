import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true
    },
    name: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Applicant email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true, bufferCommands: false }
);

adoptionSchema.index({ createdAt: -1 });
adoptionSchema.index({ email: 1 });

export default mongoose.model("Adoption", adoptionSchema);
