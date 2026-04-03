import  connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { referralCodeUsed, currentUserId } = await req.json();
        await connectDB();

        // 1. Find the owner of the code (The Referrer) - SECURITY: Exclude sensitive fields
        const referrer = await User.findOne({ myReferralCode: referralCodeUsed.toUpperCase() }).select('-password -__v');
        
        if (!referrer) return Response.json({ error: "Invalid Referral Code" }, { status: 404 });
        if (referrer._id.toString() === currentUserId) return Response.json({ error: "Self-referral not allowed" }, { status: 400 });

        // 2. Give ₹100 to the Referrer (User A)
        referrer.walletPoints += 100;
        referrer.totalEarned += 100;
        
        // 3. Optional: Add a notification to the Referrer's schema
        referrer.notifications.push({
            title: "Referral Reward!",
            desc: "Someone joined using your code. ₹100 added to your Vault.",
            unread: true
        });
        
        await referrer.save();

        // 4. Update the New User (User B) to track who referred them
        await User.findByIdAndUpdate(currentUserId, { referredBy: referralCodeUsed.toUpperCase() });

        return Response.json({ 
            success: true, 
            discount: 500, // User B gets ₹500 flat discount on current order
            message: "Referral Applied! Reward sent to your friend."
        });
    } catch (err) {
        return Response.json({ error: "Transaction Failed" }, { status: 500 });
    }
}