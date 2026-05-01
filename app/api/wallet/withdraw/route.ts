import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: {
    type: 'UPI' | 'BANK';
    details: string; // UPI ID or Bank Account Details
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: { type: String, enum: ['UPI', 'BANK'], required: true },
    details: { type: String, required: true }
  },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  adminNotes: { type: String }
}, { timestamps: true });

export default mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WithdrawalRequest from '@/models/WithdrawalRequest';
import User from '@/models/usertemp';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// ==========================================
// 1. POST: Submit Withdrawal Request (User)
// ==========================================
export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const userId = (session.user as any).id;
        const { amount, method, details } = await req.json();

        if (!amount || amount <= 0) return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });

        const dbUser = await User.findById(userId);
        if (!dbUser) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        if (dbUser.walletBalance < amount) {
            return NextResponse.json({ success: false, message: 'Insufficient wallet balance' }, { status: 400 });
        }

        // Deduct balance immediately
        await User.findByIdAndUpdate(userId, { $inc: { walletBalance: -amount } });

        // Create withdrawal request
        const withdrawal = await WithdrawalRequest.create({
            userId,
            amount,
            paymentMethod: { type: method, details },
            status: 'PENDING'
        });

        return NextResponse.json({ success: true, data: withdrawal });

    } catch (error) {
        console.error("Withdrawal Request Error:", error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// ==========================================
// 2. GET: Fetch Withdrawal Requests (Admin/User)
// ==========================================
export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const userRole = (session.user as any).role;
        const userId = (session.user as any).id;

        let requests;
        if (userRole === 'SUPER_ADMIN') {
            requests = await WithdrawalRequest.find({}).populate('userId', 'name email phone').sort({ createdAt: -1 });
        } else {
            requests = await WithdrawalRequest.find({ userId }).sort({ createdAt: -1 });
        }

        return NextResponse.json({ success: true, data: requests });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// ==========================================
// 3. PATCH: Approve/Reject Request (Admin Only)
// ==========================================
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        const { id, status, adminNotes } = await req.json();

        const request = await WithdrawalRequest.findById(id);
        if (!request) return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });

        if (request.status !== 'PENDING') {
            return NextResponse.json({ success: false, message: 'Request already processed' }, { status: 400 });
        }

        if (status === 'REJECTED') {
            // Refund the user
            await User.findByIdAndUpdate(request.userId, { $inc: { walletBalance: request.amount } });
        }

        request.status = status;
        if (adminNotes) request.adminNotes = adminNotes;
        await request.save();

        return NextResponse.json({ success: true, data: request });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}