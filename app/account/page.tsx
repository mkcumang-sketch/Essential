"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PremiumAccountDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dashData, setDashData] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;

        fetch(`/api/user/dashboard?t=${Date.now()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                // API contract: { success: true, data: { orders: [] ... } }
                const data = json?.data ?? null;
                setDashData(data);
            })
            .catch(() => {
                setDashData(null);
            });
    }, [status]);

    useEffect(() => {
        console.log("Dashboard Data Received:", dashData);
    }, [dashData]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center">
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[5px] animate-pulse">
                    Loading Account...
                </p>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    const email = session?.user?.email || "Unknown";

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-10">
            <div className="w-full max-w-xl border border-[#D4AF37]/35 bg-black/40 backdrop-blur-xl rounded-[28px] p-10">
                <h1 className="text-2xl font-serif font-bold tracking-wide mb-6 text-[#D4AF37]">
                    Account (Debug Mode)
                </h1>
                <p className="text-sm text-white/90 mb-2">
                    <span className="text-white/60">Email:</span> {email}
                </p>
                <p className="text-sm text-white/90">
                    <span className="text-white/60">Orders:</span> {dashData?.orders?.length || 0}
                </p>
            </div>
        </div>
    );
}