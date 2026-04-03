'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// 🖱️ ULTRA-HIGH MODE: Custom Magnetic Cursor
export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // 🚨 SSR FIX: Check if window exists (browser environment)
        if (typeof window === 'undefined') return;
        
        // Only show custom cursor on desktop
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);

        // Add hover detection for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="rounded-full bg-white"
                    animate={{
                        width: isHovering ? 48 : 12,
                        height: isHovering ? 48 : 12,
                        x: isHovering ? -24 : -6,
                        y: isHovering ? -24 : -6,
                        opacity: 0.9,
                    }}
                    transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                    }}
                />
            </motion.div>

            {/* Cursor ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="rounded-full border border-[#D4AF37]"
                    animate={{
                        width: isHovering ? 64 : 24,
                        height: isHovering ? 64 : 24,
                        x: isHovering ? -32 : -12,
                        y: isHovering ? -32 : -12,
                        opacity: isHovering ? 0.6 : 0.3,
                        borderWidth: isHovering ? 2 : 1,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 400,
                        delay: 0.05,
                    }}
                />
            </motion.div>

            {/* Hide default cursor */}
            <style jsx global>{`
                @media (pointer: fine) {
                    * {
                        cursor: none !important;
                    }
                }
            `}</style>
        </>
    );
}

// 🧲 Magnetic Effect Hook
export function useMagneticEffect() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = (e.clientX - centerX) * 0.15;
        const distanceY = (e.clientY - centerY) * 0.15;
        
        x.set(distanceX);
        y.set(distanceY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { x: xSpring, y: ySpring, handleMouseMove, handleMouseLeave };
}
