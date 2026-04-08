"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    color: string;
}

export default function StatCard({ title, value, icon, trend, color }: StatCardProps) {
    return (
        <div className={`${color} p-10 rounded-[3rem] relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]`}>
            <div className="absolute -top-4 -right-4 p-10 opacity-[0.08] group-hover:opacity-20 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 text-current">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{title}</p>
                    <span className="flex items-center gap-1 text-[9px] font-black bg-white/10 px-3 py-1 rounded-full text-green-400 border border-green-400/20 shadow-lg shadow-green-400/5">
                        <ArrowUpRight size={10} /> {trend}
                    </span>
                </div>
                <h3 className="text-4xl font-serif font-black italic tracking-tighter leading-none">{value}</h3>
            </div>
            
            {/* Glassmorphism Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
    );
}
