"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Smartphone, KeyRound, User as UserIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ElegantLoginPortal() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setIsLoading] = useState(false);
    
    // Forms Data
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    const handleCredentialsAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            // LOGIN FLOW
            const res = await signIn('credentials', {
                redirect: false,
                phone,
                password,
            });
            
            if (res?.error) {
                alert(res.error);
                setIsLoading(false);
            } else {
                router.push('/');
            }
        } else {
            // SIGNUP FLOW
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, password })
                });
                const data = await res.json();
                
                if (data.success) {
                    alert("Account Created! You can now sign in.");
                    setIsLogin(true);
                } else {
                    alert(data.error || "Registration failed.");
                }
            } catch (err) {
                alert("Network error.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans selection:bg-gray-200 selection:text-black">
            
            {/* LEFT SIDE: Visual/Brand Side (Hidden on small mobile) */}
            <div className="hidden md:flex w-1/2 bg-gray-50 relative overflow-hidden items-center justify-center border-r border-gray-200">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" alt="Luxury Assets" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="relative z-10 text-center p-12">
                    <h1 className="text-4xl lg:text-6xl font-serif text-white mb-6 drop-shadow-lg">Essential</h1>
                    <p className="text-white/80 font-serif italic text-lg max-w-sm mx-auto">Access the vault. Manage your acquisitions and concierge services.</p>
                </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative bg-white">
                <Link href="/" className="absolute top-8 left-8 md:left-12 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[2px] text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={16}/> Return to Store
                </Link>

                <div className="max-w-md w-full mx-auto mt-12 md:mt-0">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">{isLogin ? 'Welcome Back' : 'Create Identity'}</h2>
                        <p className="text-gray-500 text-sm">
                            {isLogin ? 'Enter your details to access your account.' : 'Join our exclusive client list.'}
                        </p>
                    </div>

                    {/* Google Auth Button */}
                    <button onClick={handleGoogleSignIn} className="w-full py-4 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-8 shadow-sm">
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.989 -14.754 38.989 C -19.444 38.989 -23.494 41.689 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-[10px] uppercase font-medium tracking-widest text-gray-400">Or use phone</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Standard Form */}
                    <form onSubmit={handleCredentialsAuth} className="space-y-5">
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="relative overflow-hidden">
                                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                        <input required={!isLogin} value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl text-sm outline-none focus:border-gray-900 transition-colors" placeholder="James Bond" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2 block">Mobile Number</label>
                            <div className="relative">
                                <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl text-sm outline-none focus:border-gray-900 transition-colors" placeholder="9876543210" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2 block">Password</label>
                            <div className="relative">
                                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl text-sm outline-none focus:border-gray-900 transition-colors" placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white font-medium uppercase tracking-[2px] rounded-xl hover:bg-gray-800 transition-all text-xs shadow-md mt-4">
                            {loading ? 'Processing...' : (isLogin ? 'Access Vault' : 'Create Identity')}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-gray-500 hover:text-black transition-colors font-medium">
                            {isLogin ? "Don't have an account? Create one." : "Already have an identity? Sign in."}
                        </button>
                    </div>

                    <div className="mt-12 flex justify-center items-center gap-2 text-gray-400">
                        <Lock size={12}/> <span className="text-[9px] uppercase font-bold tracking-widest">Encrypted AES-256 Connection</span>
                    </div>
                </div>
            </div>
        </div>
    );
}