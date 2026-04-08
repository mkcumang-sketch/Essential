import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { Order } from "@/models/Order";
import StatCard from "@/components/Admin/StatCard";
import ClientRegistry from "@/components/Admin/ClientRegistry";
import { 
    Shield, Crown, Users, Package,
    DollarSign, ShoppingBag, ChevronRight
} from "lucide-react";

// CRITICAL: Cache for 60 seconds (ISR)
export const revalidate = 60;

export default async function AdminDashboard() {
    // 1. Auth Guard
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
        redirect("/login");
    }

    // 2. Data Fetching (Directly from MongoDB)
    await connectDB();

    const [users, allOrders] = await Promise.all([
        User.find({}).sort({ createdAt: -1 }).lean(),
        Order.find({}).sort({ createdAt: -1 }).lean()
    ]);

    // 3. Metrics Calculation
    const totalRevenue = allOrders.reduce((acc: number, order: any) => acc + (Number(order.totalAmount) || 0), 0);
    const totalOrders = allOrders.length;
    const activeUsers = users.length;
    const topPerformer = "Rolex Daytona"; // Static for now as per original
    const recentOrders = allOrders.slice(0, 5);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black italic tracking-tighter">Vault Control</h1>
                    <p className="text-gray-500 text-sm mt-1">Global monitoring and client management.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <Shield size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Status</p>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Online & Secure</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    icon={<DollarSign size={24}/>} 
                    trend="+12.5%" 
                    color="bg-black text-[#D4AF37]"
                />
                <StatCard 
                    title="Vault Orders" 
                    value={totalOrders.toString()} 
                    icon={<ShoppingBag size={24}/>} 
                    trend="+8.2%" 
                    color="bg-white text-black border border-gray-100"
                />
                <StatCard 
                    title="Active Users" 
                    value={activeUsers.toString()} 
                    icon={<Users size={24}/>} 
                    trend="+5.1%" 
                    color="bg-white text-black border border-gray-100"
                />
                <StatCard 
                    title="Top Asset" 
                    value={topPerformer} 
                    icon={<Crown size={24}/>} 
                    trend="Trending" 
                    color="bg-white text-black border border-gray-100"
                />
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden mb-10">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-serif font-black italic tracking-tighter">Recent Operations</h3>
                    <Link href="/godmode" className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors">View All Tracker</Link>
                </div>
                <div className="p-8 space-y-4">
                    {recentOrders.map((order: any) => (
                        <div key={order._id.toString()} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-black transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-gray-400 border border-gray-100">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-black">{order.orderId}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-black">₹{order.totalAmount.toLocaleString()}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">{order.status}</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Client Management (Client Component) */}
            <ClientRegistry initialUsers={JSON.parse(JSON.stringify(users))} />
        </div>
    );
}
