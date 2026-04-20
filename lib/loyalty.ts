import mongoose from 'mongoose';
import user, { LOYALTY_TIERS, getLoyaltyTier, getLoyaltyDiscount } from '@/models/usertemp';
import connectDB from './mongodb';

export { LOYALTY_TIERS, getLoyaltyTier, getLoyaltyDiscount };

export async function updateUserLoyalty(userId: string | mongoose.Types.ObjectId) {
    await connectDB();
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    const userDoc = await User.findById(userId);
    if (!userDoc) return null;

    const currentTier = userDoc.loyaltyTier;
    const newTier = getLoyaltyTier(userDoc.totalSpent);
    
    if (newTier !== currentTier) {
        const oldTierInfo = LOYALTY_TIERS.find(t => t.name === currentTier);
        const newTierInfo = LOYALTY_TIERS.find(t => t.name === newTier);
        
        userDoc.loyaltyTier = newTier;
        userDoc.tierUpgradedAt = new Date();
        userDoc.loyaltyPoints = userDoc.loyaltyPoints + (newTierInfo?.discount || 0) * 100;
        
        userDoc.notifications = userDoc.notifications || [];
        userDoc.notifications.unshift({
            title: `🎉 Upgraded to ${newTier}!`,
            desc: `You've been upgraded from ${currentTier} to ${newTier}. Enjoy ${newTierInfo?.discount}% extra discount on all orders!`,
            unread: true,
            time: new Date()
        });
        
        await userDoc.save();
        
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
    
    for (const u of users) {
        const newTier = getLoyaltyTier(u.totalSpent);
        if (newTier !== u.loyaltyTier) {
            u.loyaltyTier = newTier;
            u.tierUpgradedAt = new Date();
            await u.save();
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