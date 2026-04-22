"use client"; // 🚀 Ye line Next.js ko bata rahi hai ki ye Client Component hai

import dynamic from 'next/dynamic';

// Yahan hum safely ssr: false use kar sakte hain
const AdminAnalytics = dynamic(() => import('./AdminAnalytics'), { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-3xl" />
});

export default function AdminAnalyticsWrapper() {
    return <AdminAnalytics />;
}