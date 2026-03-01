import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  // Hero Section Multi-Slider
  heroSlides: [{
    imageUrl: String,
    heading: String,
    subtext: String,
  }],
  // Moving Logos Section
  categories: [{
    name: String,       // e.g., "Men's Collection", "Celebrity"
    imageUrl: String,   // Logo or Image URL
    link: String        // e.g., "/collection/mens"
  }]
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);