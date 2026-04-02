import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    type: { type: String, default: 'Home' }, // Home, Office, etc.
    address: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String }, 
    role: { type: String, default: 'USER' }, 
    
    // 🌟 EMPIRE REWARDS ENGINE 🌟
    myReferralCode: { type: String, unique: true }, 
    referredBy: { type: String }, 
    walletPoints: { type: Number, default: 0 }, 
    totalEarned: { type: Number, default: 0 }, 
    
    // 🌟 PREMIUM ACCOUNT FEATURES 🌟
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    
    // 🌟 ELITE LOYALTY PROGRAM (Phase 2) 🌟
    totalSpent: { type: Number, default: 0 },
    loyaltyTier: { type: String, default: 'Silver Vault' },
    notifications: [{
        title: String,
        desc: String,
        time: { type: Date, default: Date.now },
        unread: { type: Boolean, default: true }
    }],
    loginHistory: [{
        ip: String,
        device: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;