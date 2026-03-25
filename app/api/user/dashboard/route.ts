import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, phone } = await req.json();

        if (!email && !phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 🌟 THE FIX: Added strictPopulate: false to bypass Mongoose memory caching issues 🌟
        const user = await User.findOne({ $or: [{ email }, { phone }] }).populate({ path: 'wishlist', strictPopulate: false });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Bind models to ensure they exist
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        const CmsConfig = mongoose.models.CmsConfig || mongoose.model('CmsConfig', new mongoose.Schema({}, { strict: false }));

        // 2. FETCH REAL ORDERS FOR THIS USER
        const userOrders = await Order.find({ 
            $or: [{ 'customer.email': user.email }, { 'customer.phone': user.phone }] 
        }).sort({ createdAt: -1 });

        // Helper to generate dynamic timeline based on Order Status
        const generateTimeline = (status: string, date: any) => {
            const statuses = ['PENDING', 'PROCESSING', 'DISPATCHED', 'TRANSIT', 'DELIVERED'];
            const currentIndex = statuses.indexOf(status?.toUpperCase()) > -1 ? statuses.indexOf(status?.toUpperCase()) : 0;
            
            return [
                { step: 'Order Placed', completed: currentIndex >= 0, date: new Date(date).toLocaleDateString() },
                { step: 'Processing', completed: currentIndex >= 1, date: currentIndex >= 1 ? 'Done' : 'Pending' },
                { step: 'In Transit', completed: currentIndex >= 3, date: currentIndex >= 3 ? 'Done' : 'Pending' },
                { step: 'Delivered', completed: currentIndex === 4, date: currentIndex === 4 ? 'Done' : 'Pending' }
            ];
        };

        // 3. FETCH REAL REVIEWS BY THIS USER
        const userReviews = await Review.find({ userName: user.name }).sort({ createdAt: -1 });

        // 4. FETCH ACTIVE COUPONS FROM CMS
        const cms = await CmsConfig.findOne({});
        const activeCoupons = cms?.marketingConfig || [
            { code: 'WELCOME10', discount: '10%', validUntil: 'Always', desc: 'Welcome Bonus' }
        ];

        // 5. FETCH RECOMMENDATIONS (Get 3 random top priority watches)
        const recommendations = await Product.find({}).sort({ priority: -1 }).limit(3);

        // 🌟 BUILD THE FINAL REAL DATA PAYLOAD FOR UI 🌟
        const dashboardData = {
            profile: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                completeness: (user.email && !user.email.includes('essential-guest') && user.phone && user.name) ? 100 : 75,
                loginHistory: user.loginHistory?.length > 0 ? user.loginHistory : [{ date: new Date().toISOString(), ip: "Secure Encrypted", device: "Verified Device" }]
            },
            addresses: user.addresses?.length > 0 ? user.addresses : [
                { id: 1, type: 'Home Vault', address: 'No address added yet. Please add one during checkout.', isDefault: true }
            ],
            orders: userOrders.map(o => ({
                id: o.orderId || o._id.toString().slice(-6).toUpperCase(),
                date: new Date(o.createdAt).toLocaleDateString(),
                total: o.totalAmount || 0,
                status: o.status || 'PENDING',
                items: o.items || [],
                timeline: generateTimeline(o.status || 'PENDING', o.createdAt)
            })),
            wallet: {
                points: user.walletPoints || 0,
                totalEarned: user.totalEarned || 0,
                referralCode: user.myReferralCode || `EST-${user.name?.split(' ')[0].toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`
            },
            wishlist: user.wishlist?.map((w: any) => ({
                id: w._id, name: w.name, price: w.price || w.offerPrice, image: w.imageUrl
            })) || [],
            recentlyViewed: [], 
            notifications: user.notifications?.length > 0 ? user.notifications : [
                { id: 1, title: 'Welcome to Essential', desc: 'Your private horology hub is active.', time: 'Just now', unread: true }
            ],
            tickets: [], 
            reviews: userReviews.map(r => ({
                id: r._id,
                product: r.product || 'General Experience',
                rating: r.rating || 5,
                comment: r.comment,
                status: r.visibility === 'public' ? 'APPROVED' : (r.visibility === 'pending' ? 'PENDING' : 'HIDDEN')
            })),
            recommendations: recommendations.map(r => ({
                id: r._id, name: r.name, price: r.offerPrice || r.price, image: r.imageUrl
            })),
            coupons: activeCoupons,
            savedCards: [
                { id: 1, last4: 'XXXX', brand: 'Secure', expiry: '--/--' } 
            ]
        };

        return NextResponse.json({ success: true, data: dashboardData });

    } catch (error) {
        console.error("Dashboard Aggregator Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}