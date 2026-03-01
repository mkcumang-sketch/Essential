import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  watchModel: { type: String },
}, { timestamps: true });
export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);