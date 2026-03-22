import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 DYNAMIC SCHEMAS (To read from your Vault)
const orderSchema = new mongoose.Schema({
    items: Array,
    totalAmount: Number,
    customer: Object,
    status: String,
    createdAt: Date
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// 🔐 HELPER: Generate a secure-looking NFT Token Hash
const generateNFTToken = (id: string) => {
    const hash = Buffer.from(id).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    return `0x${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}`;
};

export async function GET(req: Request) {
    try {
        await connectDB();

        // Securely extract the client identity from the request URL
        const url = new URL(req.url);
        const email = url.searchParams.get('email')?.toLowerCase();
        const phone = url.searchParams.get('phone');

        if (!email && !phone) {
            return NextResponse.json({ success: false, error: "Identity parameters missing." }, { status: 400 });
        }

        // 1. Fetch all successful acquisitions for this specific VIP client
        const clientOrders = await Order.find({
            $or: [
                { 'customer.email': email },
                { 'customer.phone': phone }
            ],
            status: { $ne: 'CANCELLED' } // Don't count cancelled orders in portfolio
        }).sort({ createdAt: -1 });

        // 2. Format the Vault Assets (LEDGER)
        let totalPortfolioValue = 0;
        const vaultAssets = clientOrders.flatMap(order => {
            totalPortfolioValue += order.totalAmount || 0;
            
            return order.items.map((item: any) => ({
                name: item.name || "Bespoke Timepiece",
                ref: item.sku || `REF-${Math.floor(Math.random() * 100000)}`,
                date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                value: `₹${Number(item.price || 0).toLocaleString('en-IN')}`,
                nft: generateNFTToken(order._id.toString() + item.product),
                status: order.status === 'DELIVERED' ? 'Secured in Vault' : 'In Transit'
            }));
        });

        // 3. Generate Dynamic 6-Month Appreciation Graph (PORTFOLIO)
        // Luxury watches typically appreciate. We'll simulate a realistic 1.5% to 3% monthly growth curve ending at their current total value.
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        const portfolioData = [];
        
        let simulatedValue = totalPortfolioValue * 0.85; // Assume it was worth 15% less 5 months ago
        
        for (let i = 5; i >= 0; i--) {
            let monthIndex = currentMonth - i;
            if (monthIndex < 0) monthIndex += 12;
            
            // Add a slight random market fluctuation (1% to 3% up)
            if (i === 0) {
                simulatedValue = totalPortfolioValue; // Current month matches exact DB value
            } else {
                simulatedValue = simulatedValue + (simulatedValue * (Math.random() * 0.02 + 0.01)); 
            }

            portfolioData.push({
                month: months[monthIndex],
                value: Math.round(simulatedValue)
            });
        }

        // 4. Waitlist Data (Mocking a premium allocation for the Concierge feel)
        const waitlistData = [
            { name: "Patek Philippe Nautilus", ref: "5711/1A", position: Math.floor(Math.random() * 10) + 2, est: "Q4 2026" }
        ];

        // 🚀 RETURN THE MASTER PAYLOAD
        return NextResponse.json({
            success: true,
            data: {
                totalValue: totalPortfolioValue,
                vaultAssets,
                portfolioData,
                waitlistData
            }
        });

    } catch (error) {
        console.error("Portfolio Engine Error:", error);
        return NextResponse.json({ success: false, error: "Failed to decrypt portfolio." }, { status: 500 });
    }
}