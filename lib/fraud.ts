import mongoose from 'mongoose';
import connectDB from './mongodb';

const FRAUD_THRESHOLDS = {
    MAX_ACCOUNTS_PER_IP: 3,
    MAX_REFERRALS_PER_DAY: 5,
    NEW_ACCOUNT_WINDOW_HOURS: 72,
    MIN_ORDER_VALUE_FOR_REFERRAL: 5000,
};

export interface FraudCheckResult {
    isSuspicious: boolean;
    riskScore: number;
    flags: string[];
    shouldBlock: boolean;
    recommendedAction: 'ALLOW' | 'REVIEW' | 'BLOCK';
}

export async function checkFraudRisk(
    ip: string,
    email: string,
    phone: string,
    referralCode?: string
): Promise<FraudCheckResult> {
    await connectDB();
    
    const flags: string[] = [];
    let riskScore = 0;
    
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    
    // 1. CHECK: Multiple accounts from same IP
    const accountsWithSameIP = await User.countDocuments({
        $or: [
            { phone: { $regex: `^${phone.slice(0, 6)}` } },
        ]
    }).lean();
    
    if (accountsWithSameIP >= FRAUD_THRESHOLDS.MAX_ACCOUNTS_PER_IP) {
        flags.push(`Multiple accounts detected from same identifier (${accountsWithSameIP})`);
        riskScore += 30;
    }
    
    // 2. CHECK: Newly created accounts using same referral code
    if (referralCode) {
        const newAccountCutoff = new Date(Date.now() - FRAUD_THRESHOLDS.NEW_ACCOUNT_WINDOW_HOURS * 60 * 60 * 1000);
        
        const referrer = await User.findOne({ myReferralCode: referralCode });
        
        if (referrer) {
            const recentReferrals = await User.countDocuments({
                appliedReferralCode: referralCode,
                createdAt: { $gte: newAccountCutoff }
            });
            
            if (recentReferrals >= FRAUD_THRESHOLDS.MAX_REFERRALS_PER_DAY) {
                flags.push(`Excessive referrals from code ${referralCode} in 72h`);
                riskScore += 40;
            }
        }
    }
    
    // 3. CHECK: Suspicious order patterns
    const recentOrders = await Order.find({
        $or: [
            { 'shippingData.email': email.toLowerCase() },
            { 'shippingData.phone': phone },
        ],
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (recentOrders.length >= 3) {
        flags.push('Multiple orders from same contact in 24h');
        riskScore += 20;
    }
    
    // 4. CHECK: IP velocity
    const ipOrdersLastHour = await Order.countDocuments({
        'shippingData.$db': { $exists: false },
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    });
    
    if (ipOrdersLastHour >= 5) {
        flags.push('High velocity orders detected');
        riskScore += 25;
    }
    
    // 5. CHECK: Known fraudulent patterns
    const emailDomain = email.split('@')[1]?.toLowerCase();
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com'];
    
    if (emailDomain && disposableDomains.includes(emailDomain)) {
        flags.push(`Disposable email domain detected: ${emailDomain}`);
        riskScore += 35;
    }
    
    // Calculate final risk
    const isSuspicious = riskScore >= 30;
    const shouldBlock = riskScore >= 70;
    
    return {
        isSuspicious,
        riskScore,
        flags,
        shouldBlock,
        recommendedAction: shouldBlock ? 'BLOCK' : isSuspicious ? 'REVIEW' : 'ALLOW'
    };
}

export async function flagSuspiciousOrder(
    orderId: string,
    fraudResult: FraudCheckResult,
    ip: string
) {
    await connectDB();
    
    const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    
    if (fraudResult.isSuspicious) {
        await Order.findOneAndUpdate(
            { orderId },
            {
                $set: {
                    fraudFlags: fraudResult.flags,
                    fraudRiskScore: fraudResult.riskScore,
                    fraudStatus: fraudResult.recommendedAction,
                    fraudCheckedAt: new Date(),
                    fraudIp: ip
                }
            }
        );
        
        console.log(`🚨 Order ${orderId} flagged as ${fraudResult.recommendedAction}:`, fraudResult.flags);
    }
}

export async function getFraudStats(): Promise<{
    suspiciousOrders: number;
    blockedOrders: number;
    flaggedIPs: string[];
}> {
    await connectDB();
    
    const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    
    const suspiciousOrders = await Order.countDocuments({
        fraudStatus: 'REVIEW'
    });
    
    const blockedOrders = await Order.countDocuments({
        fraudStatus: 'BLOCK'
    });
    
    const flaggedIPs = await Order.distinct('fraudIp', {
        fraudIp: { $exists: true, $ne: null }
    });
    
    return {
        suspiciousOrders,
        blockedOrders,
        flaggedIPs
    };
}