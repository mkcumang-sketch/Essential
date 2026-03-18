const mongoose = require('mongoose');

// 1. BRAND SCHEMA
const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, index: true },
  logoUrl: String,
  priority: { type: Number, default: 0 }, // For drag & drop ordering
});

// 2. CATEGORY SCHEMA
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  priority: { type: Number, default: 0 },
  genderCategory: { type: String, enum: ['Men', 'Women', 'Unisex', 'All'], default: 'All' }
});

// 3. MASTER PRODUCT SCHEMA (Watches)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, unique: true, index: true },
  sku: { type: String, unique: true },
  
  // Relations
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  
  // Media Library
  thumbnail: String,
  images: [String],
  videoUrl: String,
  
  // Pricing & Currency
  price: { type: Number, required: true },
  compareAtPrice: Number, // Original Price for Discount
  flashSalePrice: Number,
  saleEndsAt: Date,
  
  // Inventory Control
  stock: { type: Number, default: 0 },
  lowStockAlert: { type: Number, default: 5 },
  isPublished: { type: Boolean, default: true },
  
  // Advanced Tags & Sorting
  tags: [String], // e.g., "Trending", "New Arrival"
  priority: { type: Number, default: 99 },
  
  // SEO Engine
  seo: {
    metaTitle: String,
    metaDescription: String,
  }
}, { timestamps: true });

// Indexing for high-speed queries on 10,000+ items
ProductSchema.index({ price: 1, stock: 1 });
ProductSchema.index({ tags: 1 });

// 4. CMS (Content Management) SCHEMA
const CMSSchema = new mongoose.Schema({
  page: { type: String, default: 'Homepage', unique: true },
  heroBanners: [{ imageUrl: String, link: String, title: String }],
  promotions: [{ text: String, discountCode: String, active: Boolean }],
  featuredBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
});

// 5. COUPON SCHEMA
const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true, uppercase: true },
  discountPercent: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  expiryDate: Date,
});

module.exports = {
  Brand: mongoose.model('Brand', BrandSchema),
  Category: mongoose.model('Category', CategorySchema),
  Product: mongoose.model('Product', ProductSchema),
  CMS: mongoose.model('CMS', CMSSchema),
  Coupon: mongoose.model('Coupon', CouponSchema)
};