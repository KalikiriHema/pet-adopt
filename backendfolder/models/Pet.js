import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    petId: {
      type: String,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true
    },
    type: {
      type: String,
      enum: ["Dog", "Cat", "dog", "cat"],
      default: "Dog"
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true
    },
    age: {
      type: String,
      required: [true, "Age is required"],
      trim: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "male", "female"],
      default: "Male"
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "small", "medium", "large"],
      default: "Medium"
    },
    img: {
      type: String,
      default: "/dog1.jpg"
    },
    status: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available"
    },
    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true, bufferCommands: false }
);

petSchema.index({ type: 1, status: 1 });

export default mongoose.model("Pet", petSchema);
