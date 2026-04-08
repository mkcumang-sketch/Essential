import React from "react";
import { UserStatsSkeleton, TableSkeleton } from "@/components/LoadingSkeletons";

export default function AdminLoading() {
    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="h-12 bg-gray-100 rounded-2xl animate-pulse w-72" />
                    <div className="h-4 bg-gray-50 rounded-lg animate-pulse w-56" />
                </div>
                <div className="w-56 h-20 bg-gray-50 rounded-[2rem] animate-pulse" />
            </header>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-50 h-36 rounded-[2.5rem] animate-pulse" />
                ))}
            </div>

            {/* Recent Operations Skeleton */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xl shadow-gray-50">
                <div className="h-8 bg-gray-100 rounded-xl w-64 mb-10 animate-pulse" />
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-24 bg-gray-50/50 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Client Registry Skeleton */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-50">
                <div className="flex justify-between items-center mb-10">
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-100 rounded-xl w-56 animate-pulse" />
                        <div className="h-3 bg-gray-50 rounded-lg w-32 animate-pulse" />
                    </div>
                    <div className="h-16 bg-gray-50 rounded-[1.5rem] w-[28rem] animate-pulse" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-20 bg-gray-50/30 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
