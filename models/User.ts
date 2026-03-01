import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user", // By default sab normal user honge
      enum: ["user", "admin", "super-admin"], // Sirf ye 3 roles allowed hain
    },
    provider: {
      type: String,
      default: "google",
    },
  },
  { timestamps: true }
);

// Agar model pehle se bana hai toh wahi use karo, nahi toh naya banao
const User = models.User || model("User", UserSchema);

export default User;