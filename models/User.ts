import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    role: string;
    walletPoints: number;
    totalEarned: number;
    totalSpent: number;
    loyaltyTier: string;
    loyaltyPoints: number;
    tierUpgradedAt: Date;
    myReferralCode?: string;
    totalReferrals: number;
    notifications: Array<{
        title: string;
        desc: string;
        unread: boolean;
        time: Date;
    }>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, index: true },
    password: { type: String, select: false },
    role: { type: String, default: 'USER' },
    walletPoints: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyTier: { type: String, default: 'Silver Vault' },
    loyaltyPoints: { type: Number, default: 0 },
    tierUpgradedAt: { type: Date, default: Date.now },
    myReferralCode: { type: String, index: true },
    totalReferrals: { type: Number, default: 0 },
    notifications:{
    type: [{
      title: { type: String },
      desc: { type: String },
      unread: { type: Boolean, default: true },
      time: { type: Date, default: Date.now }
    }],
    default: []
  },
}, { 
    timestamps: true,
    autoIndex: false
});

const User = models.User || model<IUser>('User', userSchema);
export default User;

export const LOYALTY_TIERS = [
    { name: 'Silver Vault', minSpend: 0, discount: 0, color: '#C0C0C0' },
    { name: 'Gold Vault', minSpend: 250000, discount: 5, color: '#D4AF37' },
    { name: 'Platinum Elite', minSpend: 750000, discount: 10, color: '#E5E4E2' },
    { name: 'Diamond Sovereign', minSpend: 2000000, discount: 15, color: '#B9F2FF' },
] as const;

export function getLoyaltyTier(totalSpent: number): string {
    for (const tier of [...LOYALTY_TIERS].reverse()) {
        if (totalSpent >= tier.minSpend) return tier.name;
    }
    return 'Silver Vault';
}

export function getLoyaltyDiscount(totalSpent: number): number {
    const tier = LOYALTY_TIERS.find(t => t.name === getLoyaltyTier(totalSpent));
    return tier?.discount || 0;
}    
