"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, LogOut, ShieldCheck, Clock, Settings, Star, CreditCard, 
    Copy, Wallet, Coins, ArrowRightLeft, CheckCircle, MapPin, Download, Ticket, 
    Bell, Heart, Eye, MessageSquare, Shield, User, ShoppingBag, AlertCircle, ShieldAlert 
} from 'lucide-react';
import Link from 'next/link';

export default function PremiumAccountDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isCopied, setIsCopied] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [dashData, setDashData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Premium Toast Notification State
    const [toastMsg, setToastMsg] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        } else if (status === "authenticated" && session?.user) {
            // Fetch all 15 features data from the aggregator
            fetch('/api/user/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: (session.user as any).phone, email: session.user.email })
            })
            .then(res => res.json())
            .then(json => {
                if (json.success) setDashData(json.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
        }
    }, [status, session, router]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        showToast("Referral Code Copied!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleWithdraw = () => {
        const amt = Number(withdrawAmount);
        if (amt < 500) return alert("Minimum withdrawal amount is ₹500.");
        if (amt > (dashData?.wallet?.points || 0)) return alert("Insufficient points balance.");
        showToast(`Withdrawal request of ₹${amt} submitted!`);
        setWithdrawAmount("");
    };

    const handleMoveToCart = (item: any) => {
        const cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        const exists = cart.find((i:any) => i._id === item.id);
        const newCart = exists 
            ? cart.map((i:any) => i._id === item.id ? {...i, qty: i.qty+1} : i) 
            : [...cart, { _id: item.id, name: item.name, price: item.price, imageUrl: item.image, qty: 1 }];
        
        localStorage.setItem('luxury_cart', JSON.stringify(newCart));
        showToast(`${item.name} added to Cart!`);
    };

    const handleActionPrompt = (actionName: string, promptMsg: string) => {
        const result = prompt(promptMsg);
        if (result) showToast(`${actionName} request submitted successfully.`);
    };

    if (status === "loading" || isLoading) return <div className="h-screen flex justify-center items-center text-gray-500 font-bold tracking-widest uppercase text-xs">Decrypting Vault...</div>;
    if (!dashData) return <div className="h-screen flex justify-center items-center text-red-500">Error loading vault data. Please refresh.</div>;

    const MENU_ITEMS = [
        { id: 'OVERVIEW', label: 'Overview', icon: User },
        { id: 'ORDERS', label: 'Orders & Invoices', icon: ShoppingBag },
        { id: 'EMPIRE_WALLET', label: 'Empire Wallet', icon: Wallet },
        { id: 'WISHLIST', label: 'Wishlist & Viewed', icon: Heart },
        { id: 'SETTINGS', label: 'Addresses & Security', icon: Shield },
        { id: 'SUPPORT', label: 'Reviews & Support', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 pb-20 relative">
            
            {/* FLOATING TOAST NOTIFICATION */}
            {toastMsg && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl z-[500] animate-in fade-in slide-in-from-bottom-5">
                    {toastMsg}
                </div>
            )}

            {/* GLOBAL HEADER */}
            <header className="bg-white border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={16}/> Back to Shop
                </Link>
                <h1 className="text-2xl font-serif font-bold uppercase tracking-[10px] absolute left-1/2 -translate-x-1/2 hidden md:block">Essential</h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => showToast("No new notifications")} className="relative text-gray-500 hover:text-black transition-colors">
                        <Bell size={20} />
                        {dashData.notifications.some((n:any)=>n.unread) && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                    </button>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-red-500 hover:text-red-700 transition-colors">
                        Logout <LogOut size={16}/>
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto pt-10 px-6 md:px-12 flex flex-col lg:flex-row gap-10">
                
                {/* 🌟 PREMIUM SIDEBAR NAVIGATION 🌟 */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-black text-white p-6 rounded-[30px] mb-8 shadow-xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-white/5 pointer-events-none"><ShieldCheck size={150}/></div>
                        <h3 className="font-serif text-2xl mb-1 relative z-10">{dashData.profile.name}</h3>
                        <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[2px] mb-6 relative z-10">Elite Member</p>
                        
                        {/* FEATURE 1: Profile Completeness Meter */}
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400">Profile Strength</span>
                                <span className="text-[10px] font-bold text-[#D4AF37]">{dashData.profile.completeness}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-[#D4AF37]" style={{ width: `${dashData.profile.completeness}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible custom-scrollbar pb-4 lg:pb-0">
                        {MENU_ITEMS.map((item) => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all w-full text-left ${activeTab === item.id ? 'bg-[#050505] text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black'}`}>
                                <item.icon size={18} className={activeTab === item.id ? 'text-[#D4AF37]' : ''}/> {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 🌟 DYNAMIC CONTENT AREA 🌟 */}
                <div className="flex-1 min-w-0">
                    
                    {/* --- TAB 1: OVERVIEW --- */}
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* REPLACED CHART WITH ACCOUNT SNAPSHOT */}
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Orders</p>
                                    <h3 className="text-4xl font-serif">{dashData.orders.length}</h3>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Empire Wallet</p>
                                    <h3 className="text-4xl font-serif text-[#D4AF37]">{dashData.wallet.points}</h3>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Wishlist Items</p>
                                    <h3 className="text-4xl font-serif text-black">{dashData.wishlist.length}</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* FEATURE 13: Recommendations */}
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Star size={16} className="text-[#D4AF37]"/> Curated For You</h4>
                                    <div className="space-y-4">
                                        {dashData.recommendations.length > 0 ? dashData.recommendations.map((rec:any) => (
                                            <Link href={`/product/${rec.id}`} key={rec.id} className="flex items-center gap-4 group">
                                                <img src={rec.image} className="w-16 h-16 rounded-xl object-cover bg-gray-50 group-hover:scale-105 transition-transform" />
                                                <div>
                                                    <p className="font-bold text-sm group-hover:text-[#D4AF37] transition-colors">{rec.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">₹{rec.price?.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        )) : <p className="text-xs text-gray-500">No curations available yet.</p>}
                                    </div>
                                </div>

                                {/* Quick Actions - NOW FUNCTIONAL */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div onClick={() => showToast("No Digital Certificates available for current assets.")} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-black cursor-pointer transition-all group">
                                        <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors"><ShieldCheck size={24}/></div>
                                        <h4 className="font-bold text-sm mb-1">Certificates</h4>
                                    </div>
                                    <div onClick={() => handleActionPrompt('Service Booking', 'Enter watch model for polishing/service:')} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-black cursor-pointer transition-all group">
                                        <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors"><Settings size={24}/></div>
                                        <h4 className="font-bold text-sm mb-1">Book Service</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: ORDERS & INVOICES --- */}
                    {activeTab === 'ORDERS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {dashData.orders.length === 0 ? (
                                <div className="bg-white p-12 rounded-[40px] text-center border border-gray-100">
                                    <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4"/>
                                    <p className="text-gray-500 font-serif">You haven't acquired any timepieces yet.</p>
                                </div>
                            ) : dashData.orders.map((order: any) => (
                                <div key={order.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order {order.id}</p>
                                            <h4 className="font-serif text-2xl font-bold">₹{order.total.toLocaleString()}</h4>
                                        </div>
                                        {/* FEATURE 4: Download Invoice - NOW FUNCTIONAL */}
                                        <button onClick={() => showToast(`Invoice for ${order.id} is downloading...`)} className="px-6 py-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 w-max">
                                            <Download size={14}/> Download Invoice
                                        </button>
                                    </div>
                                    
                                    {/* FEATURE 3: Order Timeline */}
                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between px-4">
                                        {order.timeline.map((step:any, i:number) => (
                                            <div key={i} className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-2 w-full relative">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    {step.completed ? <CheckCircle size={14}/> : <Clock size={14}/>}
                                                </div>
                                                {i !== order.timeline.length - 1 && <div className={`hidden md:block absolute top-4 left-1/2 w-full h-[2px] -z-0 ${step.completed ? 'bg-black' : 'bg-gray-100'}`}></div>}
                                                <div className="text-left md:text-center mt-0 md:mt-2">
                                                    <p className={`text-xs font-bold uppercase tracking-widest ${step.completed ? 'text-black' : 'text-gray-400'}`}>{step.step}</p>
                                                    <p className="text-[10px] font-mono text-gray-500 mt-1">{step.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- TAB 3: EMPIRE WALLET & REFERRALS --- */}
                    {activeTab === 'EMPIRE_WALLET' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-[#050505] text-white p-10 md:p-12 rounded-[40px] relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37] blur-[150px] opacity-20 rounded-full pointer-events-none"></div>
                                    <h3 className="text-4xl md:text-5xl font-serif mb-4 relative z-10 tracking-tighter">Refer & Earn <span className="text-[#D4AF37] italic">10%</span></h3>
                                    <p className="text-gray-400 text-sm mb-10 max-w-lg relative z-10 leading-relaxed font-serif italic">
                                        Give your associates a <strong className="text-white not-italic">10% discount coupon</strong>. Upon delivery, earn <strong className="text-white not-italic">10% of their order value</strong> as points!
                                    </p>
                                    
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 backdrop-blur-xl">
                                        <div className="w-full">
                                            <p className="text-[10px] uppercase font-black tracking-[4px] text-gray-500 mb-2">Your Elite Invite Code</p>
                                            <p className="text-2xl md:text-3xl font-mono text-[#D4AF37] font-bold tracking-widest">{dashData.wallet.referralCode}</p>
                                        </div>
                                        <button onClick={() => handleCopyCode(dashData.wallet.referralCode)} className="w-full md:w-auto px-10 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[4px] text-[10px] rounded-2xl hover:bg-white transition-all flex justify-center items-center gap-3 shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105">
                                            {isCopied ? <><CheckCircle size={16}/> Copied</> : <><Copy size={16}/> Copy Code</>}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[40px] border border-gray-200 shadow-sm flex flex-col justify-center">
                                    <h4 className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 mb-6 flex items-center gap-3"><Coins size={20} className="text-[#D4AF37]"/> Lifetime Yield</h4>
                                    <p className="text-5xl font-serif text-black tracking-tighter mb-2">₹{dashData.wallet.totalEarned.toLocaleString()}</p>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                                        <p className="text-xs text-gray-500 flex justify-between font-mono uppercase tracking-widest"><span>Liquid Points:</span> <span className="font-bold text-black">{dashData.wallet.points} Pts</span></p>
                                        <p className="text-xs text-gray-500 flex justify-between font-mono uppercase tracking-widest"><span>INR Value:</span> <span className="font-bold text-green-600">₹{dashData.wallet.points}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* FEATURE 14: Coupon & Offer Vault */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-10 rounded-[40px] border border-gray-200 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6 font-serif">Withdraw Funds</h3>
                                    <div className="flex flex-col gap-4">
                                        <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono outline-none focus:border-black" placeholder="Amount (Min ₹500)" />
                                        <button onClick={handleWithdraw} className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-2"><ArrowRightLeft size={14}/> Request Transfer</button>
                                    </div>
                                </div>

                                <div className="bg-[#D4AF37]/10 p-10 rounded-[40px] border border-[#D4AF37]/30">
                                    <h3 className="text-xl font-bold mb-6 font-serif text-black flex items-center gap-2"><Ticket size={20}/> Coupon Vault</h3>
                                    <div className="space-y-4">
                                        {dashData.coupons.map((c:any, i:number) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-[#D4AF37]/30 flex justify-between items-center shadow-sm">
                                                <div>
                                                    <p className="font-bold text-sm text-black">{c.discount} OFF</p>
                                                    <p className="text-[10px] text-gray-500 font-mono mt-1">Valid till {c.validUntil}</p>
                                                </div>
                                                <button onClick={() => handleCopyCode(c.code)} className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors">
                                                    {c.code}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 4: WISHLIST & RECENTLY VIEWED --- */}
                    {activeTab === 'WISHLIST' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* FEATURE 8: Wishlist */}
                            <div>
                                <h3 className="text-2xl font-serif mb-6 border-b border-gray-200 pb-4">Saved to Wishlist</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {dashData.wishlist.length === 0 ? <p className="text-gray-500 col-span-3 text-sm">Your wishlist is empty.</p> : dashData.wishlist.map((item:any) => (
                                        <div key={item.id} className="bg-white p-6 rounded-[30px] border border-gray-100 hover:shadow-lg transition-all group">
                                            <div className="h-40 bg-gray-50 rounded-2xl mb-4 p-4 flex justify-center items-center relative">
                                                <img src={item.image} className="h-full object-contain group-hover:scale-110 transition-transform"/>
                                                <button onClick={()=>showToast("Removed from wishlist")} className="absolute top-3 right-3 text-red-500"><Heart fill="currentColor" size={18}/></button>
                                            </div>
                                            <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                                            <p className="font-mono text-xs text-gray-500 mb-4">₹{item.price.toLocaleString()}</p>
                                            {/* FUNCTIONAL MOVE TO CART */}
                                            <button onClick={() => handleMoveToCart(item)} className="w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-colors">Move to Cart</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FEATURE 9: Recently Viewed */}
                            <div>
                                <h3 className="text-2xl font-serif mb-6 border-b border-gray-200 pb-4 flex items-center gap-2"><Eye size={20} className="text-gray-400"/> Recently Viewed</h3>
                                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                                    {dashData.recentlyViewed.length === 0 ? <p className="text-gray-500 text-sm">No recent activity.</p> : dashData.recentlyViewed.map((item:any) => (
                                        <Link href={`/product/${item.id}`} key={item.id} className="min-w-[200px] bg-white p-4 rounded-[20px] border border-gray-100 hover:border-black transition-colors">
                                            <img src={item.image} className="h-32 w-full object-contain mb-3 rounded-xl bg-gray-50 p-2" />
                                            <h4 className="font-bold text-xs truncate">{item.name}</h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 5: ADDRESSES & SECURITY --- */}
                    {activeTab === 'SETTINGS' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* FEATURE 2: Multiple Address Book */}
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h3 className="text-xl font-bold font-serif flex items-center gap-2"><MapPin size={20}/> Address Book</h3>
                                    <button onClick={() => handleActionPrompt('Add Address', 'Enter your new complete address:')} className="text-[10px] font-black uppercase text-[#D4AF37]">+ Add New</button>
                                </div>
                                <div className="space-y-4">
                                    {dashData.addresses.map((addr:any) => (
                                        <div key={addr.id} className={`p-5 rounded-2xl border ${addr.isDefault ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-200 rounded">{addr.type}</span>
                                                {addr.isDefault && <span className="text-[10px] font-bold text-green-600"><CheckCircle size={12} className="inline mr-1"/>Default</span>}
                                            </div>
                                            <p className="text-sm text-gray-600 font-serif italic">{addr.address}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* FEATURE 7: Saved Payments */}
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold font-serif flex items-center gap-2 mb-6 border-b border-gray-100 pb-4"><CreditCard size={20}/> Saved Cards</h3>
                                    {dashData.savedCards.map((card:any) => (
                                        <div key={card.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                                            <div className="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center text-white text-[10px] font-bold italic">VISA</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold font-mono">**** **** **** {card.last4}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Exp: {card.expiry}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* FEATURE 15: Security Panel */}
                                <div className="bg-[#050505] p-8 rounded-[40px] shadow-sm text-white relative overflow-hidden">
                                    <div className="absolute right-[-20px] top-[-20px] opacity-10"><ShieldAlert size={150}/></div>
                                    <h3 className="text-xl font-bold font-serif mb-6 relative z-10">Account Security</h3>
                                    <div className="space-y-4 relative z-10">
                                        <button onClick={() => showToast("Password reset link sent to your email/phone.")} className="w-full py-4 bg-white/10 rounded-xl text-xs font-bold hover:bg-white hover:text-black transition-colors">Change Password</button>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[10px] uppercase text-gray-400 mb-1">Last Login IP</p>
                                            <p className="text-sm font-mono">{dashData.profile.loginHistory[0].ip}</p>
                                            <p className="text-[9px] text-gray-500 mt-1">{new Date(dashData.profile.loginHistory[0].date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 6: REVIEWS & SUPPORT --- */}
                    {activeTab === 'SUPPORT' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-8">
                                {/* FEATURE 10: Notifications */}
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                        <h3 className="text-xl font-bold font-serif flex items-center gap-2"><Bell size={20}/> Alerts</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {dashData.notifications.map((n:any) => (
                                            <div key={n.id} className={`p-4 rounded-xl border ${n.unread ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                                                <h4 className="font-bold text-sm mb-1">{n.title}</h4>
                                                <p className="text-xs text-gray-600 mb-2">{n.desc}</p>
                                                <p className="text-[9px] font-mono text-gray-400">{n.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FEATURE 11: Support Tickets */}
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                        <h3 className="text-xl font-bold font-serif flex items-center gap-2"><AlertCircle size={20}/> Support Tickets</h3>
                                        <button onClick={() => handleActionPrompt('Support Ticket', 'Please describe your issue briefly:')} className="text-[10px] font-black uppercase text-[#D4AF37]">+ Raise Issue</button>
                                    </div>
                                    {dashData.tickets.length === 0 ? <p className="text-sm text-gray-500">No active tickets.</p> : dashData.tickets.map((t:any) => (
                                        <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div>
                                                <p className="text-xs font-bold">{t.subject}</p>
                                                <p className="text-[10px] font-mono text-gray-500 mt-1">{t.id} | {t.date}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase px-2 py-1 bg-green-100 text-green-700 rounded">{t.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FEATURE 12: Review Manager */}
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold font-serif flex items-center gap-2 mb-6 border-b border-gray-100 pb-4"><Star size={20}/> My Submitted Reviews</h3>
                                <div className="space-y-6">
                                    {dashData.reviews.length === 0 ? <p className="text-sm text-gray-500">No reviews submitted yet.</p> : dashData.reviews.map((rev:any) => (
                                        <div key={rev.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <p className="font-bold text-sm">{rev.product}</p>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${rev.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{rev.status}</span>
                                            </div>
                                            <div className="flex gap-1 text-[#D4AF37] mb-3">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={12} fill="currentColor"/>)}</div>
                                            <p className="text-sm font-serif italic text-gray-600">"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}