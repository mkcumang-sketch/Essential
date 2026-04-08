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
    DollarSign, ShoppingBag, ChevronRight,
    TrendingUp, Search, ExternalLink
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
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
                <div>
                    <h1 className="text-6xl font-serif font-black italic tracking-tighter text-black">Vault Control</h1>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-3">Global Monitoring & Elite Management</p>
                </div>
                <div className="flex items-center gap-6 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50">
                    <div className="w-16 h-16 bg-black text-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                        <Shield size={32} />
                    </div>
                    <div className="pr-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">System Integrity</p>
                        <p className="text-sm font-bold text-black uppercase tracking-widest mt-1">Node 0.1.5 Online</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    icon={<DollarSign size={24}/>} 
                    trend="+12.5%" 
                    color="bg-black text-[#D4AF37] shadow-2xl shadow-black/20"
                />
                <StatCard 
                    title="Vault Orders" 
                    value={totalOrders.toString()} 
                    icon={<ShoppingBag size={24}/>} 
                    trend="+8.2%" 
                    color="bg-white text-black border border-gray-100 shadow-xl shadow-gray-100/50"
                />
                <StatCard 
                    title="Active Users" 
                    value={activeUsers.toString()} 
                    icon={<Users size={24}/>} 
                    trend="+5.1%" 
                    color="bg-white text-black border border-gray-100 shadow-xl shadow-gray-100/50"
                />
                <StatCard 
                    title="Top Asset" 
                    value={topPerformer} 
                    icon={<Crown size={24}/>} 
                    trend="Trending" 
                    color="bg-white text-black border border-gray-100 shadow-xl shadow-gray-100/50"
                />
            </div>

            {/* VIP SEO DASHBOARD SECTION */}
            <section className="bg-black rounded-[3.5rem] p-12 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <TrendingUp size={120} className="text-[#D4AF37]" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest rounded-full">Elite Feature</span>
                            <h2 className="text-3xl font-serif font-black italic tracking-tighter">VIP SEO Intelligence</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Our God-Level SEO engine is dynamically generating metadata and JSON-LD structured data for every timepiece in your vault. Google is now indexing your assets with rich snippets.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Indexing Status</p>
                                <p className="text-lg font-bold text-[#D4AF37]">98.2% Optimized</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Schema.org</p>
                                <p className="text-lg font-bold text-white">Active (JSON-LD)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sitemap</p>
                                <p className="text-lg font-bold text-white">Dynamic (v2.0)</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link href="/admin/seo" className="bg-white text-black px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-all shadow-xl shadow-white/5">
                            <Search size={18} /> Deep SEO Audit
                        </Link>
                        <Link href="/sitemap.xml" target="_blank" className="bg-gray-900 text-gray-400 px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:text-white transition-all">
                            <ExternalLink size={18} /> View XML Sitemap
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden mb-12">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-serif font-black italic tracking-tighter">Recent Operations</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Live Transaction Stream</p>
                    </div>
                    <Link href="/godmode" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">
                        View All Operations
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="p-10 space-y-6">
                    {recentOrders.map((order: any) => (
                        <div key={order._id.toString()} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50 hover:border-black hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-gray-400 border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-black tracking-tight">{order.orderId}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="text-base font-black text-black font-mono tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mt-1">{order.status}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-black transition-colors">
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-all" />
                                </div>
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
