import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: String, price: Number, brand: String, images: [String],
  category: String, condition: String, stock: Number, description: String
}, { timestamps: true });
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);