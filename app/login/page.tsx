"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPortal() {
    const [isLogin, setIsLogin] = useState(true); // true = Login, false = Sign Up
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Handle Google One-Click Login
    const handleGoogleLogin = () => {
        setIsLoading(true);
        signIn('google', { callbackUrl: '/account' });
    };

    // Handle Manual Sign Up
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !password) return alert("Please fill all details.");
        
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                alert("Account Created! You can now log in.");
                setIsLogin(true); // Switch to login screen
            } else {
                alert(data.error || "Failed to create account.");
            }
        } catch (error) {
            alert("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Manual Login
    const handleManualLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || !password) return alert("Please enter phone and password.");
        
        setIsLoading(true);
        // Using NextAuth credentials provider
        const res = await signIn('credentials', {
            redirect: false,
            phone,
            password,
        });

        if (res?.error) {
            alert("Invalid details. Please try again.");
            setIsLoading(false);
        } else {
            window.location.href = '/account'; // Redirect to Vault on success
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-gray-900 selection:bg-gray-200">
            
            {/* Top Navigation */}
            <header className="p-6 md:p-12 w-full absolute top-0 left-0 z-10">
                <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors w-max">
                    <ArrowLeft size={16}/> Back to Store
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6 mt-16">
                <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
                    
                    {/* Header Texts */}
                    <div className="text-center mb-8">
                        <ShieldCheck size={40} className="mx-auto text-black mb-4" strokeWidth={1}/>
                        <h1 className="text-3xl font-serif mb-2">
                            {isLogin ? 'Welcome Back' : 'Join Essential'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isLogin ? 'Access your private horology vault.' : 'Create your luxury account today.'}
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                        <button 
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                        >
                            Log In
                        </button>
                        <button 
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Google Login (Highly Recommended) */}
                    <button 
                        onClick={handleGoogleLogin} 
                        disabled={isLoading}
                        className="w-full mb-6 py-4 px-6 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238598)">
                                <path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 z"/>
                                <path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 z"/>
                                <path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 z"/>
                                <path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,41.939 C -8.804,40.009 -11.514,38.989 -14.754,38.989 C -19.444,38.989 -23.494,41.689 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 z"/>
                            </g>
                        </svg>
                        <span className="text-sm font-bold text-gray-700">Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">OR</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    {/* Dynamic Forms */}
                    <AnimatePresence mode="wait">
                        <motion.form 
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={isLogin ? handleManualLogin : handleRegister}
                            className="space-y-4"
                        >
                            {!isLogin && (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-black transition-colors" 
                                        placeholder="Full Name" 
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-black transition-colors" 
                                    placeholder="Phone Number (e.g. 9876543210)" 
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-black transition-colors" 
                                    placeholder="Password" 
                                />
                            </div>

                            {isLogin && (
                                <div className="text-right">
                                    <button type="button" className="text-xs text-gray-500 hover:text-black font-bold">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 mt-2 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70 group"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                ) : (
                                    <>
                                        {isLogin ? 'Log In Securely' : 'Create Account'}
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <p className="text-[10px] text-gray-400 text-center mt-8 px-4 leading-relaxed">
                        By continuing, you agree to Essential's <br/>
                        <Link href="/policies/terms" className="underline hover:text-black">Terms of Service</Link> and <Link href="/policies/privacy" className="underline hover:text-black">Privacy Policy</Link>.
                    </p>

                </div>
            </main>
        </div>
    );
}