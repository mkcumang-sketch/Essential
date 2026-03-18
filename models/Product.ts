import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  title: { type: String }, 
  brand: { type: String },
  category: { type: String, default: 'Investment Grade' },
  price: { type: Number },
  basePrice: { type: Number }, 
  offerPrice: { type: Number },
  stock: { type: Number, default: 1 },
  images: { type: [String], required: true }, 
  videos: { type: [String], default: [] },    
  specifications: { type: Map, of: String, default: {} }, 
  description: { type: String },
  slug: { type: String, unique: true, sparse: true }, 
  totalSold: { type: Number, default: 0 },
  
  // 🚨 NEW ENTERPRISE FEATURES 🚨
  seoScore: { type: Number, default: 0 }, // AI calculated
  tags: { type: [String], default: [] }, // Auto-generated
  variants: { type: Array, default: [] }, // Size/Color options
  linkedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Upsell
  lifecycleStatus: { type: String, enum: ['NEW', 'TRENDING', 'CLEARANCE', 'END_OF_LIFE'], default: 'NEW' }
}, { timestamps: true, strict: false }); 

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);