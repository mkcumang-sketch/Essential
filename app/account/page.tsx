"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, TrendingUp, ShieldCheck, Clock, Settings, Headset, Star, CreditCard } from 'lucide-react';
import Link from 'next/link';
// Assuming you still have recharts installed
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MyAccountSuperApp() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('DASHBOARD');

    // Simple Dummy Data for demo
    const valueChartData = [
        { month: 'Jan', value: 45000 }, { month: 'Feb', value: 46000 },
        { month: 'Mar', value: 46500 }, { month: 'Apr', value: 50000 },
        { month: 'May', value: 52000 }, { month: 'Jun', value: 58000 },
    ];

    useEffect(() => {
        if (status === "unauthenticated") router.push('/login');
    }, [status, router]);

    if (status === "loading") return <div className="h-screen flex justify-center items-center text-gray-500 font-bold">Loading Your Account...</div>;
    if (status === "unauthenticated") return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black">
                    <ArrowLeft size={16}/> Back to Shop
                </Link>
                <h1 className="text-2xl font-bold uppercase tracking-widest">Essential</h1>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700">
                    Logout <LogOut size={16}/>
                </button>
            </header>

            <main className="max-w-6xl mx-auto pt-10 px-6">
                
                {/* User Greeting Box */}
                <div className="bg-black text-white p-8 md:p-10 rounded-3xl mb-10 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
                    <div>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">Verified Customer</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">Hello, {session?.user?.name?.split(' ')[0] || 'User'}!</h2>
                        <p className="text-gray-400">Welcome to your Personal Watch Hub.</p>
                    </div>
                    <div className="mt-6 md:mt-0 text-left md:text-right bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                        <p className="text-xs text-gray-300 font-bold uppercase tracking-widest mb-1">Your Total Watch Value</p>
                        <h3 className="text-3xl font-bold flex items-center md:justify-end gap-2 text-green-400">
                            ₹58,000 <TrendingUp size={24}/>
                        </h3>
                    </div>
                </div>

                {/* Navigation Tabs (Simple English) */}
                <div className="flex gap-4 md:gap-8 mb-8 overflow-x-auto border-b border-gray-200 pb-4">
                    {['DASHBOARD', 'MY WATCHES & ORDERS', 'PREMIUM SUPPORT'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm md:text-base font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-black border-b-2 border-black pb-3 -mb-4' : 'text-gray-400 hover:text-gray-700'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENTS */}
                {activeTab === 'DASHBOARD' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Value Tracking Chart */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-2">Watch Value Tracker</h3>
                            <p className="text-sm text-gray-500 mb-6">See how the value of your watches grows over time.</p>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={valueChartData}>
                                        <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                        <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                                        <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Feature Action Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-black cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4"><ShieldCheck size={24}/></div>
                                <h4 className="font-bold text-sm mb-1">Digital Certificates</h4>
                                <p className="text-xs text-gray-500">View authenticity proofs.</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-black cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4"><Settings size={24}/></div>
                                <h4 className="font-bold text-sm mb-1">Book Service</h4>
                                <p className="text-xs text-gray-500">Request watch cleaning.</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-black cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4"><Star size={24}/></div>
                                <h4 className="font-bold text-sm mb-1">VIP Early Access</h4>
                                <p className="text-xs text-gray-500">Buy new watches first.</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-black cursor-pointer transition-all">
                                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4"><CreditCard size={24}/></div>
                                <h4 className="font-bold text-sm mb-1">Saved Cards</h4>
                                <p className="text-xs text-gray-500">Manage payment methods.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'MY WATCHES & ORDERS' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h4 className="font-bold text-lg">Premium Chronograph - Black Edition</h4>
                                <p className="text-sm text-gray-500 mt-1">Order #EST-12345678</p>
                                <span className="inline-block mt-3 bg-green-50 text-green-600 px-3 py-1 rounded-md text-xs font-bold">Delivered on 12 March</span>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto">
                                <p className="text-gray-500 text-sm mb-1">Price</p>
                                <p className="text-xl font-bold">₹29,000</p>
                                <button className="mt-4 w-full md:w-auto px-6 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800">Track Details</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'PREMIUM SUPPORT' && (
                    <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm text-center max-w-2xl mx-auto">
                        <Headset size={60} className="mx-auto text-gray-300 mb-6"/>
                        <h3 className="text-3xl font-bold mb-4">How can we help you today?</h3>
                        <p className="text-gray-500 mb-8">As a registered user, you get priority VIP support. Our team is ready to answer your questions or help with repairs.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800">Chat on WhatsApp</button>
                            <button className="px-8 py-4 bg-gray-100 text-black font-bold rounded-xl hover:bg-gray-200">Email Support</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}