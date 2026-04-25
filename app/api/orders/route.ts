import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/usertemp';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache'; // 🚀 CACHE KILLER

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// ==========================================
// 1. GET ALL ORDERS (User or Admin)
// ==========================================
export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const userId = (session.user as any).id;
        const userRole = (session.user as any).role;

        let orders = [];
        if (userRole === 'SUPER_ADMIN') {
            orders = await Order.find({}).sort({ createdAt: -1 }).lean();
        } else {
            orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
        }

        const dbUser = await User.findById(userId).lean();

        return NextResponse.json({
            success: true,
            data: orders,
            totalSpent: orders.reduce((acc: number, o: any) => acc + (Number(o.totalAmount) || 0), 0),
            loyaltyTier: (dbUser as any)?.loyaltyTier || "Silver Vault"
        }, { headers: { 'Cache-Control': 'no-store, no-cache' } });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// ==========================================
// 2. CREATE ORDER & INSTANT AGENT PAYOUT
// ==========================================
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Order create karo
        const newOrder = await Order.create(body);

        // 🚀 STEP 1: Pending Reward for User Referrals
        if (newOrder.referralCode) {
            const AgentModel = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }));
            
            // Check if code belongs to an Agent
            const agent = await AgentModel.findOne({
                code: { $regex: new RegExp(`^${newOrder.referralCode.trim()}$`, 'i') }
            });

            if (agent) {
                // Calculate commission
                const commissionAmount = (Number(newOrder.totalAmount) * Number(agent.commission || 0)) / 100;
                
                // Add Sale and Revenue to Agent
                await AgentModel.findByIdAndUpdate(agent._id, {
                    $inc: { sales: 1, revenue: commissionAmount }
                });

                // Mark order as credited so normal Users don't get reward logic later
                await Order.findByIdAndUpdate(newOrder._id, { isRewardCredited: true });
            } else {
                // If not an agent, check if it's a User's referral code
                const referringUser = await User.findOne({ 
                    myReferralCode: { $regex: new RegExp(`^${newOrder.referralCode.trim()}$`, 'i') } 
                });

                if (referringUser) {
                    // Add to PENDING wallet balance
                    await User.findByIdAndUpdate(referringUser._id, {
                        $inc: { pendingWalletBalance: 500 }
                    });
                }
            }
        }

        // 🚀 STEP 4: Deduct Wallet Balance if used
        if (body.useWallet && body.userId) {
            const dbUser = await User.findById(body.userId);
            if (dbUser && dbUser.walletBalance > 0) {
                const deduction = Math.min(dbUser.walletBalance, body.totalAmount);
                await User.findByIdAndUpdate(body.userId, {
                    $inc: { walletBalance: -deduction }
                });
                
                // Update order if fully paid by wallet
                if (deduction >= body.totalAmount) {
                    await Order.findByIdAndUpdate(newOrder._id, {
                        paymentMethod: 'WALLET',
                        paymentStatus: 'PAID',
                        status: 'PROCESSING'
                    });
                }
            }
        }

        return NextResponse.json({ success: true, data: newOrder });
    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
    }
}

// ==========================================
// 3. UPDATE ORDER & DELAYED USER REWARD
// ==========================================
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();
        const { id, status, trackingId } = body;
        
        const updateData: any = {};
        if (status) updateData.status = status;
        if (trackingId !== undefined) updateData.trackingId = trackingId;

        // Order dhoondho
        const order = await Order.findById(id);
        if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

        // 🚀 STEP 2: Delayed Referral Payout (Only for Users on DELIVERY)
        if (status === 'DELIVERED' && order.referralCode && !order.isRewardCredited) {
            
            // Check if the code belongs to a normal User
            const referringUser = await User.findOne({ 
                myReferralCode: { $regex: new RegExp(`^${order.referralCode.trim()}$`, 'i') } 
            });

            if (referringUser) {
                // Move from pending to available wallet balance
                await User.findByIdAndUpdate(referringUser._id, {
                    $inc: { walletBalance: 500, pendingWalletBalance: -500 }
                });

                // Mark kar do taaki dobara paise na milen
                updateData.isRewardCredited = true;
            }
        }

        // Final Update and Cache Clear
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/godmode'); 
        
        return NextResponse.json({ success: true, data: updatedOrder });

    } catch (error) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
    }
}

// ==========================================
// 4. DELETE ORDER (Admin Only)
// ==========================================
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        const { id } = await req.json();
        
        await Order.findByIdAndDelete(id);
        revalidatePath('/godmode');
        
        return NextResponse.json({ success: true, message: "Order Deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
    }
}