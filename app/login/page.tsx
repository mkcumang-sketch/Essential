"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { ShieldCheck, Lock } from "lucide-react";

export default function LoginPage() {
  // Ye dono lines missing thi jiski wajah se laal error aa raha tha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Authenticating Commander...");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // 👈 Hum manually redirect karenge
    });

    if (res?.error) {
      toast.error("Access Denied: Invalid Credentials", { id: toastId });
    } else if (res?.ok) {
      toast.success("Welcome back, Commander", { id: toastId });
      // Hard reload taaki middleware fresh cookie padh sake
      window.location.href = "/admin"; 
    }
  };

  // ... (Upar ka imports aur handleLogin function same rahega) ...

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl border-t-4 border-[#E3000F]">
        <div className="flex justify-center mb-6 text-[#E3000F]">
          <ShieldCheck size={56} />
        </div>
        <h1 className="text-3xl font-luxury italic text-center text-[#111827] mb-2">Swiss Time House</h1>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400 mb-10">
          Authorized Admin Portal
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#111827] mb-2 block">Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-sm focus:outline-none focus:border-[#E3000F] transition"
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[#111827] mb-2 block">Secure Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-sm focus:outline-none focus:border-[#E3000F] transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#E3000F] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition shadow-lg flex justify-center items-center gap-2"
          >
            <Lock size={14} /> Initialize Session
          </button>
        </form>
      </div>
    </div>
  );
}