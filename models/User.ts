import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String }, // 🚨 Unique hata diya taaki Google users crash na karein
    password: { type: String, select: false },
    role: { type: String, default: 'USER' },
    walletPoints: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    loyaltyTier: { type: String, default: 'Silver Vault' },
    myReferralCode: { type: String },
}, { 
    timestamps: true,
    autoIndex: false // 🚨 Duplicate index warnings rokne ke liye
});

const User = models.User || model('User', userSchema);
export default User;    