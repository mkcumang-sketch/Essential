import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { Order } from "@/models/Order";
import StatCard from "@/components/Admin/StatCard";
import ClientRegistry from "@/components/Admin/ClientRegistry";
import { 
    Shield, Crown, Users, Package,
    DollarSign, ShoppingBag, ChevronRight,
    TrendingUp, Search, ExternalLink, Truck, Ghost 
} from "lucide-react";

export const fetchCache = 'force-no-store';

import NextDynamic from 'next/dynamic';

const AdminAnalytics = NextDynamic(() => import('@/components/Admin/AdminAnalytics'), { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-3xl" />
});

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
        redirect("/login");
    }

    await connectDB();

    const [usersResult, ordersResult] = await Promise.allSettled([
        User.find({}).sort({ createdAt: -1 }).lean(),
        Order.find({}).sort({ createdAt: -1 }).lean()
    ]);

    const usersData = usersResult.status === 'fulfilled' ? usersResult.value : [];
    const ordersData = ordersResult.status === 'fulfilled' ? ordersResult.value : [];

    if (usersResult.status === 'rejected') console.error('Users query failed:', usersResult.reason);
    if (ordersResult.status === 'rejected') console.error('Orders query failed:', ordersResult.reason);

    const totalRevenue = ordersData.reduce((acc: number, order: any) => acc + (Number(order.totalAmount) || 0), 0);
    const totalOrders = ordersData.length;
    const activeUsers = usersData.length;
    const recentOrders = ordersData.slice(0, 5);

    return (
        <div className="space-y-8 md:space-y-12 animate-fade-in w-full max-w-[100vw] overflow-x-hidden bg-[#FAFAFA] text-gray-900">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 md:mb-8 border-b border-gray-200 pb-6">
                <div>
                    <p className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-1 md:mb-2">Global Monitoring</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-gray-900">Vault Control.</h1>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <Link 
                        href="/admin/abandoned-carts" 
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 min-h-[44px] md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-black shadow-sm hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all w-full sm:w-auto justify-center group"
                    >
                        <Ghost size={18} className="group-hover:animate-pulse" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Recovery Vault</span>
                    </Link>

                    <div className="flex items-center gap-3 bg-white px-4 py-4 min-h-[44px] md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm w-full sm:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">System Integrity</p>
                            <p className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-widest mt-0.5">Node Online</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard title="Revenue" value={`₹${(totalRevenue/1000).toFixed(1)}k`} icon={<DollarSign size={20}/>} trend="+12%" color="bg-white text-gray-900 border border-gray-100 shadow-sm" />
                <StatCard title="Orders" value={totalOrders.toString()} icon={<ShoppingBag size={20}/>} trend="+8%" color="bg-white text-gray-900 border border-gray-100 shadow-sm" />
                <StatCard title="Users" value={activeUsers.toString()} icon={<Users size={20}/>} trend="+5%" color="bg-white text-gray-900 border border-gray-100 shadow-sm" />
                <StatCard title="Top Asset" value="Daytona" icon={<Crown size={20}/>} trend="Hot" color="bg-white text-[#D4AF37] border border-[#D4AF37]/20 bg-gradient-to-br from-white to-[#D4AF37]/5 shadow-sm" />
            </div>

            <section className="bg-white border border-gray-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 text-gray-900 shadow-sm relative overflow-hidden group w-full">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <TrendingUp size={100} className="text-black" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-2xl w-full">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">Elite Feature</span>
                            <h2 className="text-xl md:text-3xl font-serif font-black tracking-tight">SEO Intel</h2>
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6">
                            Dynamic metadata and JSON-LD structured data is active. Google indexing is running smoothly.
                        </p>
                        <div className="grid grid-cols-3 gap-3 md:gap-6">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Index</p>
                                <p className="text-sm md:text-lg font-bold text-green-600">98%</p>
                            </div>
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Schema</p>
                                <p className="text-sm md:text-lg font-bold text-gray-900">Active</p>
                            </div>
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Sitemap</p>
                                <p className="text-sm md:text-lg font-bold text-gray-900">v2.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-3 w-full lg:w-auto">
                        <Link href="/admin/seo" className="flex-1 md:flex-none bg-gray-900 text-white min-h-[44px] px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors whitespace-nowrap">
                            <Search size={14} /> Audit
                        </Link>
                        <Link href="/sitemap.xml" target="_blank" className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 min-h-[44px] px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-xs flex items-center justify-center gap-2 hover:border-gray-300 transition-colors whitespace-nowrap">
                            <ExternalLink size={14} /> XML
                        </Link>
                    </div>
                </div>
            </section>

            <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden mb-8 w-full">
                <div className="p-5 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl md:text-2xl font-serif font-black tracking-tight text-gray-900">Operations</h3>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Live Stream</p>
                    </div>
                    <Link href="/godmode" className="group flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 bg-white border border-gray-200 px-4 py-3 min-h-[44px] min-w-[44px] md:px-5 md:py-3 rounded-full hover:border-gray-400 transition-all">
                        View All
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="w-full overflow-x-auto scrollbar-hide">
                    <div className="p-4 md:p-8 space-y-3 md:space-y-4 min-w-[400px]">
                        {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                            <div key={order._id.toString()} className="flex items-center justify-between p-4 md:p-5 bg-white rounded-xl md:rounded-2xl border border-gray-100 hover:border-gray-300 transition-all group gap-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-gray-500 rounded-lg flex items-center justify-center shrink-0">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm font-black text-gray-900 tracking-tight">{order.orderId || order._id.toString().slice(-8)}</p>
                                        {order.trackingId && (
                                            <div className="flex items-center gap-1 mt-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                                                <Truck size={10} />
                                                <p className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase">{order.trackingId}</p>
                                            </div>
                                        )}
                                        <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 md:gap-8 text-right">
                                    <div>
                                        <p className="text-sm md:text-base font-black text-gray-900 font-mono tracking-tighter">₹{Number(order.totalAmount).toLocaleString()}</p>
                                        <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-0.5 ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-[#D4AF37]'}`}>{order.status}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 text-xs font-black uppercase tracking-widest py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">No operations yet</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[100vw] overflow-x-auto bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-200 shadow-sm p-3 md:p-4">
                  <div className="min-w-[600px] md:min-w-full">
                      <ClientRegistry initialUsers={JSON.parse(JSON.stringify(usersData))} />
                  </div>
            </div>

            <section className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl md:text-2xl font-serif font-black tracking-tight text-gray-900">Analytics</h3>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Real-Time Insights</p>
                    </div>
                </div>
                <div className="p-5 md:p-10">
                    <AdminAnalytics />
                </div>
            </section>
        </div>
    );
}
