import React from "react";
import { UserStatsSkeleton, TableSkeleton } from "@/components/LoadingSkeletons";

export default function AdminLoading() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-64" />
                    <div className="h-4 bg-gray-50 rounded animate-pulse w-48" />
                </div>
                <div className="w-48 h-14 bg-gray-50 rounded-2xl animate-pulse" />
            </header>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-50 h-32 rounded-[2.5rem] animate-pulse" />
                ))}
            </div>

            {/* Recent Operations Skeleton */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <div className="h-6 bg-gray-100 rounded w-48 mb-8 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Client Registry Skeleton */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-6 bg-gray-100 rounded w-48 animate-pulse" />
                    <div className="h-12 bg-gray-50 rounded-2xl w-96 animate-pulse" />
                </div>
                <TableSkeleton rows={8} />
            </div>
        </div>
    );
}
