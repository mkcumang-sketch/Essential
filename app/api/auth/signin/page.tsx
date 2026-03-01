"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");

  const handleManualLogin = async (e: any) => {
    e.preventDefault();
    await signIn("credentials", { username: id, password: pass, callbackUrl: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border">
        <h1 className="text-3xl font-serif italic font-bold text-center mb-8">Essential Admin</h1>
        
        <form onSubmit={handleManualLogin} className="space-y-4 mb-8">
          <input 
            type="text" 
            placeholder="Admin ID" 
            className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setId(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-orange-600 transition-all">
            Login to Dashboard
          </button>
        </form>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-widest">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}