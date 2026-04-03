"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function PhoneGuard() {
    const { data: session, update, status } = useSession();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Agar loading chal rahi hai, ya user logged in nahi hai, 
    // YA phir user ke paas pehle se phone number hai -> Toh ye component gayab rahega.
    if (status === "loading" || status === "unauthenticated" || (session?.user as any)?.phone) {
        return null;
    }

    // Agar login hai, par phone null hai, toh ye form dikhega
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/update-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to secure account");

            // 🔥 MAGIC TRICK: Update NextAuth session in real-time
            // Isse page refresh kiye bina popup khud band ho jayega
            await update({ phone: phone });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-[#0f0f0f] border border-[#d4af37]/30 p-8 rounded-lg max-w-md w-full shadow-2xl text-center">
                <div className="mb-6">
                    <span className="text-3xl mb-2 block">🛡️</span>
                    <h2 className="text-2xl text-white font-serif tracking-widest">SECURE YOUR VAULT</h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        Welcome to Essential Rush, {session?.user?.name?.split(' ')[0]}.<br/>
                        Please link a valid phone number to complete your luxury profile.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="tel"
                            placeholder="+91 Mobile Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:border-[#d4af37] transition-colors"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-left">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d4af37] text-black font-bold tracking-widest py-3 rounded hover:bg-white transition-all disabled:opacity-50"
                    >
                        {loading ? "SECURING..." : "ENTER VAULT"}
                    </button>
                </form>
            </div>
        </div>
    );
}