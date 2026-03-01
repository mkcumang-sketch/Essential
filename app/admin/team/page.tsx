"use client";
import { Users, ShieldCheck, Mail } from "lucide-react";

export default function AdminTeam() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-luxury italic text-[#001A33]">Team Hierarchy</h1>
      <div className="bg-white rounded-3xl border border-blue-50 overflow-hidden">
        <div className="p-8 flex items-center gap-6 border-b border-blue-50">
          <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold">U</div>
          <div>
            <h3 className="text-xl font-bold">Umang Kumar</h3>
            <p className="text-xs text-[#001A33] font-black uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} /> Super Admin (us7081569@gmail.com)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}