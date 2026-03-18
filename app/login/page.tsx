"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EssentialRushLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirecting straight to dashboard. 
    // Yahan hum baad mein asli authentication laga sakte hain.
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans px-4">
      {/* Background aesthetic */}
      <img 
        src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=2500" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" 
        alt="Background" 
      />
      
      <div className="relative z-10 w-full max-w-md bg-white p-10 shadow-2xl rounded-sm">
        <div className="text-center mb-10">
          <div className="text-[#a37e2c] text-4xl mb-2 animate-pulse">♛</div>
          <h1 className="text-2xl font-serif font-bold tracking-[4px] uppercase text-[#212121]">
            Essential Rush
          </h1>
          <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mt-2 font-bold">
            Authorized Vault Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[2px] text-gray-500 font-bold mb-2">
              Admin ID
            </label>
            <input 
              type="text" 
              defaultValue="umang_admin"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:border-[#006039] transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[2px] text-gray-500 font-bold mb-2">
              Passcode
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:border-[#006039] transition-colors text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#006039] text-white py-4 mt-4 text-[11px] uppercase tracking-[3px] font-bold hover:bg-[#004d2e] transition-colors shadow-lg"
          >
            Enter Vault
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] uppercase tracking-[2px] text-gray-400 hover:text-[#212121] transition-colors font-bold"
          >
            ← Return to Showroom
          </button>
        </div>
      </div>
    </div>
  );
}