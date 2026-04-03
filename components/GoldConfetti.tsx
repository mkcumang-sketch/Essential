'use client';

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

// 🎊 ULTRA-HIGH MODE: Gold Particle Confetti Effect
export function useGoldConfetti() {
    const triggerConfetti = useCallback((options?: { x?: number; y?: number }) => {
        const defaults = {
            origin: options ? { x: options.x || 0.5, y: options.y || 0.5 } : { x: 0.5, y: 0.5 },
            colors: ['#D4AF37', '#F4E4BC', '#FFD700', '#B8860B', '#FFFFFF'],
            particleCount: 100,
            spread: 70,
            startVelocity: 30,
            gravity: 0.8,
            scalar: 1.2,
            drift: 0,
            ticks: 100,
            disableForReducedMotion: true,
        };

        // Left burst
        confetti({
            ...defaults,
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: options?.x ? options.x - 0.05 : 0.45, y: options?.y || 0.5 },
        });

        // Right burst
        confetti({
            ...defaults,
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: options?.x ? options.x + 0.05 : 0.55, y: options?.y || 0.5 },
        });

        // Center burst
        confetti({
            ...defaults,
            particleCount: 30,
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
            origin: { x: options?.x || 0.5, y: options?.y || 0.5 },
        });
    }, []);

    return triggerConfetti;
}

// 🎉 Success Celebration with Gold Theme
export function triggerGoldCelebration() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        colors: ['#D4AF37', '#F4E4BC', '#FFD700', '#B8860B', '#FFFFFF'],
        particleCount: 50,
        scalar: 1.2,
        disableForReducedMotion: true,
    };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Launch from left
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        
        // Launch from right
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);

    return () => clearInterval(interval);
}
