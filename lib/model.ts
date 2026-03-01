import mongoose from "mongoose";

// 1. Product Model
const productSchema = new mongoose.Schema({
  title: String, brand: String, price: Number, category: String,
  description: String, images: [String], movement: String,
  caseMaterial: String, glassType: String, dialColor: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

// 2. Site Content Models (Hero, Brand, Review)
const heroSchema = new mongoose.Schema({ title: String, subtitle: String, image: String, isActive: { type: Boolean, default: true } });
const brandSchema = new mongoose.Schema({ name: String, logo: String, isActive: { type: Boolean, default: true } });
const reviewSchema = new mongoose.Schema({ customerName: String, rating: Number, comment: String, isActive: { type: Boolean, default: true } });

// 3. Referral Tracking Model
const referralSchema = new mongoose.Schema({
  salesPerson: { type: String, index: true },
  eventType: String, productTitle: String, productPrice: Number, visitorId: String, source: String
}, { timestamps: true });

// 4. Leads/Concierge Model
const leadSchema = new mongoose.Schema({
  name: String, email: String, phone: String, message: String, status: { type: String, default: "New" }
}, { timestamps: true });

// Exporting All Models from one place
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export const Hero = mongoose.models.Hero || mongoose.model("Hero", heroSchema);
export const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export const Referral = mongoose.models.Referral || mongoose.model("Referral", referralSchema);
export const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);