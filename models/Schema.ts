import mongoose from 'mongoose';

// 1. Team Member with Referral Tracking
const TeamMemberSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  referralCode: { type: String, unique: true }, // e.g., TEAM123
  stats: {
    visits: { type: Number, default: 0 },
    cartAdds: { type: Number, default: 0 },
    abandonedCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }
}, { timestamps: true });

// 2. Global Settings (Hero, Reviews, Brands)
const SettingSchema = new mongoose.Schema({
  heroSliders: [{
    imageUrl: String,
    heading: String,
    subtext: String,
    isActive: { type: Boolean, default: true },
    order: Number
  }],
  reviews: [{
    name: String,
    text: String,
    rating: { type: Number, min: 1, max: 5 }
  }],
  brands: [{
    name: String,
    logoUrl: String,
    description: String,
    slug: String // For dynamic company pages
  }]
});

// 3. Abandoned Cart Tracking
const AbandonedCartSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  items: Array,
  referralCode: String,
  status: { type: String, default: 'pending' } // pending, recovered
}, { timestamps: true });

export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
export const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', AbandonedCartSchema);