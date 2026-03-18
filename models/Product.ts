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
  seoScore: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  lifecycleStatus: { type: String, enum: ['NEW', 'TRENDING', 'CLEARANCE', 'END_OF_LIFE'], default: 'NEW' }
}, { timestamps: true, strict: false }); 

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export { Product };