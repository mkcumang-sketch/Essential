import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // 1. Core Identity
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  phone: { type: String },
  
  
  // 2. Enterprise Access Control (RBAC)
  role: { 
    type: String, 
    enum: ['CUSTOMER', 'VENDOR', 'SUPPORT_STAFF', 'SUB_ADMIN', 'SUPER_ADMIN'], 
    default: 'CUSTOMER' 
  },
  permissions: [{ type: String }], // e.g., 'MANAGE_INVENTORY', 'REFUND_ORDERS'
  
  // 3. Security & Fraud Detection
  isBlocked: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  lastLoginIp: { type: String },
  lastLoginDate: { type: Date },

  // 4. Financial & Reward Ecosystem
  walletBalance: { type: Number, default: 0 },
  lifetimeSpent: { type: Number, default: 0 }, // For Analytics
  rewardPoints: { type: Number, default: 0 },
  loyaltyTier: { 
    type: String, 
    enum: ['GUEST', 'SILVER', 'GOLD', 'PLATINUM', 'IMPERIAL'], 
    default: 'GUEST' 
  },

  // 5. Customer Personalization
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  // 6. Vendor Sub-System (If role === 'VENDOR')
  vendorDetails: {
    companyName: String,
    gstNumber: String,
    commissionRate: { type: Number, default: 15 }, // Admin takes 15% cut
    isVerified: { type: Boolean, default: false }
  },

  // 7. Shipping/Billing Ledger
  addresses: [{
    type: { type: String, enum: ['HOME', 'OFFICE', 'WAREHOUSE'], default: 'HOME' },
    fullName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    isDefault: Boolean
  }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.models.User || mongoose.model('User', UserSchema);