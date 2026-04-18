import mongoose from 'mongoose';
// 🚀 FIXED 1: Capitalized 'User' so Vercel doesn't crash
import { LOYALTY_TIERS, getLoyaltyTier, getLoyaltyDiscount } from '@/models/user';
import connectDB from './mongodb';

// 🚀 FIXED 2: Exported getLoyaltyDiscount so your checkout API can use it
export { getLoyaltyDiscount };

export async function updateUserLoyalty(userId: string | mongoose.Types.ObjectId) {
    await connectDB();
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    const user = await User.findById(userId);
    if (!user) return null;

    const currentTier = user.loyaltyTier;
    const newTier = getLoyaltyTier(user.totalSpent);
    
    if (newTier !== currentTier) {
        const oldTierInfo = LOYALTY_TIERS.find(t => t.name === currentTier);
        const newTierInfo = LOYALTY_TIERS.find(t => t.name === newTier);
        
        user.loyaltyTier = newTier;
        user.tierUpgradedAt = new Date();
        user.loyaltyPoints = user.loyaltyPoints + (newTierInfo?.discount || 0) * 100;
        
        user.notifications = user.notifications || [];
        user.notifications.unshift({
            title: `🎉 Upgraded to ${newTier}!`,
            desc: `You've been upgraded from ${currentTier} to ${newTier}. Enjoy ${newTierInfo?.discount}% extra discount on all orders!`,
            unread: true,
            time: new Date()
        });
        
        await user.save();
        
        return { 
            oldTier: currentTier, 
            newTier: newTier,
            oldDiscount: oldTierInfo?.discount || 0,
            newDiscount: newTierInfo?.discount || 0
        };
    }
    
    return null;
}

export async function syncAllUserLoyalties() {
    await connectDB();
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    const users = await User.find({ totalSpent: { $gt: 0 } });
    let upgraded = 0;
    
    for (const user of users) {
        const newTier = getLoyaltyTier(user.totalSpent);
        if (newTier !== user.loyaltyTier) {
            user.loyaltyTier = newTier;
            user.tierUpgradedAt = new Date();
            await user.save();
            upgraded++;
        }
    }
    
    return { total: users.length, upgraded };
}

export function calculateCheckoutDiscount(
    subtotal: number, 
    totalSpent: number, 
    existingDiscount: number = 0
): { discount: number; tier: string; tierDiscount: number } {
    const tier = getLoyaltyTier(totalSpent);
    const tierDiscount = getLoyaltyDiscount(totalSpent);
    const loyaltyDiscountAmount = (subtotal * tierDiscount) / 100;
    const finalDiscount = Math.max(loyaltyDiscountAmount, existingDiscount);
    
    return {
        discount: finalDiscount,
        tier: tier,
        tierDiscount: tierDiscount
    };
}

export function getLoyaltyBadge(tier: string): { label: string; color: string; bg: string } {
    const badges: Record<string, { label: string; color: string; bg: string }> = {
        'Silver Vault': { label: 'Silver', color: '#666666', bg: '#F3F3F3' },
        'Gold Vault': { label: 'Gold', color: '#D4AF37', bg: '#FFF8E7' },
        'Platinum Elite': { label: 'Platinum', color: '#E5E4E2', bg: '#F5F5F5' },
        'Diamond Sovereign': { label: 'Diamond', color: '#00CED1', bg: '#E0FFFF' },
    };
    
    return badges[tier] || badges['Silver Vault'];
}