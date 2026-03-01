import mongoose from "mongoose";

const abandonedSchema = new mongoose.Schema({
  guestId: { type: String, required: true }, // Unique Device ID
  items: [{
    title: String,
    price: Number,
    brand: String,
    image: String
  }],
  totalAmount: Number,
  referredBy: { type: String, default: "Direct" }, // Staff ka naam agar link se aaya
  isRecovered: { type: Boolean, default: false }, // Agar baad mein khareed liya
}, { timestamps: true });

export const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model("AbandonedCart", abandonedSchema);