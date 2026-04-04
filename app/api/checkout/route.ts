export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendOrderConfirmationEmail } from "@/utils/sendOrderConfirmationEmail";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req: Request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        const currentUser = session?.user as any;

        if (!currentUser || (!currentUser.email && !currentUser.phone)) {
            return NextResponse.json({ success: false, error: "Unauthorized. Please login." }, { status: 401 });
        }

        // 🚨 MASTER FIX: Cookie ka jhanjhat chhod, seedha Database se Asli ID utha!
        let absoluteUserId = currentUser.id;
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const userQuery = [];
        if (currentUser.email) userQuery.push({ email: currentUser.email });
        if (currentUser.phone && !currentUser.phone.startsWith('GOOG-')) userQuery.push({ phone: currentUser.phone });

        if (userQuery.length > 0) {
            const dbUser = await User.findOne({ $or: userQuery }).lean() as any;
            if (dbUser && dbUser._id) absoluteUserId = dbUser._id.toString();
        }

        if (!absoluteUserId) {
            return NextResponse.json({ success: false, error: "User identity unverified." }, { status: 400 });
        }

        const data = await req.json();
        let { items, totalAmount, financialBreakdown, appliedReferralCode, customer, paymentMethod } = data;

        if (!customer) customer = {};
        if (currentUser.email) customer.email = currentUser.email.toLowerCase().trim();
        if (!customer.phone && currentUser.phone && !currentUser.phone.startsWith('GOOG-')) {
            customer.phone = currentUser.phone;
        }
        if (currentUser.name) customer.name = currentUser.name;

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        const uniqueNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrder = await Order.create({
            orderId: uniqueNumber,
            orderNumber: uniqueNumber,
            userId: absoluteUserId, // 🔒 IRONCLAD LOCK: Form mein kuch bhi likho, order issi ID ka rahega
            user: absoluteUserId,
            customer,
            items,
            totalAmount,
            financialBreakdown,
            appliedReferralCode,
            paymentMethod,
            status: 'PROCESSING',
            createdAt: new Date()
        });

        if (currentUser.email) {
            void (async () => {
                try {
                    await sendOrderConfirmationEmail({
                        to: currentUser.email.toLowerCase().trim(),
                        customerName: currentUser.name || "Customer",
                        orderId: newOrder.orderId,
                        amount: Number(totalAmount || 0),
                    });
                } catch (e) { }
            })();
        }

        try {
            const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));
            if (currentUser.email) await AbandonedCart.deleteMany({ email: currentUser.email.toLowerCase().trim() });
            if (currentUser.phone) await AbandonedCart.deleteMany({ phone: currentUser.phone });
        } catch (e) {}

        return NextResponse.json({ success: true, orderId: newOrder.orderId });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ success: false, error: "Checkout failed." }, { status: 500 });
    }
}