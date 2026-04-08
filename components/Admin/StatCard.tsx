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
        <div className={`${color} p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</p>
                    <span className="flex items-center gap-1 text-[8px] font-black bg-white/10 px-2 py-0.5 rounded text-green-400">
                        <ArrowUpRight size={10} /> {trend}
                    </span>
                </div>
                <h3 className="text-3xl font-serif font-black italic tracking-tighter">{value}</h3>
            </div>
        </div>
    );
}
