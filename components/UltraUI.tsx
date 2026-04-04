'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// 🎭 ULTRA-HIGH MODE: Fluid Page Transitions
export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.4,
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// 💎 Glassmorphism Card Component
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
    return (
        <motion.div
            className={`
                backdrop-blur-xl 
                bg-white/70 
                border border-white/50 
                shadow-lg 
                shadow-black/5
                rounded-3xl
                ${hover ? 'hover:bg-white/80 hover:shadow-xl hover:shadow-black/10' : ''}
                transition-all duration-300
                ${className}
            `}
            whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
            whileTap={hover ? { scale: 0.98 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {children}
        </motion.div>
    );
}

// ✨ Shimmer Effect for Gold Vault Badges
export function GoldShimmer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Shimmer overlay */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                }}
                animate={{
                    backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            {children}
        </div>
    );
}

// 🏆 Gold Vault Badge with Shimmer
export function GoldVaultBadge({ tier = "Gold" }: { tier?: string }) {
    const isGold = tier === "Gold";
    
    return (
        <GoldShimmer>
            <div 
                className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full
                    ${isGold 
                        ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40' 
                        : 'bg-gray-100 border border-gray-200'
                    }
                `}
            >
                <motion.div
                    animate={isGold ? {
                        rotate: [0, 360],
                    } : {}}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {isGold ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37]">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                    )}
                </motion.div>
                <span 
                    className={`text-[10px] font-black uppercase tracking-[2px] ${isGold ? 'text-[#D4AF37]' : 'text-gray-500'}`}
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                    {isGold ? 'Gold' : 'Silver'}
                </span>
            </div>
        </GoldShimmer>
    );
}

// 🎨 Luxury Typography Classes
export const luxuryTypography = {
    serif: "font-serif",
    mono: "font-mono",
    heading: "text-5xl md:text-7xl font-serif text-gray-900",
    subheading: "text-2xl md:text-3xl font-serif text-gray-900",
    body: "text-base text-gray-600 leading-relaxed",
    caption: "text-[10px] font-black uppercase tracking-[4px] text-gray-400",
    number: "font-mono tabular-nums",
};
