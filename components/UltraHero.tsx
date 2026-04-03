'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// 🎬 ULTRA-HIGH MODE: Scroll-Telling Hero Section
export function ScrollTellingHero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const timepieceRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current || !timepieceRef.current) return;

        const ctx = gsap.context(() => {
            // Timepiece scale and rotation on scroll
            gsap.to(timepieceRef.current, {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
                scale: 1.3,
                rotation: 15,
                y: -50,
                ease: "none",
            });

            // Text fade and slide
            gsap.to(textRef.current, {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "center top",
                    scrub: 1,
                },
                opacity: 0,
                y: -100,
                ease: "none",
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div 
            ref={heroRef}
            className="relative h-screen w-full overflow-hidden bg-[#FAFAFA]"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-[#F5F5F5] to-[#FAFAFA]" />
            
            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />

            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                {/* Timepiece container */}
                <motion.div
                    ref={timepieceRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-full max-w-lg aspect-square"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl scale-110" />
                    
                    {/* Timepiece image */}
                    <img
                        src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80"
                        alt="Luxury Timepiece"
                        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                    />
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-[#D4AF37] rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: [0, 1, 0],
                                    y: [-20, -60],
                                    x: [0, (i - 2) * 20]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    left: `${50 + (i - 2) * 15}%`,
                                    top: '50%'
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Text content */}
                <div ref={textRef} className="absolute bottom-32 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl md:text-7xl font-serif text-gray-900 mb-4"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        Essential Rush
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg text-gray-600 tracking-wider"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                    
                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ 
                            opacity: { duration: 0.5, delay: 0.8 },
                            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="mt-8"
                    >
                        <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Glassmorphism overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
        </div>
    );
}

// 🎭 Magnetic Tilt Card Component
interface MagneticCardProps {
    children: React.ReactNode;
    className?: string;
}

export function MagneticCard({ children, className = "" }: MagneticCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`transform-gpu perspective-1000 ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}
