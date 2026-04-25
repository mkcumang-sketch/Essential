"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const refCode = searchParams.get('ref');
        
        if (refCode) {
            const code = refCode.trim().toUpperCase();
            const savedCode = localStorage.getItem('active_referral');

            if (savedCode !== code) {
                localStorage.setItem('active_referral', code);

                fetch('/api/agents/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                }).catch(err => console.error("Tracking API failed", err));
            }
        }
    }, [searchParams]);

    return null; 
}