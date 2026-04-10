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
    TrendingUp, Search, ExternalLink, Truck
} from "lucide-react";

// 🚀 THE GHOST KILLER: Force realtime rendering, strictly no caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function AdminDashboard() {
    // 1. Auth Guard
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
        redirect("/login");
    }

    // 2. Data Fetching
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

    // 🌟 BRIGHT THEME 🌟
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-[100vw] overflow-hidden px-4 sm:px-6 lg:px-8 py-10 bg-[#FAFAFA] min-h-screen text-gray-900">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-200 pb-8">
                <div>
                    <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.4em] mb-2">Global Monitoring</p>
                    <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-gray-900">Vault Control.</h1>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">System Integrity</p>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-widest mt-0.5">Node Online</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid - Bright Styling */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    icon={<DollarSign size={24}/>} 
                    trend="+12.5%" 
                    color="bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                />
                <StatCard 
                    title="Vault Orders" 
                    value={totalOrders.toString()} 
                    icon={<ShoppingBag size={24}/>} 
                    trend="+8.2%" 
                    color="bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                />
                <StatCard 
                    title="Active Users" 
                    value={activeUsers.toString()} 
                    icon={<Users size={24}/>} 
                    trend="+5.1%" 
                    color="bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                />
                <StatCard 
                    title="Top Asset" 
                    value={topPerformer} 
                    icon={<Crown size={24}/>} 
                    trend="Trending" 
                    color="bg-white text-[#D4AF37] border border-[#D4AF37]/20 bg-gradient-to-br from-white to-[#D4AF37]/5 shadow-sm"
                />
            </div>

            {/* VIP SEO DASHBOARD SECTION - Soft Contrast */}
            <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 text-gray-900 shadow-sm relative overflow-hidden group w-full">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <TrendingUp size={160} className="text-black" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">Elite Feature</span>
                            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight">SEO Intelligence</h2>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Dynamic metadata and JSON-LD structured data is generating actively. Google indexing process is running smoothly for your luxury catalog.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Indexing Status</p>
                                <p className="text-lg font-bold text-green-600">98.2%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Schema.org</p>
                                <p className="text-lg font-bold text-gray-900">Active</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Sitemap</p>
                                <p className="text-lg font-bold text-gray-900">Dynamic</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <Link href="/admin/seo" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-colors whitespace-nowrap">
                            <Search size={16} /> Deep SEO Audit
                        </Link>
                        <Link href="/sitemap.xml" target="_blank" className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:border-gray-300 transition-colors whitespace-nowrap">
                            <ExternalLink size={16} /> View Sitemap
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Orders Section - Bright & Clean */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden mb-12 w-full">
                <div className="p-8 md:p-10 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
                    <div>
                        <h3 className="text-2xl font-serif font-black tracking-tight text-gray-900">Recent Operations</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Live Transaction Stream</p>
                    </div>
                    <Link href="/godmode" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 bg-white border border-gray-200 px-5 py-3 rounded-full hover:border-gray-400 transition-all">
                        View All
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                {/* STRICT MOBILE SCROLL LOCK */}
                <div className="w-full max-w-full overflow-x-auto scrollbar-hide">
                    <div className="p-4 md:p-8 space-y-4 min-w-[320px] md:min-w-[600px]">
                        {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                            <div key={order._id.toString()} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 group gap-4">
                                <div className="flex items-start md:items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-colors flex-shrink-0">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 tracking-tight">{order.orderId || order._id.toString().slice(-8)}</p>
                                        
                                        {/* 🚀 AUTO-TRACKING ID DISPLAY ADDED HERE */}
                                        {order.trackingId && (
                                            <div className="flex items-center gap-1.5 mt-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md inline-flex border border-blue-100">
                                                <Truck size={10} />
                                                <p className="text-[9px] font-bold tracking-widest uppercase">{order.trackingId}</p>
                                            </div>
                                        )}
                                        
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-base font-black text-gray-900 font-mono tracking-tighter">₹{Number(order.totalAmount).toLocaleString()}</p>
                                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-[#D4AF37]'}`}>{order.status}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors flex-shrink-0">
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 text-xs font-black uppercase tracking-widest py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No recent operations</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Client Management */}
            <div className="w-full overflow-x-hidden bg-white rounded-[2.5rem] border border-gray-200 shadow-sm p-4">
                 <ClientRegistry initialUsers={JSON.parse(JSON.stringify(users))} />
            </div>
        </div>
    );
}